import {Component, Input, OnInit, forwardRef, ViewChild, OnDestroy} from '@angular/core';
import {CronOptions, DefaultOptions} from './CronOptions';
import { Days, MonthWeeks, Months } from './enums';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import {MatTab, MatTabChangeEvent} from '@angular/material/tabs';
import {debounceTime, Subscription } from 'rxjs';

type CronType = 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'unknown';

const minutesExp = /\d+ 0\/\d+ \* 1\/1 \* [\?\*] \*/;
const hourlyExp = /\d+ \d+ 0\/\d+ 1\/1 \* [\?\*] \*/;
const dailyExp = /\d+ \d+ \d+ 1\/\d+ \* [\?\*] \*/;
const dailyWeekdayExp = /\d+ \d+ \d+ [\?\*] \* MON-FRI \*/;
const weeklyExp = /\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/;
const monthlyExp = /\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ [\?\*] \*/;
const monthlyWeekdayExp = /\d+ \d+ \d+ [\?\*] 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;
const yearlyExp  = /\d+ \d+ \d+ (\d+|L|LW|1W) \d+ [\?\*] \*/;
const yearlyMonthWeekExp = /\d+ \d+ \d+ [\?\*] \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;

export const CRON_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CronGenComponent),
  multi: true,
};

interface CronToken {
  val: string;
  inc: string;
}

function parseCronNumberToken(val: string): CronToken {
  const v = val.split('/');
  if (v.length === 1) {
    return {val: v[0], inc: '0'};
  }
  return {val: v[0], inc: v[1]}
}

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cron-editor',
  templateUrl: './cron-editor.template.html',
  styleUrls: ['./cron-editor.component.scss'],
  providers: [CRON_VALUE_ACCESSOR]
})
export class CronGenComponent implements OnInit, OnDestroy, ControlValueAccessor {
  public tabIndex = 0;

  @Input() public backgroundColor: ThemePalette;
  @Input() public color: ThemePalette;

  @Input() public disabled = false;
  @Input() public options: CronOptions = new DefaultOptions();


  public selectOptions = this.getSelectOptions();

  @ViewChild('minutesTab')
  minutesTab: MatTab | undefined;

  @ViewChild('hourlyTab')
  hourlyTab: MatTab | undefined;

  @ViewChild('dailyTab')
  dailyTab: MatTab | undefined;

  @ViewChild('weeklyTab')
  weeklyTab: MatTab | undefined;

  @ViewChild('monthlyTab')
  monthlyTab: MatTab | undefined;

  @ViewChild('yearlyTab')
  yearlyTab: MatTab | undefined;

  @ViewChild('advancedTab')
  advancedTab: MatTab | undefined;

  formSub: Subscription | undefined;

  touched = false;
  allForm = this.fb.group({
    cronType: [<CronType>'unknown', Validators.required],
    seconds: ['0'],

    minutes: ['0'],
    minutesPer: ['0'],

    hours: [this.getAmPmHour('0')],
    hoursPer: ['0'],
    hoursType: [this.getHourType('0')],

    days: ['0'],  // Days of Month, 1, 2, 31....
    daysPer: ['0'],

    months: ['0'],
    monthsInc: ['0'],

    day: ['MON'], // Day of week '1' or 'MON;
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
    expression: ['0 0 0 0 0']
  });

