import {Component, Input, OnInit, forwardRef, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, Provider, inject} from '@angular/core';
import {CronFlavor, CronOptions, DefaultOptions} from './CronOptions';
import { Days, MonthWeeks, Months } from './enums';
import {AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators} from '@angular/forms';
import {MatTab, MatTabChangeEvent} from '@angular/material/tabs';
import {debounceTime, Subscription } from 'rxjs';

type CronType = 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'unknown';

// Matched against the normalized 7-field form (seconds ... year), after `*/n` has
// been rewritten to `0/n` (minutes, hours) or `1/n` (days, months). A lone `*`
// in a step position means a step of 1, as the editor writes for standard cron.
const minutesExp = /^\d+ (0\/\d+|\*) \* (1\/1|\*) \* [\?\*] \*$/;
const hourlyExp = /^\d+ \d+ (0\/\d+|\*) (1\/1|\*) \* [\?\*] \*$/;
const dailyExp = /^\d+ \d+ \d+ (1\/\d+|\*) \* [\?\*] \*$/;
const dailyWeekdayExp = /^\d+ \d+ \d+ [\?\*] \* MON-FRI \*$/;
const weeklyExp = /^\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*$/;
const monthlyExp = /^\d+ \d+ \d+ (\d+|L|LW|1W) (1\/\d+|\*) [\?\*] \*$/;
const monthlyWeekdayExp = /^\d+ \d+ \d+ [\?\*] (1\/\d+|\*) (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*$/;
const yearlyExp  = /^\d+ \d+ \d+ (\d+|L|LW|1W) \d+ [\?\*] \*$/;
const yearlyMonthWeekExp = /^\d+ \d+ \d+ [\?\*] \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*$/;

export const CRON_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CronGenComponent),
  multi: true,
};

export const CRON_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CronGenComponent),
  multi: true,
};

/**
 * Validation error reported on the form control when an expression has the wrong
 * number of segments for the configured cron flavor. Read it with
 * `control.getError('cronSegments')`.
 */
export interface CronSegmentsError {
  flavor: CronFlavor;
  expected: number[];
  actual: number;
}

interface CronToken {
  val: string;
  /** Step after '/'; '1' for a lone '*' (every value); null for a plain value such as '15'. */
  inc: string | null;
}

