import * as i0 from '@angular/core';
import { Component, Input, forwardRef, ViewChild, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1 from '@angular/forms';
import { NG_VALUE_ACCESSOR, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i9 from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as i7 from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import * as i8 from '@angular/material/radio';
import { MatRadioModule } from '@angular/material/radio';
import * as i4 from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import * as i3$1 from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import * as i3 from '@angular/material/form-field';
import * as i5 from '@angular/material/core';
import { debounceTime } from 'rxjs';

function* range$1(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}
class TimePickerComponent {
    get hours() {
        return this.use24HourTime ? [...range$1(0, 23)].map(String) : [...range$1(0, 12)].map(String);
    }
    constructor(parent) {
        this.parent = parent;
        this.disabled = false;
        this.use24HourTime = true;
        this.hideHours = false;
        this.hideMinutes = false;
        this.hideSeconds = true;
        this.minutes = [...range$1(0, 59)].map(String);
        this.seconds = [...range$1(0, 59)].map(String);
        this.hourTypes = ['AM', 'PM'];
    }
    ngOnInit() {
        this.allForm = this.parent.control;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: TimePickerComponent, deps: [{ token: i1.ControlContainer }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.6", type: TimePickerComponent, selector: "cron-time-picker", inputs: { disabled: "disabled", use24HourTime: "use24HourTime", hideHours: "hideHours", hideMinutes: "hideMinutes", hideSeconds: "hideSeconds" }, providers: [], ngImport: i0, template: "<ng-container [formGroup]=\"allForm\">\n\n  <ng-container *ngIf=\"!hideHours\">\n    <mat-form-field>\n      <mat-label i18n>Hour(s)</mat-label>\n      <mat-select formControlName=\"hours\">\n        <mat-option *ngFor=\"let hour of hours\" [value]=\"hour\">{{hour}}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </ng-container>\n\n  <ng-container *ngIf=\"!hideMinutes\">\n    <span *ngIf=\"!hideHours\">:</span>\n    <mat-form-field>\n      <mat-label i18n>Minute(s)</mat-label>\n      <mat-select formControlName=\"minutes\">\n        <mat-option *ngFor=\"let minute of minutes\" [value]=\"minute\">{{minute}}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </ng-container>\n\n  <ng-container *ngIf=\"!hideSeconds\">\n    <span *ngIf=\"!hideMinutes\">:</span>\n    <mat-form-field>\n      <mat-label i18n>Second(s)</mat-label>\n      <mat-select formControlName=\"seconds\">\n        <mat-option *ngFor=\"let second of seconds\" [value]=\"second\">{{second}}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </ng-container>\n\n  <ng-container *ngIf=\"!use24HourTime\">\n    <span></span>.\n    <mat-form-field>\n      <mat-select formControlName=\"hourType\">\n        <mat-option *ngFor=\"let hourType of hourTypes\" [value]=\"hourType\">{{hourType}}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </ng-container>\n</ng-container>\n", dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i3.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i3.MatLabel, selector: "mat-label" }, { kind: "component", type: i4.MatSelect, selector: "mat-select", inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth"], outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"], exportAs: ["matSelect"] }, { kind: "component", type: i5.MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: TimePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cron-time-picker', providers: [], template: "<ng-container [formGroup]=\"allForm\">\n\n  <ng-container *ngIf=\"!hideHours\">\n    <mat-form-field>\n      <mat-label i18n>Hour(s)</mat-label>\n      <mat-select formControlName=\"hours\">\n        <mat-option *ngFor=\"let hour of hours\" [value]=\"hour\">{{hour}}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </ng-container>\n\n  <ng-container *ngIf=\"!hideMinutes\">\n    <span *ngIf=\"!hideHours\">:</span>\n    <mat-form-field>\n      <mat-label i18n>Minute(s)</mat-label>\n      <mat-select formControlName=\"minutes\">\n        <mat-option *ngFor=\"let minute of minutes\" [value]=\"minute\">{{minute}}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </ng-container>\n\n  <ng-container *ngIf=\"!hideSeconds\">\n    <span *ngIf=\"!hideMinutes\">:</span>\n    <mat-form-field>\n      <mat-label i18n>Second(s)</mat-label>\n      <mat-select formControlName=\"seconds\">\n        <mat-option *ngFor=\"let second of seconds\" [value]=\"second\">{{second}}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </ng-container>\n\n  <ng-container *ngIf=\"!use24HourTime\">\n    <span></span>.\n    <mat-form-field>\n      <mat-select formControlName=\"hourType\">\n        <mat-option *ngFor=\"let hourType of hourTypes\" [value]=\"hourType\">{{hourType}}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </ng-container>\n</ng-container>\n" }]
        }], ctorParameters: () => [{ type: i1.ControlContainer }], propDecorators: { disabled: [{
                type: Input
            }], use24HourTime: [{
                type: Input
            }], hideHours: [{
                type: Input
            }], hideMinutes: [{
                type: Input
            }], hideSeconds: [{
                type: Input
            }] } });

class DefaultOptions {
    constructor() {
        this.cronFlavor = 'standard';
        this.defaultTime = '00:00:00';
        this.hideAdvancedTab = false;
        this.hideDailyTab = false;
        this.hideHourlyTab = false;
        this.hideMinutesTab = false;
        this.hideMonthlyTab = false;
        this.hideSeconds = false;
        this.hideSpecificMonthWeekTab = false;
        this.hideSpecificWeekDayTab = false;
        this.hideWeeklyTab = false;
        this.hideYearlyTab = false;
        this.use24HourTime = true;
    }
}

