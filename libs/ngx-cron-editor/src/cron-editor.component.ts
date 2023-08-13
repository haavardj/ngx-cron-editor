import {Component, Input, Output, OnInit, EventEmitter, forwardRef, ViewChild} from '@angular/core';
import { CronOptions } from './CronOptions';
import { Days, MonthWeeks, Months } from './enums';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import {MatTab, MatTabChangeEvent} from '@angular/material/tabs';

type cronType = 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'unknown';

interface ICronModel {
  type: cronType,
  months: 0,
  monthsWeek: '#1',
  day: 'MON',
  days: 0,
  hours: 0,
  perHour: 0,
  minutes: 1,
  perMinute: 0,
  seconds: 0,
  hoursType: 'AM',
  weekdaysOnly: false,
  MON: true,
  TUE: true,
  WED: true,
  THU: true,
  FRI: true,
  SAT: true,
  SUN: true,
  expression: ''
}


export const CRON_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CronGenComponent),
  multi: true,
};


@Component({
  selector: 'cron-editor',
  templateUrl: './cron-editor.template.html',
  styleUrls: ['./cron-editor.component.css'],
  providers: [CRON_VALUE_ACCESSOR]
})
export class CronGenComponent implements OnInit, ControlValueAccessor {
  @Input() public backgroundColor: ThemePalette;
  @Input() public color: ThemePalette;
  @Input() public disabled: boolean;
  @Input() public options: CronOptions;
  // the name is an Angular convention, @Input variable name + "Change" suffix
  @Output() cronChange = new EventEmitter<string>();

  public activeTab: string;
  public selectOptions = this.getSelectOptions();
  public state: any;

  private localCron = '0 0 1/1 * *';
  private isDirty: boolean;

  cronForm: FormControl;

  @ViewChild('minutesTab')
  minutesTab: MatTab;

  hourlyForm: FormGroup;
  @ViewChild('hourlyTab')
  hourlyTab: MatTab;

  dailyForm: FormGroup;
  @ViewChild('dailyTab')
  dailyTab: MatTab;

  weeklyForm: FormGroup;
  @ViewChild('weeklyTab')
  weeklyTab: MatTab;

  monthlyForm: FormGroup;
  @ViewChild('monthlyTab')
  monthlyTab: MatTab;

  yearlyForm: FormGroup;
  @ViewChild('yearlyTab')
  yearlyTab: MatTab;

  advancedForm: FormGroup;
  @ViewChild('advancedTab')
  advancedTab: MatTab;

  allForm: FormGroup;



  get isCronFlavorQuartz() {
    return this.options.cronFlavor === 'quartz';
  }

  get isCronFlavorStandard() {
    return this.options.cronFlavor === 'standard';
  }