function parseCronNumberToken(val: string): CronToken {
  const v = val.split('/');
  if (v.length === 1) {
    return {val: v[0], inc: v[0] === '*' ? '1' : null};
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
    providers: [CRON_VALUE_ACCESSOR, CRON_VALIDATOR],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CronGenComponent implements OnInit, DoCheck, OnDestroy, ControlValueAccessor, Validator {
  public tabIndex = 0;


  @Input() public disabled = false;
  @Input() public options: CronOptions = new DefaultOptions();


  public selectOptions = this.getSelectOptions();

  @ViewChildren(MatTab) tabs!: QueryList<MatTab>;

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
    minutesPer: ['1'],

    hours: [this.getAmPmHour('0')],
    hoursPer: ['1'],
    hoursType: [this.getHourType('0')],

    days: ['1'],  // Days of Month, 1, 2, 31....
    daysPer: ['1'],

    months: ['1'],
    monthsInc: ['1'],

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
    expression: ['']
  });

  /*
 * ControlValueAccessor
 */
  public onChange: (value) => void
  public onTouched: () => void;

  /*
   * Validator
   */
  private onValidatorChange?: () => void;
  private lastFlavor: CronFlavor | undefined;


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

  private readonly cdr = inject(ChangeDetectorRef);

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
      this.onChange(cron);
      // computeCron() may change tabIndex outside change detection. Without this,
      // an OnPush parent (the Angular 22 default) never re-checks the editor.
      this.cdr.markForCheck();
    });
  }

  /* Revalidate when the cron flavor changes. Apps may replace `options` or mutate
   * `options.cronFlavor` in place, so an input setter or ngOnChanges would miss the
   * second case. The revalidation runs after change detection so that it does not
   * change the parent form's status in the middle of a check. */
  ngDoCheck() {
    const flavor = this.options?.cronFlavor;
    if (flavor !== this.lastFlavor) {
      const first = this.lastFlavor === undefined;
      this.lastFlavor = flavor;
      if (!first) {
        Promise.resolve().then(() => this.onValidatorChange?.());
      }
    }
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
        this.tabIndex = this.tabs.toArray().indexOf(this.minutesTab);
        break;
      case 'hourly':
        cron = this.computeHourlyCron();
        this.tabIndex = this.tabs.toArray().indexOf(this.hourlyTab);
        break;
      case 'daily':
        cron = this.computeDailyCron();
        this.tabIndex = this.tabs.toArray().indexOf(this.dailyTab);
        break;
      case 'weekly':
        cron = this.computeWeeklyCron();
        this.tabIndex = this.tabs.toArray().indexOf(this.weeklyTab);
        break;
      case 'monthly':
        cron = this.computeMonthlyCron();
        this.tabIndex = this.tabs.toArray().indexOf(this.monthlyTab);
        break;
      case 'yearly':
        cron = this.computeYearlyCron();
        this.tabIndex = this.tabs.toArray().indexOf(this.yearlyTab);
        break;
      case 'unknown':
        cron = this.computeAdvancedExpression();
        this.tabIndex = this.tabs.length - 1;
        break;
      default:
        throw Error($localize`Unknown cron type ${this.allForm.value.cronType}`);
    }
    return cron;
  }

  private computeMinutesCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${this.step(0, state.minutesPer)} * ${this.step(1, 1)} * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeHourlyCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.step(0, state.hoursPer)} ${this.step(1, 1)} * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeDailyCron(): string {
    if (this.allForm.value.weekdaysOnly) {
      return this.computeEveryWeekdayCron();
    }
    return this.computeEveryDaysCron();
  }

  private computeEveryDaysCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.step(1, state.daysPer)} * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();

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
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} ${this.step(1, state.monthsInc)} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.days} ${this.step(1, state.monthsInc)} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  /* A field that repeats every `n` units from the field's first value (0 for
   * minutes and hours, 1 for days and months).
   * Quartz: `start/n` (Quartz's documented form, e.g. '0/15').
   * Standard: `*\/n`, or `*` for n = 1. cronie and Vixie cron only allow a
   * step after '*' or a range, so `0/15` or `1/1` would be a syntax error there. */
  private step(start: 0 | 1, n: string | number): string {
    if (this.isCronFlavorQuartz) {
      return `${start}/${n}`;
    }
    return String(n) === '1' ? '*' : `*/${n}`;
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
      // Wrong segment count for the flavor: don't parse it. validate() reports the
      // error on the form control. Show the expression in the Advanced tab, if there
      // is one, so the user can see and correct it.
      if (this.options.hideAdvancedTab) {
        this.allForm.controls.expression.setValue(cron, {emitEvent: false});
        return;
      }
      this.allForm.controls.cronType.setValue('unknown', {emitEvent: false});
      this.allForm.controls.expression.setValue(cron);
      return;
    }

    // Store original cron expression here.
    this.allForm.controls.expression.setValue(cron);

    // Normalize cron so that second segment is included.
    if (cron.split(' ').length === 5 && this.isCronFlavorStandard) {
      cron = `0 ${cron} *`;
    }

    // Rewrite `*/n` to the field's first value: `0/n` for minutes and hours,
    // `1/n` for day of month and month. Both forms select the same values.
    const fieldStart = ['0', '0', '0', '1', '1'];  // seconds, minutes, hours, day of month, month
    cron = cron.split(' ')
      .map((token, i) => i < fieldStart.length && token.startsWith('*/') ? `${fieldStart[i]}${token.slice(1)}` : token)
      .join(' ');

    // Parse cron tokens
    const t = cron.split(' ');

    // Seconds
    this.allForm.controls.seconds.setValue(t[0], {emitEvent: false})

    // Steps (minutesPer, hoursPer, daysPer, monthsInc) are only updated when the
    // token has a '/'. Otherwise they keep their current value (default 1), so
    // switching to a tab that uses a step never produces a step of 0.

    // Minutes
    let x = parseCronNumberToken(t[1]);
    if (x.inc !== null) {
      this.allForm.controls.minutesPer.setValue(x.inc, {emitEvent: false});
    }
    this.allForm.controls.minutes.setValue(x.val);

    // Hours
    x = parseCronNumberToken(t[2])
    if (x.inc !== null) {
      this.allForm.controls.hoursPer.setValue(x.inc);
    }
    this.allForm.controls.hours.setValue(x.val);
    this.allForm.controls.hoursType.setValue(this.getHourType(this.allForm.value.hours), {emitEvent: false});

    // Day of Month
    x = parseCronNumberToken(t[3])
    this.allForm.controls.days.setValue(x.val, {emitEvent: false});
    if (x.inc !== null) {
      this.allForm.controls.daysPer.setValue(x.inc, {emitEvent: false});
    }

    // Month
    x = parseCronNumberToken(t[4])
    this.allForm.controls.months.setValue(x.val, {emitEvent: false});
    if (x.inc !== null) {
      this.allForm.controls.monthsInc.setValue(x.inc, { emitEvent: false });
    }

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

  private expectedSegments(): number[] {
    return this.isCronFlavorQuartz ? [6, 7] : [5];
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
      minutes: this.getRange(1, 59).map(String), // step for 'every N minutes'; 0 is not a valid step
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
    // An empty value leaves the editor as it is; use Validators.required to reject it.
    if (obj === null || obj === undefined || obj === '') {
      return
    }

    this.handleModelChange(obj);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '' || this.cronIsValid(value)) {
      return null;
    }
    const error: CronSegmentsError = {
      flavor: this.options.cronFlavor,
      expected: this.expectedSegments(),
      actual: String(value).split(' ').length,
    };
    return {cronSegments: error};
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
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
