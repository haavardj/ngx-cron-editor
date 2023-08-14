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
  public cronExpression = '0/20 1 1/1 * *';
  public isCronDisabled = false;
  public cronOptions = new DefaultOptions();


  @ViewChild('cronEditorDemo')
  cronEditorDemo: CronGenComponent;

  cronForm = new FormControl(this.cronExpression);
  constructor() {}

  ngOnInit(): void {}

  cronFlavorChange() {
    this.cronEditorDemo.options = this.cronOptions;
  }
}