  /*
 * ControlValueAccessor
 */
  public onChange: (value) => void
  public onTouched: () => void;


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
  }

  /* Update the cron output to that of the selected tab.
   * The cron output value is updated whenever a form is updated. To make it change in response to tab selection, we simply reset
   * the value of the form that goes into focus.
   * We cannot rely on the index of the tab, as the hide options could hide tabs and
   * then the index dynamically changes based on the hidden tab.*/
  onTabChange(tabChangeEvent: MatTabChangeEvent) {
    const currentTab = tabChangeEvent.tab;
    let x: CronType;

    switch (currentTab) {
      case this.minutesTab:
        x = 'minutely';
        break;
      case this.hourlyTab:
        x = 'hourly';
        break;
      case this.dailyTab:
        x = 'daily';
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
    this.formSub =  this.allForm.valueChanges.pipe(debounceTime(50)).subscribe(value => {

      this.markAsTouched();
      const cron = this.computeCron();
      // this.allForm.controls.expression.setValue(cron, {emitEvent: false});
      this.onChange(cron);
    });
  }

  ngOnDestroy() {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  private computeCron(): string {

    let cron: string;
    switch (this.allForm.value.cronType) {
      case 'minutely':
        cron = this.computeMinutesCron();
        break;
      case 'hourly':
        cron = this.computeHourlyCron();
        this.tabIndex = 1;
        break;
      case 'daily':
        cron = this.computeDailyCron();
        this.tabIndex = 2;
        break;
      case 'weekly':
        cron = this.computeWeeklyCron();
        this.tabIndex = 3;
        break;
      case 'monthly':
        cron = this.computeMonthlyCron();
        this.tabIndex = 4;
        break;
      case 'yearly':
        cron = this.computeYearlyCron();
        this.tabIndex = 5;
        break;
      case 'unknown':
        cron = this.computeAdvancedExpression();
        this.tabIndex = 6;
        break;
      default:
        throw Error($localize`Unknown cron type ${this.allForm.value.cronType}`);
    }
    return cron;
  }

  private computeMinutesCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} 0/${state.minutesPer} * 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeHourlyCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} 0/${state.hoursPer} 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeDailyCron(): string {
    if (this.allForm.value.weekdaysOnly) {
      return this.computeEveryWeekdayCron();
    }
    return this.computeEveryDaysCron();
  }

  private computeEveryDaysCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} 1/${state.daysPer} * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();

  }

  private computeEveryWeekdayCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} * MON-FRI ${this.yearDefaultChar}`.trim();
  }


  private computeWeeklyCron(): string {

    const state = this.allForm.value;
    const days = this.selectOptions.days
      .reduce((acc, day) => state[day] ? acc.concat([day]) : acc, [])
      .join(',') || '*';

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} * ${days} ${this.yearDefaultChar}`.trim();
  }

  private computeMonthlyCron(): string {

    const state = this.allForm.value;

    if (state.specificWeekDay) {
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} 1/${state.monthsInc} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.days} 1/${state.monthsInc} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeYearlyCron(): string {
    const state = this.allForm.value;

    if (state.specificMonthWeek) {
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} ${state.months} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.days} ${state.months} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeAdvancedExpression(): string  {
    return this.allForm.controls.expression.value;
  }

  public dayDisplay(day: string): string {
    return Days[day];
  }

  public monthWeekDisplay(monthWeekNumber: string): string {
    return MonthWeeks[monthWeekNumber];
  }

  public monthDisplay(month: string): string {
    return Months[parseInt(month, 10)];
  }

  public monthDayDisplay(month: string | number): string {

    if (typeof month === 'number') {
      return `${month}${this.getOrdinalSuffix(month)}`
    }

    if (month === 'L') {
      return $localize`Last Day`;
    } else if (month === 'LW') {
      return $localize`Last Weekday`;
    } else if (month === '1W') {
      return $localize`First Weekday`;
    } else {
      return `${month}${this.getOrdinalSuffix(month)}`;
    }
  }

  private getAmPmHour(hour: string): string {

    if (this.options.use24HourTime) {
      return hour;
    }
    return ((parseInt(hour, 10) + 11) % 12 + 1).toString()
  }

  // Return the AM or PM component of a clocktime, or null if 24-hour format is used.
  private getHourType(hour: string): string | null {
    if (this.options.use24HourTime) {
      return null;
    }

    if (parseInt(hour, 10) >= 12) {
      return 'PM';
    }
    return 'AM';
  }

  private hourToCron(hour: string, hourType: string): string {
    if (this.options.use24HourTime) {
      return hour;
    } else {
      return hourType === 'AM' ? (hour === '12' ? '0' : hour) : (hour === '12' ? '12' :  (parseInt(hour, 10) + 12).toString());
    }
  }

  private handleModelChange(cron: string) {

    if (!this.cronIsValid(cron)) {
      if (this.isCronFlavorQuartz) {
        throw new Error($localize`Invalid cron expression, there must be 6 or 7 segments`);
      }

      if (this.isCronFlavorStandard) {
        throw new Error($localize`Invalid cron expression, there must be 5 segments`);
      }
    }

    // Store original cron expression here.
    this.allForm.controls.expression.setValue(cron);

    // Normalize cron so that second segment is included.
    if (cron.split(' ').length === 5 && this.isCronFlavorStandard) {
      cron = `0 ${cron} *`;
    }

    // Parse cron tokens
    const t = cron.split(' ');

    // Seconds
    this.allForm.controls.seconds.setValue(t[0], {emitEvent: false})

    // Minutes
    let x = parseCronNumberToken(t[1]);
    this.allForm.controls.minutesPer.setValue(x.inc, {emitEvent: false});
    this.allForm.controls.minutes.setValue(x.val);

    // Hours
    x = parseCronNumberToken(t[2])
    this.allForm.controls.hoursPer.setValue(x.inc);
    this.allForm.controls.hours.setValue(x.val);
    this.allForm.controls.hoursType.setValue(this.getHourType(this.allForm.value.hours), {emitEvent: false});

    // Day of Month
    x = parseCronNumberToken(t[3])
    this.allForm.controls.days.setValue(x.val, {emitEvent: false});
    this.allForm.controls.daysPer.setValue(x.inc, {emitEvent: false});

    // Month
    x = parseCronNumberToken(t[4])
    this.allForm.controls.months.setValue(x.val, {emitEvent: false});
    this.allForm.controls.monthsInc.setValue(x.inc, { emitEvent: false });

    // Day of Week
    this.allForm.controls.SUN.setValue(t[5].match(/(?<!#)((SUN)|0)/) !== null, {emitEvent: false});
    this.allForm.controls.MON.setValue(t[5].match(/(?<!#)((MON)|1)/) !== null, {emitEvent: false});
    this.allForm.controls.TUE.setValue(t[5].match(/(?<!#)((TUE)|2)/) !== null, {emitEvent: false});
    this.allForm.controls.WED.setValue(t[5].match(/(?<!#)((WED)|3)/) !== null, {emitEvent: false});
    this.allForm.controls.THU.setValue(t[5].match(/(?<!#)((THU)|4)/) !== null, {emitEvent: false});
    this.allForm.controls.FRI.setValue(t[5].match(/(?<!#)((FRI)|5)/) !== null, {emitEvent: false});
    this.allForm.controls.SAT.setValue(t[5].match(/(?<!#)((SAT)|6)/) !== null, {emitEvent: false});

    // Weekdays
    if ((t[5].match(/(?<!#)(MON-FRI)/))) {
      this.allForm.controls.MON.setValue(true);
      this.allForm.controls.TUE.setValue(true);
      this.allForm.controls.WED.setValue(true);
      this.allForm.controls.THU.setValue(true);
      this.allForm.controls.FRI.setValue(true);
    }

    // Weekends
    if ((t[5].match(/(?<!#)(SAT-SUN)/))) {
      this.allForm.controls.SAT.setValue(true);
      this.allForm.controls.SUN.setValue(true);
    }


    // Get value after # sign
    const y = t[5].match(/#[0-9]*$/)
    if (y) {
      this.allForm.controls.monthsWeek.setValue(y[0], {emitEvent: false});
    }

    // Update the day control from selected weekdays.
    // Note, only one day is supported here.
    if (this.allForm.controls.SUN.value) {
      this.allForm.controls.day.setValue('SUN', {emitEvent: false});
    }
    if (this.allForm.controls.MON.value) {
      this.allForm.controls.day.setValue('MON', {emitEvent: false});
    }
    if (this.allForm.controls.TUE.value) {
      this.allForm.controls.day.setValue('TUE', {emitEvent: false});
    }
    if (this.allForm.controls.WED.value) {
      this.allForm.controls.day.setValue('WED', {emitEvent: false});
    }
    if (this.allForm.controls.THU.value) {
      this.allForm.controls.day.setValue('THU', {emitEvent: false});
    }
    if (this.allForm.controls.FRI.value) {
      this.allForm.controls.day.setValue('FRI', {emitEvent: false});
    }
    if (this.allForm.controls.SAT.value) {
      this.allForm.controls.day.setValue('SAT', {emitEvent: false});
    }

    // Year
    // Not supported

    if (cron.match(minutesExp)) {
      this.allForm.controls.cronType.setValue('minutely', {emitEvent: false});

    } else if (cron.match(hourlyExp)) {
      this.allForm.controls.cronType.setValue('hourly', {emitEvent: false});

    } else if (cron.match(dailyExp)) {
      this.allForm.controls.cronType.setValue('daily', {emitEvent: false});
      this.allForm.controls.weekdaysOnly.setValue(false);

    } else if (cron.match(dailyWeekdayExp)) {
      this.allForm.controls.cronType.setValue('daily', {emitEvent: false});
      this.allForm.controls.weekdaysOnly.setValue(true);

    } else if (cron.match(weeklyExp)) {
      this.allForm.controls.cronType.setValue('weekly', {emitEvent: false});

    } else if (cron.match(monthlyExp)) {
      this.allForm.controls.cronType.setValue('monthly', {emitEvent: false});
      this.allForm.controls.specificWeekDay.setValue(false);

    } else if (cron.match(monthlyWeekdayExp)) {
      this.allForm.controls.cronType.setValue('monthly', {emitEvent: false});
      this.allForm.controls.specificWeekDay.setValue(true);

    } else if (cron.match(yearlyExp)) {
      this.allForm.controls.cronType.setValue('yearly', {emitEvent: false});
      this.allForm.controls.specificMonthWeek.setValue(false);

    } else if (cron.match(yearlyMonthWeekExp)) {
      this.allForm.controls.cronType.setValue('yearly', {emitEvent: false});
      this.allForm.controls.specificMonthWeek.setValue(true);

    } else {
      this.allForm.controls.cronType.setValue('unknown', {emitEvent: false});
    }
    this.allForm.updateValueAndValidity( {onlySelf: true});
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


  private getOrdinalSuffix(v: string | number): string {

    // Convert to string. There is also a faster LOG10 algorithm, but it requires the math library.
    let value: string;
    if (typeof v === 'number') {
      value = v.toString(10);
    } else {
      value = v;
    }

    // th if secondToLastDigit is 1: ..10th, ..11th, ..19th,
    if (value.length > 1 && value.charAt(value.length - 2) === '1') {
        return 'th';
    }

    // Check last digit:  21st, 22nd, 23rd, 24th, 25t, etc.
    switch (value.charAt(value.length - 1)) {
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
      months: this.getRange(1, 12).map(String),
      monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
      days: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      minutes: this.getRange(0, 59).map(String),
      fullMinutes: this.getRange(0, 59).map(String),
      seconds: this.getRange(0, 59).map(String),
      hours: this.getRange(1, 23).map(String),
      monthDays: this.getRange(1, 31).map(String),
      monthDaysWithLasts: ['1W', ...[...this.getRange(1, 31).map(String)], 'LW', 'L'],
      monthDaysWithOutLasts: [...[...this.getRange(1, 31).map(String)]],
      hourTypes: ['AM', 'PM']
    };
  }

  private getRange(start: number, end: number): number[] {
    const length = end - start + 1;
    return Array.apply(null, Array(length)).map((_, i) => i + start);
  }




  writeValue(obj: string | null): void {
    if (obj === null) {
      return
    }

    this.handleModelChange(obj);
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

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
