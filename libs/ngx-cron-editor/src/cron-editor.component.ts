import {Component, Input, Output, OnInit, EventEmitter, forwardRef, ViewChild} from '@angular/core';
import {CronOptions, DefaultOptions} from './CronOptions';
import { Days, MonthWeeks, Months } from './enums';
import {ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import {MatTab, MatTabChangeEvent} from '@angular/material/tabs';
import {debounceTime} from 'rxjs';

type CronType = 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'unknown';

const minutesExp = /\d+ 0\/\d+ \* 1\/1 \* [\?\*] \*/;
const hourlyExp = /\d+ \d+ 0\/\d+ 1\/1 \* [\?\*] \*/;
const dailyExp = /\d+ \d+ \d+ 1\/\d+ \* [\?\*] \*/;
const dailyWeekdayExp = /\d+ \d+ \d+ [\?\*] \* MON-FRI \*/;
const weeklyExp = /\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/;
const monthlyExpo = /\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ [\?\*] \*/;
const monthlyWeekdayExpo = /\d+ \d+ \d+ [\?\*] 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;
const yearlyExp  = /\d+ \d+ \d+ (\d+|L|LW|1W) \d+ [\?\*] \*/;
const yearlyMonthWeekExp = /\d+ \d+ \d+ [\?\*] \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;

export const CRON_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CronGenComponent),
  multi: true,
};

interface CronToken {
  val: number;
  inc: number;
}

function parseCronNumberToken(val: string): CronToken {
  const v = val.split('/').map( x => parseInt(x, 10));
  if (v.length === 1) {
    return {val: v[0], inc: 0};
  }
  return {val: v[0], inc: v[1]}
}


@Component({
  selector: 'cron-editor',
  templateUrl: './cron-editor.template.html',
  styleUrls: ['./cron-editor.component.css'],
  providers: [CRON_VALUE_ACCESSOR]
})
export class CronGenComponent implements OnInit, ControlValueAccessor {

  @Input() public backgroundColor: ThemePalette = 'primary';
  @Input() public color: ThemePalette = 'primary';

  @Input() public disabled = false;
  @Input() public options: CronOptions = new DefaultOptions();

  // the name is an Angular convention, @Input variable name + "Change" suffix
  @Output() cronChange = new EventEmitter<string>();

  public activeTab: string;
  public selectOptions = this.getSelectOptions();

  private localCron = '0 0 1/1 * *';
  private isDirty: boolean;

  public cronForm = new FormControl('0 0 1/1 * *');

  @ViewChild('minutesTab')
  minutesTab: MatTab;

  @ViewChild('hourlyTab')
  hourlyTab: MatTab;

  @ViewChild('dailyTab')
  dailyTab: MatTab;

  @ViewChild('weeklyTab')
  weeklyTab: MatTab;

  @ViewChild('monthlyTab')
  monthlyTab: MatTab;

  @ViewChild('yearlyTab')
  yearlyTab: MatTab;

  @ViewChild('advancedTab')
  advancedTab: MatTab;

  allForm = this.fb.group({
    cronType: [<CronType> 'minutely', Validators.required],
    seconds: [0],

    minutes: [0],
    minutesPer: [0],

    hours: [this.getAmPmHour(0)],
    hoursPer: [0],
    hoursType: [this.getHourType(0)],

    days: [0],  // Days of Month
    daysPer: [0],

    months: [0],
    monthsInc: [0],

    day: ['1'], // Day of week '1' or 'MON;

    monthsWeek: ['#1'],

    weekdaysOnly: [false],
    specificWeekDay: [false],
    specificMonthWeek: [false],
    MON: [true],
    TUE: [true],
    WED: [true],
    THU: [true],
    FRI: [true],
    SAT: [true],
    SUN: [true],
    expression: ['']
  });


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

  constructor(private fb: FormBuilder) {}

  /* Update the cron output to that of the selected tab.
   * The cron output value is updated whenever a form is updated. To make it change in response to tab selection, we simply reset
   * the value of the form that goes into focus.
   * We cannot rely on the index of the tab, as the hide options could hide tabs and
   * then the index dynamically changes based on the hidden tab.*/
  onTabChange(tabChangeEvent: MatTabChangeEvent) {
    const currentTab = tabChangeEvent.tab;
    let x: CronType;

    console.log('on tab change');

    switch (currentTab) {
      case this.minutesTab:
        x = 'minutely';
        break;
      case this.hourlyTab:
        x = 'hourly';
        break;
      case this.dailyTab:
        x = 'hourly';
        break;
      case this.weeklyTab:
        x = 'weekly';
        break;
      case this.monthlyTab:
        x = 'monthly';
        break;
      case this.yearlyTab:
        x = 'yearly';
        break;
      case this.advancedTab:
        x = 'unknown';
        break;
      default:
        throw (new Error('Invalid tab selected'));
    }

    this.allForm.controls.cronType.setValue(x);
  }

  public async ngOnInit() {
    this.allForm.valueChanges.pipe(debounceTime(50)).subscribe(value => this.computeCron());
  }

  private computeCron() {

    let cron: string;
    switch (this.allForm.value.cronType) {
      case 'minutely':
        cron = this.computeMinutesCron();
        break;
      case 'daily':
        cron = this.computeDailyCron();
        break;
      case 'hourly':
        cron = this.computeHourlyCron();
        break;
      case 'monthly':
        cron = this.computeHourlyCron();
        break;
      case 'weekly':
        cron = this.computeWeeklyCron();
        break;
      case 'yearly':
        cron = this.computeYearlyCron();
        break;
      case 'unknown':
        cron = this.computeAdvancedExpression();
        break;
      default:
        throw Error('Unknown cron type ' + this.allForm.value.cronType);
    }

    this.allForm.controls.expression.setValue(cron, {emitEvent: false});
    this.cronForm.setValue(cron);
    this.cronChange.emit(cron);
    this.onChange(cron);
  }

