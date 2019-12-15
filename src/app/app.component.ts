import { Component, ViewChild } from '@angular/core';
import { CronOptions } from './cron-editor/CronOptions';
import { CronGenComponent } from './cron-editor/cron-editor.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public cronExpression = '0 0 1/1 * *';
  public isCronDisabled = false;
  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',

    defaultTime: '00:00:00',

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,
    hideSpecificWeekDayTab : false,
    hideSpecificMonthWeekTab : false,

    use24HourTime: true,
    hideSeconds: false,

    cronFlavor: 'standard'
  };

  @ViewChild('cronEditorDemo', { static: false })
  cronEditorDemo: CronGenComponent;

  cronFlavorChange() {
    this.cronEditorDemo.options = this.cronOptions;
    this.cronEditorDemo.regenerateCron();
  }
}