  get yearDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '*' : '';
  }

  get weekDayDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '?' : '*';
  }

  get monthDayDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '?' : '*';
  }

  constructor(private fb: FormBuilder) {

    const [defaultHours, defaultMinutes, defaultSeconds] = this.options.defaultTime.split(':').map(Number);

    this.allForm = this.fb.group({
      type: [<cronType> 'unknown'],
      months: [0],
      monthsWeek: ['#1'],
      day: ['1'], // '1' or 'MON;
      days: [0],
      hours: [this.getAmPmHour(defaultHours)],
      hoursPer: [0],
      minutes: [defaultMinutes],
      minutesPer: [0],
      seconds: [defaultSeconds],
      hoursType: [this.getHourType(defaultHours)],
      weekdaysOnly: [false],
      MON: [true],
      TUE: [true],
      WED: [true],
      THU: [true],
      FRI: [true],
      SAT: [true],
      SUN: [true],
      expression: ['']
    })
  }

  /* Update the cron output to that of the selected tab.
   * The cron output value is updated whenever a form is updated. To make it change in response to tab selection, we simply reset
   * the value of the form that goes into focus.
   * We cannot rely on the index of the tab, as the hide options could hide tabs and
   * then the index dynamically changes based on the hidden tab.*/
  onTabChange(tabChangeEvent: MatTabChangeEvent) {
    const currentTab = tabChangeEvent.tab;

    if (currentTab === this.minutesTab) {
      this.allForm.setValue({type: <cronType> 'minutely'});
    } else if (currentTab === this.hourlyTab) {
      this.allForm.setValue({type: <cronType> 'hourly'});
    } else if (currentTab === this.dailyTab) {
      this.allForm.setValue({type: <cronType> 'daily'});
    } else if (currentTab === this.weeklyTab) {
      this.allForm.setValue({type: <cronType> 'weekly'});
    } else if (currentTab === this.monthlyTab) {
      this.allForm.setValue({type: <cronType> 'monthly'});
    } else if (currentTab === this.yearlyTab) {
      this.allForm.setValue({type: <cronType> 'yearly'});
    } else if (currentTab === this.advancedTab) {
      this.allForm.setValue({type: <cronType> 'unknown'});
    } else {
      throw(new Error('Invalid tab selected'));
    }
  }

  public async ngOnInit() {
    this.state = this.getDefaultState();

    const [defaultHours, defaultMinutes, defaultSeconds] = this.options.defaultTime.split(':').map(Number);

    this.cronForm = new FormControl('0 0 1/1 * *');

    this.allForm.valueChanges.subscribe(value => this.computeCron(value));
  }


  private computeCron(state: any) {

    let cron: string;
    switch (<cronType> state.type) {
      case 'minutely':
        cron = this.computeMinutesCron(state);
        break;
      case 'daily':
        cron = this.computeDailyCron(state);
        break;
      case 'hourly':
        cron = this.computeHourlyCron(state);
        break;
      case 'monthly':
        cron = this.computeHourlyCron(state);
        break;
      case 'weekly':
        cron = this.computeWeeklyCron(state);
        break;
      case 'yearly':
        cron = this.computeYearlyCron(state);
        break;
      case 'unknown':
        cron = this.computeAdvancedExpression(state);
        break;
      default:
        throw Error('Unknown cron type ' + state.type);
    }

    this.cronForm.setValue(cron);
  }

  private computeMinutesCron(state: any): string {
    // tslint:disable-next-line:max-line-length
    return `${this.isCronFlavorQuartz ? state.seconds : ''} 0/${state.minutes} * 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeHourlyCron(state: any): string {
   return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} 0/${state.hours} 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeDailyCron(state: any): string {
    switch (state.subTab) {
      case 'everyDays':
        return this.computeEveryDaysCron(state);
      case 'everyWeekDay':
        return this.computeEveryWeekdayCron(state);
      default:
        throw new Error('Invalid cron daily subtab selection');
    }
  }

  private computeEveryDaysCron(state: any): string {
    return `${this.isCronFlavorQuartz ? state.everyDays.seconds : ''} ${state.everyDays.minutes} ${this.hourToCron(state.everyDays.hours, state.everyDays.hourType)} 1/${state.everyDays.days} * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();

  }

  private computeEveryWeekdayCron(state: any): string {
    return `${this.isCronFlavorQuartz ? state.everyWeekDay.seconds : ''} ${state.everyWeekDay.minutes} ${this.hourToCron(state.everyWeekDay.hours, state.everyWeekDay.hourType)} ${this.monthDayDefaultChar} * MON-FRI ${this.yearDefaultChar}`.trim();
  }


  private computeWeeklyCron(state: any): string  {
    const days = this.selectOptions.days
      .reduce((acc, day) => state[day] ? acc.concat([day]) : acc, [])
      .join(',');
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hourType)} ${this.monthDayDefaultChar} * ${days} ${this.yearDefaultChar}`.trim();
  }

  private computeMonthlyCron(state: any): string {
    switch (state.subTab) {
      case 'specificDay':
        return `${this.isCronFlavorQuartz ? state.specificDay.seconds : ''} ${state.specificDay.minutes} ${this.hourToCron(state.specificDay.hours, state.specificDay.hourType)} ${state.specificDay.day} 1/${state.specificDay.months} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
      case 'specificWeekDay':
        return `${this.isCronFlavorQuartz ? state.specificWeekDay.seconds : ''} ${state.specificWeekDay.minutes} ${this.hourToCron(state.specificWeekDay.hours, state.specificWeekDay.hourType)} ${this.monthDayDefaultChar} 1/${state.specificWeekDay.months} ${state.specificWeekDay.day}${state.specificWeekDay.monthWeek} ${this.yearDefaultChar}`.trim();
      default:
        throw new Error('Invalid cron montly subtab selection');
    }
  }

  private computeYearlyCron(state: any): string {
    switch (state.subTab) {
      case 'specificMonthDay':
        return `${this.isCronFlavorQuartz ? state.specificMonthDay.seconds : ''} ${state.specificMonthDay.minutes} ${this.hourToCron(state.specificMonthDay.hours, state.specificMonthDay.hourType)} ${state.specificMonthDay.day} ${state.specificMonthDay.month} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
      case 'specificMonthWeek':
        return `${this.isCronFlavorQuartz ? state.specificMonthWeek.seconds : ''} ${state.specificMonthWeek.minutes} ${this.hourToCron(state.specificMonthWeek.hours, state.specificMonthWeek.hourType)} ${this.monthDayDefaultChar} ${state.specificMonthWeek.month} ${state.specificMonthWeek.day}${state.specificMonthWeek.monthWeek} ${this.yearDefaultChar}`.trim();
      default:
        throw new Error('Invalid cron yearly subtab selection');
    }
  }

  private computeAdvancedExpression(state: any) {
    return state.expression;
  }

  public dayDisplay(day: string): string {
    return Days[day];
  }

  public monthWeekDisplay(monthWeekNumber: string): string {
    return MonthWeeks[monthWeekNumber];
  }

  public monthDisplay(month: number): string {
    return Months[month];
  }

  public monthDayDisplay(month: string): string {
    if (month === 'L') {
      return 'Last Day';
    } else if (month === 'LW') {
      return 'Last Weekday';
    } else if (month === '1W') {
      return 'First Weekday';
    } else {
      return `${month}${this.getOrdinalSuffix(month)}`;
    }
  }

  private getAmPmHour(hour: number) {
    return this.options.use24HourTime ? hour : (hour + 11) % 12 + 1;
  }

  private getHourType(hour: number) {
    return this.options.use24HourTime ? undefined : (hour >= 12 ? 'PM' : 'AM');
  }

  private hourToCron(hour: number, hourType: string) {
    if (this.options.use24HourTime) {
      return hour;
    } else {
      return hourType === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    }
  }

  private handleModelChange(cron: string) {
    if (this.isDirty) {
      this.isDirty = false;
      return;
    } else {
      this.isDirty = false;
    }

    if (!this.cronIsValid(cron)) {
      if (this.isCronFlavorQuartz) {
        throw new Error('Invalid cron expression, there must be 6 or 7 segments');
      }

      if (this.isCronFlavorStandard) {
        throw new Error('Invalid cron expression, there must be 5 segments');
      }
    }

    const origCron: string = cron;
    if (cron.split(' ').length === 5 && this.isCronFlavorStandard) {
      cron = `0 ${cron} *`;
    }

    const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = cron.split(' ');

    if (cron.match(/\d+ 0\/\d+ \* 1\/1 \* [\?\*] \*/)) {
      this.activeTab = 'minutes';

      this.state.minutes.minutes = parseInt(minutes.substring(2), 10);
      this.state.minutes.seconds = parseInt(seconds, 10);
    } else if (cron.match(/\d+ \d+ 0\/\d+ 1\/1 \* [\?\*] \*/)) {
      this.activeTab = 'hourly';

      this.state.hourly.hours = parseInt(hours.substring(2), 10);
      this.state.hourly.minutes = parseInt(minutes, 10);
      this.state.hourly.seconds = parseInt(seconds, 10);
    } else if (cron.match(/\d+ \d+ \d+ 1\/\d+ \* [\?\*] \*/)) {
      this.activeTab = 'daily';

      this.state.daily.subTab = 'everyDays';
      this.state.daily.everyDays.days = parseInt(dayOfMonth.substring(2), 10);
      const parsedHours = parseInt(hours, 10);
      this.state.daily.everyDays.hours = this.getAmPmHour(parsedHours);
      this.state.daily.everyDays.hourType = this.getHourType(parsedHours);
      this.state.daily.everyDays.minutes = parseInt(minutes, 10);
      this.state.daily.everyDays.seconds = parseInt(seconds, 10);
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \* MON-FRI \*/)) {
      this.activeTab = 'daily';

      this.state.daily.subTab = 'everyWeekDay';
      const parsedHours = parseInt(hours, 10);
      this.state.daily.everyWeekDay.hours = this.getAmPmHour(parsedHours);
      this.state.daily.everyWeekDay.hourType = this.getHourType(parsedHours);
      this.state.daily.everyWeekDay.minutes = parseInt(minutes, 10);
      this.state.daily.everyWeekDay.seconds = parseInt(seconds, 10);
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      this.activeTab = 'weekly';
      this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
      dayOfWeek.split(',').forEach(weekDay => this.state.weekly[weekDay] = true);
      const parsedHours = parseInt(hours, 10);
      this.state.weekly.hours = this.getAmPmHour(parsedHours);
      this.state.weekly.hourType = this.getHourType(parsedHours);
      this.state.weekly.minutes = parseInt(minutes, 10);
      this.state.weekly.seconds = parseInt(seconds, 10);
    } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ [\?\*] \*/)) {
      this.activeTab = 'monthly';
      this.state.monthly.subTab = 'specificDay';
      this.state.monthly.specificDay.day = dayOfMonth;
      this.state.monthly.specificDay.months = parseInt(month.substring(2), 10);
      const parsedHours = parseInt(hours, 10);
      this.state.monthly.specificDay.hours = this.getAmPmHour(parsedHours);
      this.state.monthly.specificDay.hourType = this.getHourType(parsedHours);
      this.state.monthly.specificDay.minutes = parseInt(minutes, 10);
      this.state.monthly.specificDay.seconds = parseInt(seconds, 10);
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
      const day = dayOfWeek.substr(0, 3);
      const monthWeek = dayOfWeek.substr(3);
      this.activeTab = 'monthly';
      this.state.monthly.subTab = 'specificWeekDay';
      this.state.monthly.specificWeekDay.monthWeek = monthWeek;
      this.state.monthly.specificWeekDay.day = day;
      this.state.monthly.specificWeekDay.months = parseInt(month.substring(2), 10);
      const parsedHours = parseInt(hours, 10);
      this.state.monthly.specificWeekDay.hours = this.getAmPmHour(parsedHours);
      this.state.monthly.specificWeekDay.hourType = this.getHourType(parsedHours);
      this.state.monthly.specificWeekDay.minutes = parseInt(minutes, 10);
      this.state.monthly.specificWeekDay.seconds = parseInt(seconds, 10);
    } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) \d+ [\?\*] \*/)) {
      this.activeTab = 'yearly';
      this.state.yearly.subTab = 'specificMonthDay';
      this.state.yearly.specificMonthDay.month = parseInt(month, 10);
      this.state.yearly.specificMonthDay.day = dayOfMonth;
      const parsedHours = parseInt(hours, 10);
      this.state.yearly.specificMonthDay.hours = this.getAmPmHour(parsedHours);
      this.state.yearly.specificMonthDay.hourType = this.getHourType(parsedHours);
      this.state.yearly.specificMonthDay.minutes = parseInt(minutes, 10);
      this.state.yearly.specificMonthDay.seconds = parseInt(seconds, 10);
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
      const day = dayOfWeek.substr(0, 3);
      const monthWeek = dayOfWeek.substr(3);
      this.activeTab = 'yearly';
      this.state.yearly.subTab = 'specificMonthWeek';
      this.state.yearly.specificMonthWeek.monthWeek = monthWeek;
      this.state.yearly.specificMonthWeek.day = day;
      this.state.yearly.specificMonthWeek.month = parseInt(month, 10);
      const parsedHours = parseInt(hours, 10);
      this.state.yearly.specificMonthWeek.hours = this.getAmPmHour(parsedHours);
      this.state.yearly.specificMonthWeek.hourType = this.getHourType(parsedHours);
      this.state.yearly.specificMonthWeek.minutes = parseInt(minutes, 10);
      this.state.yearly.specificMonthWeek.seconds = parseInt(seconds, 10);
    } else {
      this.activeTab = 'advanced';
      this.state.advanced.expression = origCron;
    }
  }

  private cronIsValid(cron: string): boolean {
    if (cron) {
      const cronParts = cron.split(' ');
      return (this.isCronFlavorQuartz && (cronParts.length === 6
        || cronParts.length === 7)
        || (this.isCronFlavorStandard && cronParts.length === 5));
    }

    return false;
  }

  private getDefaultState() {
    const [defaultHours, defaultMinutes, defaultSeconds] = this.options.defaultTime.split(':').map(Number);
    this.localCron = this.isCronFlavorQuartz ? '* 0 0 ? * * *' : '0 0 1/1 * *';
    return {
      minutes: {
        minutes: 1,
        seconds: 0
      },
      hourly: {
        hours: 1,
        minutes: 0,
        seconds: 0
      },
      daily: {
        subTab: 'everyDays',
        everyDays: {
          days: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        },
        everyWeekDay: {
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        }
      },
      weekly: {
        MON: true,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false,
        hours: this.getAmPmHour(defaultHours),
        minutes: defaultMinutes,
        seconds: defaultSeconds,
        hourType: this.getHourType(defaultHours)
      },
      monthly: {
        subTab: 'specificDay',
        specificDay: {
          day: '1',
          months: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        },
        specificWeekDay: {
          monthWeek: '#1',
          day: 'MON',
          months: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        }
      },
      yearly: {
        subTab: 'specificMonthDay',
        specificMonthDay: {
          month: 1,
          day: '1',
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        },
        specificMonthWeek: {
          monthWeek: '#1',
          day: 'MON',
          month: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        }
      },
      advanced: {
        expression: this.isCronFlavorQuartz ? '0 15 10 L-2 * ? *' : '15 10 2 * *'
      }
    };
  }

  private getOrdinalSuffix(value: string) {
    if (value.length > 1) {
      const secondToLastDigit = value.charAt(value.length - 2);
      if (secondToLastDigit === '1') {
        return 'th';
      }
    }

    const lastDigit = value.charAt(value.length - 1);
    switch (lastDigit) {
      case '1':
        return 'st';
      case '2':
        return 'nd';
      case '3':
        return 'rd';
      default:
        return 'th';
    }
  }

  private getSelectOptions() {
    return {
      months: this.getRange(1, 12),
      monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
      days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      minutes: this.getRange(0, 59),
      fullMinutes: this.getRange(0, 59),
      seconds: this.getRange(0, 59),
      hours: this.getRange(1, 23),
      monthDays: this.getRange(1, 31),
      monthDaysWithLasts: ['1W', ...[...this.getRange(1, 31).map(String)], 'LW', 'L'],
      monthDaysWithOutLasts: [...[...this.getRange(1, 31).map(String)]],
      hourTypes: ['AM', 'PM']
    };
  }

  private getRange(start: number, end: number): number[] {
    const length = end - start + 1;
    return Array.apply(null, Array(length)).map((_, i) => i + start);
  }


  /*
   * ControlValueAccessor
   */
  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(obj: string): void {
    this.cronForm.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


}
