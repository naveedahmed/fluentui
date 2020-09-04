import { SourceFile } from 'ts-morph';
import {
  CodeMod,
  RenamePropModType,
  RepathImportModType,
  CodeModMapType,
  ModOptions,
  RenameImportType,
  NoOp,
  ModResult,
} from '../../types';
import { findJsxTag, renameProp, getImportsByPath, repathImport, renameImport } from '../../utilities/index';
import { Ok, Err, Result } from '../../../helpers/result';

import jsonObj from '../upgrades.json';

/* Creates and returns an array of CodeMod objects from a JSON file. Optionally takes in
   an array of functions from user to turn into codemods as well. */
export function createCodeModsFromJson(userMods?: CodeMod[]): CodeMod[] | undefined {
  const funcs = getCodeModsFromJson();
  /* If the user wants to supply any codemods (as a void function that takes in a sourcefile),
     add those offerings right now! */
  if (userMods) {
    funcs.concat(userMods);
  }
  return funcs;
}

/* Helper function that parses a json object for details about individual
   codemods and formats each into a function. These functions are stored in
   an array that is returned to the user. */
export function getCodeModsFromJson(): CodeMod[] {
  const mods = [];
  const modDetails = jsonObj.upgrades;
  for (let i = 0; i < modDetails.length; i++) {
    /* Try and get the codemod function associated with the mod type. */
    const func = codeModMap[modDetails[i].type](modDetails[i]);
    if (func) {
      const options: ModOptions = {
        name: modDetails[i].name,
        version: modDetails[i].version ? modDetails[i].version! : '100000',
      };
      mods.push(createCodeMod(options, func));
    } else {
      // eslint-disable-next-line no-throw-literal
      throw 'Error: attempted to access a codeMod mapping from an unsupported type.';
    }
  }
  return mods;
}

/* Helper function that creates a codeMod given a name and a list of functions that compose the mod. */
export function createCodeMod(options: ModOptions, mod: (file: SourceFile) => Result<ModResult, NoOp>): CodeMod {
  return {
    run: (file: SourceFile) => {
      try {
        /* Codemod body. */
        return mod(file);
      } catch (e) {
        return Err({ reason: `Catching unhandled error: ${e}` });
      }
    },
    version: options.version,
    name: options.name,
    enabled: true,
  };
}

/* Dictionary that maps codemod names to functions that execute said mod.
   Used by getCodeModUtilitiesFromJson to easily get the desired function
   from the json object. */
const codeModMap: CodeModMapType = {
  renameProp: function(mod: RenamePropModType) {
    return function(file: SourceFile) {
      const tags = findJsxTag(file, mod.options.from.importName);
      const res = renameProp(tags, mod.options.from.toRename, mod.options.to.replacementName);
      if (res.ok) {
        return Ok({ logs: [res.value] });
      } else {
        return Err({
          reason: `unable to rename the prop ${mod.options.from.toRename} in all files.`,
        });
      }
    };
  },
  repathImport: function(mod: RepathImportModType) {
    return function(file: SourceFile) {
      /* If the json indicates our search string is a regex, convert it. */
      const searchString = mod.options.from.isRegex
        ? new RegExp(
            (mod.options.from.searchString as string)
              .substring(1)
              .substring(0, (mod.options.from.searchString as string).length - 2),
          )
        : mod.options.from.searchString;
      const res = getImportsByPath(file, searchString).then(v =>
        v.map(imp => repathImport(imp, mod.options.to.replacementValue)),
      );
      if (res.ok) {
        return Ok({ logs: ['Successfully repathed imports'] });
      } else {
        return Err({ reason: `Unable to repath imports to ${mod.options.to.replacementValue} in all files.` });
      }
    };
  },
  renameImport: function(mod: RenameImportType) {
    return function(file: SourceFile) {
      return renameImport(file, mod.options.from.originalImport, mod.options.to.renamedImport);
    };
  },
};

/* ConfigMod is also an exportable code mod. All it does is wrap all of
   the codemods from the json file into a single code mod, so that devs
   can very easily run mods from json with a (npx fluent... -n "configMod"). */
const configMod: CodeMod = {
  run: (file: SourceFile) => {
    const mods = getCodeModsFromJson();
    if (mods === undefined || mods.length === 0) {
      return Err({ reason: `failed to get any mods from json. Perhaps the file is missing or malformed?` });
    }
    mods.forEach(mod => {
      const res = mod.run(file);
      if (!res.ok) {
        return Err({ reason: `code mod ${mod.name} failed to run on ${file.getBaseName()}` });
      }
    });
    return Ok({ logs: [`ran modConfig successfully on ${file.getBaseName()}`] });
  },
  name: 'configMod',
  version: '1.0.0',
  enabled: true,
};

export default configMod;