const Days = {
    'SUN': $localize `Sunday`,
    'MON': $localize `Monday`,
    'TUE': $localize `Tuesday`,
    'WED': $localize `Wednesday`,
    'THU': $localize `Thursday`,
    'FRI': $localize `Friday`,
    'SAT': $localize `Saturday`
};
const MonthWeeks = {
    '#1': $localize `First`,
    '#2': $localize `Second`,
    '#3': $localize `Third`,
    '#4': $localize `Fourth`,
    '#5': $localize `Fifth`,
    'L': $localize `Last`
};
const Months = {
    1: $localize `January`,
    2: $localize `February`,
    3: $localize `March`,
    4: $localize `April`,
    5: $localize `May`,
    6: $localize `June`,
    7: $localize `July`,
    8: $localize `August`,
    9: $localize `September`,
    10: $localize `October`,
    11: $localize `November`,
    12: $localize `December`
};

const minutesExp = /\d+ 0\/\d+ \* 1\/1 \* [\?\*] \*/;
const hourlyExp = /\d+ \d+ 0\/\d+ 1\/1 \* [\?\*] \*/;
const dailyExp = /\d+ \d+ \d+ 1\/\d+ \* [\?\*] \*/;
const dailyWeekdayExp = /\d+ \d+ \d+ [\?\*] \* MON-FRI \*/;
const weeklyExp = /\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/;
const monthlyExp = /\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ [\?\*] \*/;
const monthlyWeekdayExp = /\d+ \d+ \d+ [\?\*] 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;
const yearlyExp = /\d+ \d+ \d+ (\d+|L|LW|1W) \d+ [\?\*] \*/;
const yearlyMonthWeekExp = /\d+ \d+ \d+ [\?\*] \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;
const CRON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CronGenComponent),
    multi: true,
};
function parseCronNumberToken(val) {
    const v = val.split('/');
    if (v.length === 1) {
        return { val: v[0], inc: '0' };
    }
    return { val: v[0], inc: v[1] };
}
function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}
class CronGenComponent {
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
    constructor(fb) {
        this.fb = fb;
        this.tabIndex = 0;
        this.disabled = false;
        this.options = new DefaultOptions();
        this.selectOptions = this.getSelectOptions();
        this.touched = false;
        this.allForm = this.fb.group({
            cronType: ['unknown', Validators.required],
            seconds: ['0'],
            minutes: ['0'],
            minutesPer: ['0'],
            hours: [this.getAmPmHour('0')],
            hoursPer: ['0'],
            hoursType: [this.getHourType('0')],
            days: ['0'], // Days of Month, 1, 2, 31....
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
    }
    /* Update the cron output to that of the selected tab.
     * The cron output value is updated whenever a form is updated. To make it change in response to tab selection, we simply reset
     * the value of the form that goes into focus.
     * We cannot rely on the index of the tab, as the hide options could hide tabs and
     * then the index dynamically changes based on the hidden tab.*/
    onTabChange(tabChangeEvent) {
        const currentTab = tabChangeEvent.tab;
        let x;
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
    async ngOnInit() {
        this.formSub = this.allForm.valueChanges.pipe(debounceTime(50)).subscribe(value => {
            this.markAsTouched();
            const cron = this.computeCron();
            // this.allForm.controls.expression.setValue(cron, {emitEvent: false});
            this.onChange(cron);
        });
    }
    ngOnDestroy() {
        this.formSub.unsubscribe();
    }
    computeCron() {
        let cron;
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
                throw Error($localize `Unknown cron type ${this.allForm.value.cronType}`);
        }
        return cron;
    }
    computeMinutesCron() {
        const state = this.allForm.value;
        // tslint:disable-next-line:max-line-length
        return `${this.isCronFlavorQuartz ? state.seconds : ''} 0/${state.minutesPer} * 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
    }
    computeHourlyCron() {
        const state = this.allForm.value;
        return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} 0/${state.hoursPer} 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
    }
    computeDailyCron() {
        if (this.allForm.value.weekdaysOnly) {
            return this.computeEveryWeekdayCron();
        }
        return this.computeEveryDaysCron();
    }
    computeEveryDaysCron() {
        const state = this.allForm.value;
        return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} 1/${state.daysPer} * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
    }
    computeEveryWeekdayCron() {
        const state = this.allForm.value;
        return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} * MON-FRI ${this.yearDefaultChar}`.trim();
    }
    computeWeeklyCron() {
        const state = this.allForm.value;
        const days = this.selectOptions.days
            .reduce((acc, day) => state[day] ? acc.concat([day]) : acc, [])
            .join(',') || '*';
        return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} * ${days} ${this.yearDefaultChar}`.trim();
    }
    computeMonthlyCron() {
        const state = this.allForm.value;
        if (state.specificWeekDay) {
            return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} 1/${state.monthsInc} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
        }
        return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.days} 1/${state.monthsInc} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
    }
    computeYearlyCron() {
        const state = this.allForm.value;
        if (state.specificMonthWeek) {
            return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} ${state.months} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
        }
        return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.days} ${state.months} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
    }
    computeAdvancedExpression() {
        const state = this.allForm.value;
        return state.expression;
    }
    dayDisplay(day) {
        return Days[day];
    }
    monthWeekDisplay(monthWeekNumber) {
        return MonthWeeks[monthWeekNumber];
    }
    monthDisplay(month) {
        return Months[parseInt(month, 10)];
    }
    monthDayDisplay(month) {
        if (typeof month === 'number') {
            return `${month}${this.getOrdinalSuffix(month)}`;
        }
        if (month === 'L') {
            return $localize `Last Day`;
        }
        else if (month === 'LW') {
            return $localize `Last Weekday`;
        }
        else if (month === '1W') {
            return $localize `First Weekday`;
        }
        else {
            return `${month}${this.getOrdinalSuffix(month)}`;
        }
    }
    getAmPmHour(hour) {
        if (this.options.use24HourTime) {
            return hour;
        }
        return ((parseInt(hour, 10) + 11) % 12 + 1).toString();
    }
    // Return the AM or PM component of a clocktime, or null if 24-hour format is used.
    getHourType(hour) {
        if (this.options.use24HourTime) {
            return null;
        }
        if (parseInt(hour, 10) >= 12) {
            return 'PM';
        }
        return 'AM';
    }
    hourToCron(hour, hourType) {
        if (this.options.use24HourTime) {
            return hour;
        }
        else {
            return hourType === 'AM' ? (hour === '12' ? '0' : hour) : (hour === '12' ? '12' : (parseInt(hour, 10) + 12).toString());
        }
    }
    handleModelChange(cron) {
        if (!this.cronIsValid(cron)) {
            if (this.isCronFlavorQuartz) {
                throw new Error($localize `Invalid cron expression, there must be 6 or 7 segments`);
            }
            if (this.isCronFlavorStandard) {
                throw new Error($localize `Invalid cron expression, there must be 5 segments`);
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
        this.allForm.controls.seconds.setValue(t[0], { emitEvent: false });
        // Minutes
        let x = parseCronNumberToken(t[1]);
        this.allForm.controls.minutesPer.setValue(x.inc, { emitEvent: false });
        this.allForm.controls.minutes.setValue(x.val);
        // Hours
        x = parseCronNumberToken(t[2]);
        this.allForm.controls.hoursPer.setValue(x.inc);
        this.allForm.controls.hours.setValue(x.val);
        this.allForm.controls.hoursType.setValue(this.getHourType(this.allForm.value.hours), { emitEvent: false });
        // Day of Month
        x = parseCronNumberToken(t[3]);
        this.allForm.controls.days.setValue(x.val, { emitEvent: false });
        this.allForm.controls.daysPer.setValue(x.inc, { emitEvent: false });
        // Month
        x = parseCronNumberToken(t[4]);
        this.allForm.controls.months.setValue(x.val, { emitEvent: false });
        this.allForm.controls.monthsInc.setValue(x.inc, { emitEvent: false });
        // Day of Week
        this.allForm.controls.SUN.setValue(t[5].match(/(?<!#)((SUN)|0)/) !== null, { emitEvent: false });
        this.allForm.controls.MON.setValue(t[5].match(/(?<!#)((MON)|1)/) !== null, { emitEvent: false });
        this.allForm.controls.TUE.setValue(t[5].match(/(?<!#)((TUE)|2)/) !== null, { emitEvent: false });
        this.allForm.controls.WED.setValue(t[5].match(/(?<!#)((WED)|3)/) !== null, { emitEvent: false });
        this.allForm.controls.THU.setValue(t[5].match(/(?<!#)((THU)|4)/) !== null, { emitEvent: false });
        this.allForm.controls.FRI.setValue(t[5].match(/(?<!#)((FRI)|5)/) !== null, { emitEvent: false });
        this.allForm.controls.SAT.setValue(t[5].match(/(?<!#)((SAT)|6)/) !== null, { emitEvent: false });
        // Get value after # sign
        const y = t[5].match(/#[0-9]*$/);
        if (y) {
            this.allForm.controls.monthsWeek.setValue(y[0], { emitEvent: false });
        }
        // Update the day control from selected weekdays.
        // Note, only one day is supported here.
        if (this.allForm.controls.SUN.value) {
            this.allForm.controls.day.setValue('SUN', { emitEvent: false });
        }
        if (this.allForm.controls.MON.value) {
            this.allForm.controls.day.setValue('MON', { emitEvent: false });
        }
        if (this.allForm.controls.TUE.value) {
            this.allForm.controls.day.setValue('TUE', { emitEvent: false });
        }
        if (this.allForm.controls.WED.value) {
            this.allForm.controls.day.setValue('WED', { emitEvent: false });
        }
        if (this.allForm.controls.THU.value) {
            this.allForm.controls.day.setValue('THU', { emitEvent: false });
        }
        if (this.allForm.controls.FRI.value) {
            this.allForm.controls.day.setValue('FRI', { emitEvent: false });
        }
        if (this.allForm.controls.SAT.value) {
            this.allForm.controls.day.setValue('SAT', { emitEvent: false });
        }
        // Year
        // Not supported
        if (cron.match(minutesExp)) {
            this.allForm.controls.cronType.setValue('minutely', { emitEvent: false });
        }
        else if (cron.match(hourlyExp)) {
            this.allForm.controls.cronType.setValue('hourly', { emitEvent: false });
        }
        else if (cron.match(dailyExp)) {
            this.allForm.controls.cronType.setValue('daily', { emitEvent: false });
            this.allForm.controls.weekdaysOnly.setValue(false);
        }
        else if (cron.match(dailyWeekdayExp)) {
            this.allForm.controls.cronType.setValue('daily', { emitEvent: false });
            this.allForm.controls.weekdaysOnly.setValue(true);
        }
        else if (cron.match(weeklyExp)) {
            this.allForm.controls.cronType.setValue('weekly', { emitEvent: false });
        }
        else if (cron.match(monthlyExp)) {
            this.allForm.controls.cronType.setValue('monthly', { emitEvent: false });
            this.allForm.controls.specificWeekDay.setValue(false);
        }
        else if (cron.match(monthlyWeekdayExp)) {
            this.allForm.controls.cronType.setValue('monthly', { emitEvent: false });
            this.allForm.controls.specificWeekDay.setValue(true);
        }
        else if (cron.match(yearlyExp)) {
            this.allForm.controls.cronType.setValue('yearly', { emitEvent: false });
            this.allForm.controls.specificMonthWeek.setValue(false);
        }
        else if (cron.match(yearlyMonthWeekExp)) {
            this.allForm.controls.cronType.setValue('yearly', { emitEvent: false });
            this.allForm.controls.specificMonthWeek.setValue(true);
        }
        else {
            this.allForm.controls.cronType.setValue('unknown', { emitEvent: false });
        }
        this.allForm.updateValueAndValidity({ onlySelf: true });
    }
    cronIsValid(cron) {
        if (cron) {
            const cronParts = cron.split(' ');
            return (this.isCronFlavorQuartz && (cronParts.length === 6
                || cronParts.length === 7)
                || (this.isCronFlavorStandard && cronParts.length === 5));
        }
        return false;
    }
    getOrdinalSuffix(v) {
        // Convert to string. There is also a faster LOG10 algorithm, but it requires the math library.
        let value;
        if (typeof v === 'number') {
            value = v.toString(10);
        }
        else {
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
    getSelectOptions() {
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
    getRange(start, end) {
        const length = end - start + 1;
        return Array.apply(null, Array(length)).map((_, i) => i + start);
    }
    writeValue(obj) {
        if (obj === null) {
            return;
        }
        this.handleModelChange(obj);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    markAsTouched() {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: CronGenComponent, deps: [{ token: i1.FormBuilder }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.6", type: CronGenComponent, selector: "cron-editor", inputs: { backgroundColor: "backgroundColor", color: "color", disabled: "disabled", options: "options" }, providers: [CRON_VALUE_ACCESSOR], viewQueries: [{ propertyName: "minutesTab", first: true, predicate: ["minutesTab"], descendants: true }, { propertyName: "hourlyTab", first: true, predicate: ["hourlyTab"], descendants: true }, { propertyName: "dailyTab", first: true, predicate: ["dailyTab"], descendants: true }, { propertyName: "weeklyTab", first: true, predicate: ["weeklyTab"], descendants: true }, { propertyName: "monthlyTab", first: true, predicate: ["monthlyTab"], descendants: true }, { propertyName: "yearlyTab", first: true, predicate: ["yearlyTab"], descendants: true }, { propertyName: "advancedTab", first: true, predicate: ["advancedTab"], descendants: true }], ngImport: i0, template: "  <mat-tab-group (selectedTabChange)=\"onTabChange($event)\" [(selectedIndex)]=\"tabIndex\">\n\n    <!-- Minute -->\n    <mat-tab [formGroup]=\"allForm\"  i18n-label label=\"Minutely\" *ngIf=\"!options.hideMinutesTab\" #minutesTab>\n      <div class=\"cron-editor-tab-content\" (click)=\"allForm.controls.cronType.setValue('minutely')\">\n\n        <div>\n          <span i18n>Every</span>\n          <mat-form-field>\n            <mat-label i18n>Minute(s)</mat-label>\n            <mat-select formControlName=\"minutesPer\">\n              <mat-option *ngFor=\"let minute of selectOptions.minutes\" [value]=\"minute\">{{minute}}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n\n        <div *ngIf=\"isCronFlavorQuartz\">\n          <span i18n>At time</span>\n          <cron-time-picker\n            [formGroup]=\"allForm\"\n            [hideHours] = true\n            [hideMinutes] = true\n            [use24HourTime]=\"options.use24HourTime\"\n            [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n    </mat-tab>\n\n    <!-- Hourly -->\n    <mat-tab  i18n-label label=\"Hourly\" *ngIf=\"!options.hideHourlyTab\" #hourlyTab>\n      <div class=\"cron-editor-tab-content\" (click)=\"allForm.controls.cronType.setValue('hourly')\">\n        <div>\n          <span i18n class=\"cron-form-label\">Every </span>\n          <mat-form-field [formGroup]=\"allForm\">\n            <mat-label i18n>Hour(s)</mat-label>\n            <mat-select formControlName=\"hoursPer\">\n              <mat-option *ngFor=\"let hour of selectOptions.hours\" [value]=\"hour\">{{hour}}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n        <div>\n          <span i18n>At time </span>\n          <cron-time-picker\n              [formGroup]=\"allForm\"\n              [hideHours] = true\n              [use24HourTime]=\"options.use24HourTime\"\n              [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n    </mat-tab>\n\n    <!-- Daily-->\n    <mat-tab i18n-label label=\"Daily\" *ngIf=\"!options.hideDailyTab\" #dailyTab>\n      <div class=\"cron-editor-tab-content\" (click)=\"allForm.controls.cronType.setValue('daily')\">\n\n        <div [formGroup]=\"allForm\">\n          <span i18n>Every </span>\n            <mat-radio-group class=\"cron-editor-radio-group\" formControlName=\"weekdaysOnly\" >\n              <mat-radio-button name=\"subTab\" class=\"cron-editor-radio-button\" [value]=\"false\"  [checked]=\"true\" >\n                <mat-form-field>\n                  <mat-label i18n>Day(s)</mat-label>\n                  <mat-select formControlName=\"daysPer\">\n                    <mat-option *ngFor=\"let monthDay of selectOptions.monthDays\" [value]=\"monthDay\">\n                      {{monthDay}}\n                    </mat-option>\n                  </mat-select>\n                </mat-form-field>\n              </mat-radio-button>\n              <mat-radio-button name=\"subTab\" class=\"cron-editor-radio-button\" [value]=\"true\">\n                <span i18n>Week Day (MON-FRI) </span>\n              </mat-radio-button>\n            </mat-radio-group>\n        </div>\n\n        <div>\n          <span i18n>At time </span>\n          <cron-time-picker\n            [formGroup]=\"allForm\"\n            [use24HourTime]=\"options.use24HourTime\"\n            [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n\n    </mat-tab>\n\n    <!-- Weekly-->\n    <mat-tab i18n-label label=\"Weekly\" *ngIf=\"!options.hideWeeklyTab\" #weeklyTab >\n      <div class=\"cron-editor-tab-content\" (click)=\"allForm.controls.cronType.setValue('weekly')\">\n\n        <div>\n          <span i18n>Every:</span>\n\n          <span [formGroup]=\"allForm\">\n            <mat-checkbox formControlName=\"MON\" i18n>Monday</mat-checkbox>\n            <mat-checkbox formControlName=\"TUE\" i18n>Tuesday</mat-checkbox>\n            <mat-checkbox formControlName=\"WED\" i18n>Wednesday</mat-checkbox>\n            <mat-checkbox formControlName=\"THU\" i18n>Thursday</mat-checkbox>\n            <mat-checkbox formControlName=\"FRI\" i18n>Friday</mat-checkbox>\n            <mat-checkbox formControlName=\"SAT\" i18n>Saturday</mat-checkbox>\n            <mat-checkbox formControlName=\"SUN\" i18n>Sunday</mat-checkbox>\n          </span>\n        </div>\n\n        <div>\n          <span i18n class=\"cron-form-label\"> At </span>\n          <cron-time-picker [formGroup]=\"allForm\"\n                            [use24HourTime]=\"options.use24HourTime\"\n                            [hideSeconds]=\"options.hideSeconds|| !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n    </mat-tab>\n\n    <!-- Monthly-->\n    <mat-tab i18n-label label=\"Monthly\" *ngIf=\"!options.hideMonthlyTab\" #monthlyTab>\n      <div class=\"cron-editor-tab-content\" [formGroup]=\"allForm\" (click)=\"allForm.controls.cronType.setValue('monthly')\">\n\n        <mat-radio-group formControlName=\"specificWeekDay\">\n          <mat-radio-button name=\"monthly-radio\" class=\"cron-editor-pad-line\" [value]=\"false\">\n            <!-- Spesific day -->\n\n              <span i18n>On the</span>\n\n                <mat-form-field>\n                  <mat-label i18n>Day</mat-label>\n                  <mat-select formControlName=\"days\">\n                    <mat-option *ngFor=\"let monthDay of selectOptions.monthDays\" [value]=\"monthDay\">\n                      {{monthDayDisplay(monthDay)}}\n                    </mat-option>\n                  </mat-select>\n                </mat-form-field>\n\n              <span i18n>of every</span>\n\n                <mat-form-field>\n                  <mat-label i18n>Month</mat-label>\n                  <mat-select formControlName=\"monthsInc\" [ngClass]=\"options.formSelectClass\">\n                    <mat-option *ngFor=\"let month of selectOptions.months\" [value]=\"month\">\n                      {{month}}\n                    </mat-option>\n                  </mat-select>\n                </mat-form-field>\n\n          </mat-radio-button>\n\n          <mat-radio-button name=\"monthly-radio\" class=\"cron-editor-pad-line\"  [value]=\"true\" >\n\n            <!-- Spesific Week day -->\n            <span i18n>On the</span>\n\n              <mat-form-field>\n                <mat-label i18n>Week</mat-label>\n                <mat-select class=\"day-order-in-month\" formControlName=\"monthsWeek\">\n                  <mat-option *ngFor=\"let monthWeek of selectOptions.monthWeeks\" [value]=\"monthWeek\">\n                    {{monthWeekDisplay(monthWeek)}}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field>\n                <mat-label i18n>Day</mat-label>\n                <mat-select class=\"week-days\" formControlName=\"day\">\n                  <mat-option *ngFor=\"let day of selectOptions.days\" [value]=\"day\">\n                    {{dayDisplay(day)}}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <span i18n>of every</span>\n\n              <mat-form-field>\n                <mat-label i18n>Month</mat-label>\n                <mat-select class=\"months-small\" formControlName=\"monthsInc\">\n                  <mat-option *ngFor=\"let month of selectOptions.months\" [value]=\"month\">\n                    {{month}}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n          </mat-radio-button>\n        </mat-radio-group>\n\n        <div class=\"cron-editor-pad-line\" >\n          <span i18n>At time</span>\n          <cron-time-picker [formGroup]=\"allForm\"\n                            [use24HourTime]=\"options.use24HourTime\"\n                            [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n    </mat-tab>\n\n    <!-- Yearly-->\n    <mat-tab i18n-label  label=\"Yearly\" *ngIf=\"!options.hideYearlyTab\" #yearlyTab>\n      <div class=\"cron-editor-tab-content\" [formGroup]=\"allForm\">\n        <mat-radio-group class=\"cron-editor-radio-group\" formControlName=\"specificMonthWeek\">\n          <mat-radio-button name=\"yearly-radio\" class=\"cron-editor-pad-line\" [value]=\"false\">\n\n            <span i18n>On the</span>\n\n            <mat-form-field>\n              <mat-label i18n>Day</mat-label>\n              <mat-select formControlName=\"days\" >\n                <mat-option *ngFor=\"let monthDay of selectOptions.monthDays\" [value]=\"monthDay\">\n                  {{monthDayDisplay(monthDay)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <span i18n=\"day of month\">of</span>\n\n            <mat-form-field>\n              <mat-label i18n>Month</mat-label>\n              <mat-select formControlName=\"months\">\n                <mat-option *ngFor=\"let month of selectOptions.months\" [value]=\"month\">\n                  {{monthDisplay(month)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n          </mat-radio-button>\n\n          <mat-radio-button name=\"yearly-radio\" class=\"cron-editor-pad-line\" [value]=\"true\">\n\n            <span i18n>On the</span>\n\n            <mat-form-field >\n              <mat-label i18n>Week</mat-label>\n              <mat-select formControlName=\"monthsWeek\" >\n                <mat-option *ngFor=\"let monthWeek of selectOptions.monthWeeks\" [value]=\"monthWeek\">\n                  {{monthWeekDisplay(monthWeek)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <mat-form-field>\n              <mat-label i18n>Day</mat-label>\n              <mat-select formControlName=\"day\" >\n                <mat-option *ngFor=\"let day of selectOptions.days\" [value]=\"day\">\n                  {{dayDisplay(day)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <span i18n>of</span>\n\n            <mat-form-field>\n              <mat-label i18n>Month</mat-label>\n              <mat-select formControlName=\"months\">\n                <mat-option *ngFor=\"let month of selectOptions.months\" [value]=\"month\">\n                  {{monthDisplay(month)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n          </mat-radio-button>\n        </mat-radio-group>\n\n        <div class=\"cron-editor-pad-line\">\n\n          <span i18n>At time</span>\n\n          <cron-time-picker [disabled]=\"disabled\"\n                            [formGroup]=\"allForm\"\n                            [use24HourTime]=\"options.use24HourTime\"\n                            [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n\n      </div>\n    </mat-tab>\n\n    <!-- Advanced-->\n    <mat-tab i18n-label label=\"Advanced\" *ngIf=\"!options.hideAdvancedTab\" #advancedTab>\n      <div class=\"cron-editor-tab-content\" [formGroup]=\"allForm\">\n        <mat-form-field>\n          <mat-label i18n>Expression</mat-label>\n          <input matInput type=\"text\" class=\"advanced-cron-editor-input\" formControlName=\"expression\">\n        </mat-form-field>\n      </div>\n    </mat-tab>\n  </mat-tab-group>\n", styles: [".cron-editor-tab-content{margin-top:24px}.cron-editor-radio-group{display:flex;flex-direction:column;margin:15px 0;align-items:flex-start}.cron-editor-radio-button{margin:5px}.cron-editor-pad-line *{padding-left:8px}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i3$1.MatTab, selector: "mat-tab", inputs: ["disabled", "label", "aria-label", "aria-labelledby", "labelClass", "bodyClass"], exportAs: ["matTab"] }, { kind: "component", type: i3$1.MatTabGroup, selector: "mat-tab-group", inputs: ["color", "fitInkBarToContent", "mat-stretch-tabs", "dynamicHeight", "selectedIndex", "headerPosition", "animationDuration", "contentTabIndex", "disablePagination", "disableRipple", "preserveContent", "backgroundColor", "aria-label", "aria-labelledby"], outputs: ["selectedIndexChange", "focusChange", "animationDone", "selectedTabChange"], exportAs: ["matTabGroup"] }, { kind: "component", type: i3.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i3.MatLabel, selector: "mat-label" }, { kind: "component", type: i4.MatSelect, selector: "mat-select", inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth"], outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"], exportAs: ["matSelect"] }, { kind: "component", type: i5.MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "directive", type: i7.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "directive", type: i8.MatRadioGroup, selector: "mat-radio-group", inputs: ["color", "name", "labelPosition", "value", "selected", "disabled", "required", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioGroup"] }, { kind: "component", type: i8.MatRadioButton, selector: "mat-radio-button", inputs: ["id", "name", "aria-label", "aria-labelledby", "aria-describedby", "disableRipple", "tabIndex", "checked", "value", "labelPosition", "disabled", "required", "color", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioButton"] }, { kind: "component", type: i9.MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "disabledInteractive", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "component", type: TimePickerComponent, selector: "cron-time-picker", inputs: ["disabled", "use24HourTime", "hideHours", "hideMinutes", "hideSeconds"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: CronGenComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cron-editor', providers: [CRON_VALUE_ACCESSOR], template: "  <mat-tab-group (selectedTabChange)=\"onTabChange($event)\" [(selectedIndex)]=\"tabIndex\">\n\n    <!-- Minute -->\n    <mat-tab [formGroup]=\"allForm\"  i18n-label label=\"Minutely\" *ngIf=\"!options.hideMinutesTab\" #minutesTab>\n      <div class=\"cron-editor-tab-content\" (click)=\"allForm.controls.cronType.setValue('minutely')\">\n\n        <div>\n          <span i18n>Every</span>\n          <mat-form-field>\n            <mat-label i18n>Minute(s)</mat-label>\n            <mat-select formControlName=\"minutesPer\">\n              <mat-option *ngFor=\"let minute of selectOptions.minutes\" [value]=\"minute\">{{minute}}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n\n        <div *ngIf=\"isCronFlavorQuartz\">\n          <span i18n>At time</span>\n          <cron-time-picker\n            [formGroup]=\"allForm\"\n            [hideHours] = true\n            [hideMinutes] = true\n            [use24HourTime]=\"options.use24HourTime\"\n            [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n    </mat-tab>\n\n    <!-- Hourly -->\n    <mat-tab  i18n-label label=\"Hourly\" *ngIf=\"!options.hideHourlyTab\" #hourlyTab>\n      <div class=\"cron-editor-tab-content\" (click)=\"allForm.controls.cronType.setValue('hourly')\">\n        <div>\n          <span i18n class=\"cron-form-label\">Every </span>\n          <mat-form-field [formGroup]=\"allForm\">\n            <mat-label i18n>Hour(s)</mat-label>\n            <mat-select formControlName=\"hoursPer\">\n              <mat-option *ngFor=\"let hour of selectOptions.hours\" [value]=\"hour\">{{hour}}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n        <div>\n          <span i18n>At time </span>\n          <cron-time-picker\n              [formGroup]=\"allForm\"\n              [hideHours] = true\n              [use24HourTime]=\"options.use24HourTime\"\n              [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n    </mat-tab>\n\n    <!-- Daily-->\n    <mat-tab i18n-label label=\"Daily\" *ngIf=\"!options.hideDailyTab\" #dailyTab>\n      <div class=\"cron-editor-tab-content\" (click)=\"allForm.controls.cronType.setValue('daily')\">\n\n        <div [formGroup]=\"allForm\">\n          <span i18n>Every </span>\n            <mat-radio-group class=\"cron-editor-radio-group\" formControlName=\"weekdaysOnly\" >\n              <mat-radio-button name=\"subTab\" class=\"cron-editor-radio-button\" [value]=\"false\"  [checked]=\"true\" >\n                <mat-form-field>\n                  <mat-label i18n>Day(s)</mat-label>\n                  <mat-select formControlName=\"daysPer\">\n                    <mat-option *ngFor=\"let monthDay of selectOptions.monthDays\" [value]=\"monthDay\">\n                      {{monthDay}}\n                    </mat-option>\n                  </mat-select>\n                </mat-form-field>\n              </mat-radio-button>\n              <mat-radio-button name=\"subTab\" class=\"cron-editor-radio-button\" [value]=\"true\">\n                <span i18n>Week Day (MON-FRI) </span>\n              </mat-radio-button>\n            </mat-radio-group>\n        </div>\n\n        <div>\n          <span i18n>At time </span>\n          <cron-time-picker\n            [formGroup]=\"allForm\"\n            [use24HourTime]=\"options.use24HourTime\"\n            [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n\n    </mat-tab>\n\n    <!-- Weekly-->\n    <mat-tab i18n-label label=\"Weekly\" *ngIf=\"!options.hideWeeklyTab\" #weeklyTab >\n      <div class=\"cron-editor-tab-content\" (click)=\"allForm.controls.cronType.setValue('weekly')\">\n\n        <div>\n          <span i18n>Every:</span>\n\n          <span [formGroup]=\"allForm\">\n            <mat-checkbox formControlName=\"MON\" i18n>Monday</mat-checkbox>\n            <mat-checkbox formControlName=\"TUE\" i18n>Tuesday</mat-checkbox>\n            <mat-checkbox formControlName=\"WED\" i18n>Wednesday</mat-checkbox>\n            <mat-checkbox formControlName=\"THU\" i18n>Thursday</mat-checkbox>\n            <mat-checkbox formControlName=\"FRI\" i18n>Friday</mat-checkbox>\n            <mat-checkbox formControlName=\"SAT\" i18n>Saturday</mat-checkbox>\n            <mat-checkbox formControlName=\"SUN\" i18n>Sunday</mat-checkbox>\n          </span>\n        </div>\n\n        <div>\n          <span i18n class=\"cron-form-label\"> At </span>\n          <cron-time-picker [formGroup]=\"allForm\"\n                            [use24HourTime]=\"options.use24HourTime\"\n                            [hideSeconds]=\"options.hideSeconds|| !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n    </mat-tab>\n\n    <!-- Monthly-->\n    <mat-tab i18n-label label=\"Monthly\" *ngIf=\"!options.hideMonthlyTab\" #monthlyTab>\n      <div class=\"cron-editor-tab-content\" [formGroup]=\"allForm\" (click)=\"allForm.controls.cronType.setValue('monthly')\">\n\n        <mat-radio-group formControlName=\"specificWeekDay\">\n          <mat-radio-button name=\"monthly-radio\" class=\"cron-editor-pad-line\" [value]=\"false\">\n            <!-- Spesific day -->\n\n              <span i18n>On the</span>\n\n                <mat-form-field>\n                  <mat-label i18n>Day</mat-label>\n                  <mat-select formControlName=\"days\">\n                    <mat-option *ngFor=\"let monthDay of selectOptions.monthDays\" [value]=\"monthDay\">\n                      {{monthDayDisplay(monthDay)}}\n                    </mat-option>\n                  </mat-select>\n                </mat-form-field>\n\n              <span i18n>of every</span>\n\n                <mat-form-field>\n                  <mat-label i18n>Month</mat-label>\n                  <mat-select formControlName=\"monthsInc\" [ngClass]=\"options.formSelectClass\">\n                    <mat-option *ngFor=\"let month of selectOptions.months\" [value]=\"month\">\n                      {{month}}\n                    </mat-option>\n                  </mat-select>\n                </mat-form-field>\n\n          </mat-radio-button>\n\n          <mat-radio-button name=\"monthly-radio\" class=\"cron-editor-pad-line\"  [value]=\"true\" >\n\n            <!-- Spesific Week day -->\n            <span i18n>On the</span>\n\n              <mat-form-field>\n                <mat-label i18n>Week</mat-label>\n                <mat-select class=\"day-order-in-month\" formControlName=\"monthsWeek\">\n                  <mat-option *ngFor=\"let monthWeek of selectOptions.monthWeeks\" [value]=\"monthWeek\">\n                    {{monthWeekDisplay(monthWeek)}}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field>\n                <mat-label i18n>Day</mat-label>\n                <mat-select class=\"week-days\" formControlName=\"day\">\n                  <mat-option *ngFor=\"let day of selectOptions.days\" [value]=\"day\">\n                    {{dayDisplay(day)}}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <span i18n>of every</span>\n\n              <mat-form-field>\n                <mat-label i18n>Month</mat-label>\n                <mat-select class=\"months-small\" formControlName=\"monthsInc\">\n                  <mat-option *ngFor=\"let month of selectOptions.months\" [value]=\"month\">\n                    {{month}}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n          </mat-radio-button>\n        </mat-radio-group>\n\n        <div class=\"cron-editor-pad-line\" >\n          <span i18n>At time</span>\n          <cron-time-picker [formGroup]=\"allForm\"\n                            [use24HourTime]=\"options.use24HourTime\"\n                            [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n      </div>\n    </mat-tab>\n\n    <!-- Yearly-->\n    <mat-tab i18n-label  label=\"Yearly\" *ngIf=\"!options.hideYearlyTab\" #yearlyTab>\n      <div class=\"cron-editor-tab-content\" [formGroup]=\"allForm\">\n        <mat-radio-group class=\"cron-editor-radio-group\" formControlName=\"specificMonthWeek\">\n          <mat-radio-button name=\"yearly-radio\" class=\"cron-editor-pad-line\" [value]=\"false\">\n\n            <span i18n>On the</span>\n\n            <mat-form-field>\n              <mat-label i18n>Day</mat-label>\n              <mat-select formControlName=\"days\" >\n                <mat-option *ngFor=\"let monthDay of selectOptions.monthDays\" [value]=\"monthDay\">\n                  {{monthDayDisplay(monthDay)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <span i18n=\"day of month\">of</span>\n\n            <mat-form-field>\n              <mat-label i18n>Month</mat-label>\n              <mat-select formControlName=\"months\">\n                <mat-option *ngFor=\"let month of selectOptions.months\" [value]=\"month\">\n                  {{monthDisplay(month)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n          </mat-radio-button>\n\n          <mat-radio-button name=\"yearly-radio\" class=\"cron-editor-pad-line\" [value]=\"true\">\n\n            <span i18n>On the</span>\n\n            <mat-form-field >\n              <mat-label i18n>Week</mat-label>\n              <mat-select formControlName=\"monthsWeek\" >\n                <mat-option *ngFor=\"let monthWeek of selectOptions.monthWeeks\" [value]=\"monthWeek\">\n                  {{monthWeekDisplay(monthWeek)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <mat-form-field>\n              <mat-label i18n>Day</mat-label>\n              <mat-select formControlName=\"day\" >\n                <mat-option *ngFor=\"let day of selectOptions.days\" [value]=\"day\">\n                  {{dayDisplay(day)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <span i18n>of</span>\n\n            <mat-form-field>\n              <mat-label i18n>Month</mat-label>\n              <mat-select formControlName=\"months\">\n                <mat-option *ngFor=\"let month of selectOptions.months\" [value]=\"month\">\n                  {{monthDisplay(month)}}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n          </mat-radio-button>\n        </mat-radio-group>\n\n        <div class=\"cron-editor-pad-line\">\n\n          <span i18n>At time</span>\n\n          <cron-time-picker [disabled]=\"disabled\"\n                            [formGroup]=\"allForm\"\n                            [use24HourTime]=\"options.use24HourTime\"\n                            [hideSeconds]=\"options.hideSeconds || !isCronFlavorQuartz\">\n          </cron-time-picker>\n        </div>\n\n      </div>\n    </mat-tab>\n\n    <!-- Advanced-->\n    <mat-tab i18n-label label=\"Advanced\" *ngIf=\"!options.hideAdvancedTab\" #advancedTab>\n      <div class=\"cron-editor-tab-content\" [formGroup]=\"allForm\">\n        <mat-form-field>\n          <mat-label i18n>Expression</mat-label>\n          <input matInput type=\"text\" class=\"advanced-cron-editor-input\" formControlName=\"expression\">\n        </mat-form-field>\n      </div>\n    </mat-tab>\n  </mat-tab-group>\n", styles: [".cron-editor-tab-content{margin-top:24px}.cron-editor-radio-group{display:flex;flex-direction:column;margin:15px 0;align-items:flex-start}.cron-editor-radio-button{margin:5px}.cron-editor-pad-line *{padding-left:8px}\n"] }]
        }], ctorParameters: () => [{ type: i1.FormBuilder }], propDecorators: { backgroundColor: [{
                type: Input
            }], color: [{
                type: Input
            }], disabled: [{
                type: Input
            }], options: [{
                type: Input
            }], minutesTab: [{
                type: ViewChild,
                args: ['minutesTab']
            }], hourlyTab: [{
                type: ViewChild,
                args: ['hourlyTab']
            }], dailyTab: [{
                type: ViewChild,
                args: ['dailyTab']
            }], weeklyTab: [{
                type: ViewChild,
                args: ['weeklyTab']
            }], monthlyTab: [{
                type: ViewChild,
                args: ['monthlyTab']
            }], yearlyTab: [{
                type: ViewChild,
                args: ['yearlyTab']
            }], advancedTab: [{
                type: ViewChild,
                args: ['advancedTab']
            }] } });

class CronEditorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: CronEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.6", ngImport: i0, type: CronEditorModule, declarations: [TimePickerComponent, CronGenComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatTabsModule,
            MatListModule,
            MatSelectModule,
            MatInputModule,
            MatRadioModule,
            MatCheckboxModule], exports: [TimePickerComponent, CronGenComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: CronEditorModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatTabsModule,
            MatListModule,
            MatSelectModule,
            MatInputModule,
            MatRadioModule,
            MatCheckboxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: CronEditorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        MatTabsModule,
                        MatListModule,
                        MatSelectModule,
                        MatInputModule,
                        MatRadioModule,
                        MatCheckboxModule
                    ],
                    exports: [TimePickerComponent, CronGenComponent],
                    declarations: [TimePickerComponent, CronGenComponent]
                }]
        }] });

/*
 * Public API Surface
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CRON_VALUE_ACCESSOR, CronEditorModule, CronGenComponent, Days, DefaultOptions, MonthWeeks, Months, TimePickerComponent };
//# sourceMappingURL=ngx-cron-editor.mjs.map
