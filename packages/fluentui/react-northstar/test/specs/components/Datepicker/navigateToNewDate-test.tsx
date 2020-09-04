import { navigateToNewDate } from 'src/components/Datepicker/navigateToNewDate';
import { compareDatePart } from '@fluentui/date-time-utilities';

describe('navigateToNewDate', () => {
  const referenceDate = new Date(2020, 0, 10);

  it('Navigation works for day', () => {
    const result = navigateToNewDate(referenceDate, 'Day', 1, {});
    expect(compareDatePart(result, new Date(2020, 0, 11))).toBeFalsy();
  });
  it('Navigation works for week', () => {
    const result = navigateToNewDate(referenceDate, 'Week', -1, {});
    expect(compareDatePart(result, new Date(2020, 0, 3))).toBeFalsy();
  });
  it('Navigation works for month', () => {
    const result = navigateToNewDate(referenceDate, 'Month', 1, {});
    expect(compareDatePart(result, new Date(2020, 1, 10))).toBeFalsy();
  });

  it('Restricted week jump can jump by bigger steps', () => {
    const result = navigateToNewDate(referenceDate, 'Week', 7, { restrictedDates: [new Date(2020, 0, 17)] });
    expect(compareDatePart(result, new Date(2020, 0, 24))).toBeFalsy();
  });
  it('Restricted day backward jumps back to min', () => {
    const result = navigateToNewDate(referenceDate, 'Day', -1, { minDate: referenceDate });
    expect(compareDatePart(result, referenceDate)).toBeFalsy();
  });
  it('Restricted month forward jumps back to max', () => {
    const result = navigateToNewDate(referenceDate, 'Month', 1, { maxDate: referenceDate });
    expect(compareDatePart(result, referenceDate)).toBeFalsy();
  });
});
