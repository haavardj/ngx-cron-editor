import {Component, OnInit, ViewChild} from '@angular/core';
import {DefaultOptions} from 'ngx-cron-editor';
import { CronGenComponent } from 'ngx-cron-editor';
import {FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public cronExpression = '3 23/45 1 1/1 * *';
  public isCronDisabled = false;
  public cronOptions = new DefaultOptions();


  @ViewChild('cronEditorDemo')
  cronEditorDemo: CronGenComponent;

  cronForm = new FormControl(this.cronExpression);
  constructor() {
    this.cronOptions.cronFlavor = 'quartz';

  }

  ngOnInit(): void {}

  cronFlavorChange() {
    this.cronEditorDemo.options = this.cronOptions;
  }
}
