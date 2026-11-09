ngx-cron-editor
===

An Angular Material component for building cron expressions graphically. It
works as a form control in reactive and template-driven forms, and supports
standard (Unix) and Quartz cron expressions.

## Demo

Try it at [haavardj.github.io/ngx-cron-editor](https://haavardj.github.io/ngx-cron-editor/).

## Angular versions

| ngx-cron-editor | Angular |
|-----------------|---------|
| 0.11.x          | 22      |
| 0.10.x          | 15–18   |

Apps on older Angular versions should stay on 0.10.x.

## Installation

```
npm install ngx-cron-editor
```

The editor needs `@angular/material` and `@angular/cdk` in your app.

## Usage

Import `CronEditorModule` in a standalone component and bind the editor to a
form control:

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CronEditorModule } from 'ngx-cron-editor';

@Component({
  selector: 'app-schedule',
  imports: [CronEditorModule, ReactiveFormsModule],
  template: `<cron-editor [formControl]="cron"></cron-editor>`,
})
export class ScheduleComponent {
  cron = new FormControl('0 0 1/1 * *');
}
```

`formControlName` and `ngModel` work too. In an NgModule-based app, add
`CronEditorModule` to the module's `imports`.

## Cron flavors

The editor reads and writes one of two formats, set with the `cronFlavor`
option. The default is `standard`.

| Flavor     | Fields                                                        | Example                  |
|------------|---------------------------------------------------------------|--------------------------|
| `standard` | minute hour day-of-month month day-of-week                    | `30 10 * * MON-FRI`      |
| `quartz`   | second minute hour day-of-month month day-of-week [year]      | `0 30 10 ? * MON-FRI *`  |

Quartz uses `?` for the day field that is not set. The form control's value
must match the flavor; see [Validation](#validation).

## Options

Pass a `CronOptions` object through the `options` input. Start from
`DefaultOptions` and override what you need:

```ts
import { CronOptions, DefaultOptions } from 'ngx-cron-editor';

cronOptions: CronOptions = { ...new DefaultOptions(), cronFlavor: 'quartz', hideAdvancedTab: true };
```

```html
<cron-editor [formControl]="cron" [options]="cronOptions"></cron-editor>
```

| Option            | Default      | Description                                              |
|-------------------|--------------|----------------------------------------------------------|
| `cronFlavor`      | `'standard'` | `'standard'` or `'quartz'`; see [Cron flavors](#cron-flavors). |
| `hideMinutesTab`  | `false`      | Hide the Minutely tab.                                   |
| `hideHourlyTab`   | `false`      | Hide the Hourly tab.                                     |
| `hideDailyTab`    | `false`      | Hide the Daily tab.                                      |
| `hideWeeklyTab`   | `false`      | Hide the Weekly tab.                                     |
| `hideMonthlyTab`  | `false`      | Hide the Monthly tab.                                    |
| `hideYearlyTab`   | `false`      | Hide the Yearly tab.                                     |
| `hideAdvancedTab` | `false`      | Hide the Advanced tab, where the expression is edited as text. |
| `use24HourTime`   | `true`       | Use a 24-hour clock. `false` shows hours 0–12 with AM/PM. |
| `hideSeconds`     | `false`      | Hide the seconds selector. Seconds are only shown for `quartz`. |

## Validation

The editor is also a validator for its form control. An expression with the wrong
number of fields for the configured `cronFlavor` (5 for `standard`, 6 or 7 for
`quartz`) makes the control invalid with a `cronSegments` error:

```ts
const err = this.cron.getError('cronSegments');
// { flavor: 'standard', expected: [5], actual: 7 }
```

```html
@if (cron.getError('cronSegments'); as err) {
  <p role="alert">Expected {{ err.expected.join(' or ') }} fields, got {{ err.actual }}.</p>
}
```

The editor shows such an expression in the Advanced tab so the user can correct
it. If the Advanced tab is hidden, the editor keeps its current state. The control
is revalidated when `cronFlavor` changes. An empty value is valid; add
`Validators.required` to reject it.

## Theming

The editor is built from Angular Material components, so it follows your app's
Material theme. No extra setup is needed.

## History

ngx-cron-editor is a fork of vincentjames501's
[angular-cron-gen](https://github.com/vincentjames501/angular-cron-gen) for
AngularJS and claudiuconstantin's
[cron-editor](https://github.com/claudiuconstantin/cron-editor). It adds support
for current Angular versions and Angular Material.

## License

MIT. See [LICENSE.md](LICENSE.md).