  private computeMinutesCron(): string {

    const state = this.allForm.value;

    // tslint:disable-next-line:max-line-length
    return `${this.isCronFlavorQuartz ? state.seconds : ''} 0/${state.minutes} * 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeHourlyCron(): string {

    const state = this.allForm.value;

   return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} 0/${state.hours} 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeDailyCron(): string {
    if (this.allForm.value.weekdaysOnly) {
      return this.computeEveryWeekdayCron();
    }
    return this.computeEveryDaysCron();
  }

  private computeEveryDaysCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} 1/${state.days} * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();

  }

  private computeEveryWeekdayCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} * MON-FRI ${this.yearDefaultChar}`.trim();
  }


  private computeWeeklyCron(): string  {

    const state = this.allForm.value;
    const days = this.selectOptions.days
      .reduce((acc, day) => state[day] ? acc.concat([day]) : acc, [])
      .join(',');

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} * ${days} ${this.yearDefaultChar}`.trim();
  }

  private computeMonthlyCron(): string {

    const state = this.allForm.value;

    if (state.specificWeekDay) {
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} 1/${state.months} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.day} 1/${state.months} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeYearlyCron(): string {

    const state = this.allForm.value;

    if (state.specificMonthWeek) {
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} ${state.months} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.day} ${state.months} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeAdvancedExpression(): string {

    const state = this.allForm.value;

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

    // Normalize cron so that second segment is included.
    const origCron: string = cron;
    if (cron.split(' ').length === 5 && this.isCronFlavorStandard) {
      cron = `0 ${cron} *`;
    }

    // Parse cron tokens
    const t = cron.split(' ');

    // Seconds
    this.allForm.controls.seconds.setValue(parseInt(t[0], 10))

    // Minutes
    let x = parseCronNumberToken(t[1]);
    this.allForm.controls.minutesPer.setValue(x.inc);
    this.allForm.controls.minutes.setValue(x.val);

    // Hours
    x = parseCronNumberToken(t[2])
    this.allForm.controls.hoursPer.setValue(x.inc);
    this.allForm.controls.hours.setValue(x.val);
    this.allForm.controls.hoursType.setValue(this.getHourType(this.allForm.value.hours));

    // Day of Month
    x = parseCronNumberToken(t[3])
    this.allForm.controls.days.setValue(x.val);
    this.allForm.controls.daysPer.setValue(x.val);

    // Month
    x = parseCronNumberToken(t[4])
    this.allForm.controls.months.setValue(x.val);
    this.allForm.controls.monthsInc.setValue(x.inc);

    // Day of Week
    this.allForm.controls.day.setValue(t[5]);
    if (t[5].match('MON')) {
      this.allForm.controls.MON.setValue(true);
    } else {
      this.allForm.controls.MON.setValue(false);
    }

    if (t[5].match('TUE')) {
      this.allForm.controls.TUE.setValue(true);
    } else {
      this.allForm.controls.TUE.setValue(false);
    }

    if (t[5].match('WED')) {
      this.allForm.controls.WED.setValue(true);
    } else {
      this.allForm.controls.WED.setValue(false);
    }

    if (t[5].match('THU')) {
      this.allForm.controls.THU.setValue(true);
    } else {
      this.allForm.controls.THU.setValue(false);
    }

    if (t[5].match('FRI')) {
      this.allForm.controls.FRI.setValue(true);
    } else {
      this.allForm.controls.FRI.setValue(false);
    }

    if (t[5].match('SAT')) {
      this.allForm.controls.SAT.setValue(true);
    } else {
      this.allForm.controls.SAT.setValue(false);
    }

    if (t[5].match('SUN')) {
      this.allForm.controls.SUN.setValue(true);
    } else {
      this.allForm.controls.SUN.setValue(false);
    }

    // Year
    // Not supported

    if (cron.match(minutesExp)) {
      this.allForm.controls.cronType.setValue('minutely');

    } else if (cron.match(hourlyExp)) {
      this.allForm.controls.cronType.setValue('hourly');

    } else if (cron.match(dailyExp)) {
      this.allForm.controls.cronType.setValue('daily');
      this.allForm.controls.weekdaysOnly.setValue(false);

    } else if (cron.match(dailyWeekdayExp)) {
      this.allForm.controls.cronType.setValue('daily');
      this.allForm.controls.weekdaysOnly.setValue(true);

    } else if (cron.match(weeklyExp)) {
      this.allForm.controls.cronType.setValue('weekly');

    } else if (cron.match(monthlyExpo)) {
      this.allForm.controls.cronType.setValue('monthly');
      this.allForm.controls.specificWeekDay.setValue(false);

    } else if (cron.match(monthlyWeekdayExpo)) {
      this.allForm.controls.cronType.setValue('monthly');
      this.allForm.controls.specificWeekDay.setValue(true);

    } else if (cron.match(yearlyExp)) {
      this.allForm.controls.cronType.setValue('yearly');
      this.allForm.controls.specificMonthWeek.setValue(false);

    } else if (cron.match(yearlyMonthWeekExp)) {

      this.allForm.controls.cronType.setValue('yearly');
      this.allForm.controls.specificMonthWeek.setValue(false);

    } else {
      this.allForm.controls.cronType.setValue('unknown');
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
    this.cronForm.setValue(obj) ;
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
