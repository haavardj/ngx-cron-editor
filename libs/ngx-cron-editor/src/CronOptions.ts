export type CronFlavor = 'standard' | 'quartz';

export interface CronOptions {
    hideMinutesTab: boolean;
    hideHourlyTab: boolean;
    hideDailyTab: boolean;
    hideWeeklyTab: boolean;
    hideMonthlyTab: boolean;
    hideYearlyTab: boolean;
    hideAdvancedTab: boolean;

    use24HourTime: boolean;
    hideSeconds: boolean;

    cronFlavor: CronFlavor;
}

export class DefaultOptions implements  CronOptions {

  cronFlavor: CronFlavor = 'standard';
  hideAdvancedTab = false;
  hideDailyTab = false;
  hideHourlyTab = false;
  hideMinutesTab = false;
  hideMonthlyTab = false;
  hideSeconds = false;
  hideWeeklyTab = false;
  hideYearlyTab = false;
  use24HourTime = true;
}
