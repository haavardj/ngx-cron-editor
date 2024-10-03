export type CronFlavor = 'standard' | 'quartz';
export interface CronOptions {
    formInputClass?: string;
    formSelectClass?: string;
    formRadioClass?: string;
    formCheckboxClass?: string;
    defaultTime: string;
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
export declare class DefaultOptions implements CronOptions {
    cronFlavor: CronFlavor;
    defaultTime: string;
    hideAdvancedTab: boolean;
    hideDailyTab: boolean;
    hideHourlyTab: boolean;
    hideMinutesTab: boolean;
    hideMonthlyTab: boolean;
    hideSeconds: boolean;
    hideSpecificMonthWeekTab: boolean;
    hideSpecificWeekDayTab: boolean;
    hideWeeklyTab: boolean;
    hideYearlyTab: boolean;
    use24HourTime: boolean;
}
