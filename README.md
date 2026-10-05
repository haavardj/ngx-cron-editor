ngx-cron-editor
===

An Angular 15–22 component for building cron expressions graphically. It is meant
to be used in reactive forms and support Angular Material Design styling.
 

## Demo

A work-in-progress demo can be found [here](https://haavardj.github.io/ngx-cron-editor/)

## Development

This repository uses [mise](https://mise.jdx.dev/) to pin Node.js and set
project environment variables. Trust the project config with `mise trust`,
then run `mise install` and `mise run install` to install the locked
dependencies. Use `mise run start`, `mise run build`, or `mise run test` for the
existing project commands.

The library supports Angular 15–22. Run the manually invoked matrix with
`mise run compat`. For a package tarball that supports the full range, run
`mise run release-package` after the matrix; it writes the Angular 15-built
package to `dist/release`. Results and maintenance notes are in
[the Angular support plan](docs/angular-support-plan.md).

## Usage

1. Install the npm package:
    ```
    $ npm i ngx-cron-editor -S
    ```

2. Import the module in your own module:

    ```ts
    import { CronEditorModule } from 'ngx-cron-editor';

    @NgModule({
        imports: [..., CronEditorModule],
    ...
    })
    export class MyModule {
    }
    ```

3. Setup the FormControl in you component's typescript file:
   
   ```ts
   ngOnInit(): void {
     this.cronForm = new FormControl('0 0 1/1 * *');
   }
   ```
   
4. Include the component in your html code:

    ```html
    <cron-editor [formControl]="cronForm"></cron-editor>
    ```
   
   or use the `formControlName='...'` directive if your form controller
   lives in a FormGroup.

## Options

```html
<cron-editor [formControl]="cronForm" [options]="cronOptions"></cron-editor>
```

```ts
import { CronOptions } from 'ngx-cron-editor';

@Component({
    ...
})
export class MyComponent {
   public cronOptions: CronOptions = {
       defaultTime: "00:00:00",

       hideMinutesTab: false,
       hideHourlyTab: false,
       hideDailyTab: false,
       hideWeeklyTab: false,
       hideMonthlyTab: false,
       hideYearlyTab: false,
       hideAdvancedTab: true,
       hideSpecificWeekDayTab: false,
       hideSpecificMonthWeekTab : false,

       use24HourTime: true,
       hideSeconds: false,

       cronFlavor: "quartz" //standard or quartz
    };
}
```

## History

The ngx-cron-editor is a fork of the vincentjames501's [angular-cron-gen](https://github.com/vincentjames501/angular-cron-gen) for AngularJS 1.5+ and claudiuconstantin's [cron-editor](https://github.com/claudiuconstantin/cron-editor). 

**The main additions of this fork is support for Angular 8+ and material design.**


## License:
Licensed under the MIT license
