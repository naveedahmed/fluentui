import { ListItemContent } from 'src/components/List/ListItemContent';
import { isConformant } from 'test/specs/commonTests';

describe('ListItemContent', () => {
  isConformant(ListItemContent, { constructorName: 'ListItemContent' });
});
