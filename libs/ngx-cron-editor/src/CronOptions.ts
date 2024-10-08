export type CronFlavor = 'standard' | 'quartz';

export interface CronOptions {
    formInputClass?: string;
    formSelectClass?: string;
    formRadioClass?: string;
    formCheckboxClass?: string;

    defaultTime: string,

    hideMinutesTab: boolean;
    hideHourlyTab: boolean;
    hideDailyTab: boolean;
    hideWeeklyTab: boolean;
    hideMonthlyTab: boolean;
    hideYearlyTab: boolean;
    hideAdvancedTab: boolean;
    hideSpecificWeekDayTab: boolean;
    hideSpecificMonthWeekTab: boolean;

    use24HourTime: boolean;
    hideSeconds: boolean;

    cronFlavor: CronFlavor;
}

export class DefaultOptions implements  CronOptions {

  cronFlavor: CronFlavor = 'standard';
  defaultTime = '00:00:00';
  hideAdvancedTab = false;
  hideDailyTab = false;
  hideHourlyTab = false;
  hideMinutesTab = false;
  hideMonthlyTab = false;
  hideSeconds = false;
  hideSpecificMonthWeekTab = false;
  hideSpecificWeekDayTab = false;
  hideWeeklyTab = false;
  hideYearlyTab = false;
  use24HourTime = true;
}
