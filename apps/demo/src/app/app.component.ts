import {Component, OnInit, ViewChild} from '@angular/core';
import {DefaultOptions} from 'ngx-cron-editor';
import { CronGenComponent } from 'ngx-cron-editor';
import {FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public cronExpression = '5/3 3 1/1 * *';
  public isCronDisabled = false;
  public cronOptions = new DefaultOptions();


  @ViewChild('cronEditorDemo1')
  cronEditorDemo1: CronGenComponent;

  @ViewChild('cronEditorDemo2')
  cronEditorDemo2: CronGenComponent;

  form = this.fb.group({
    expression: [this.cronExpression]
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.form.valueChanges.subscribe( val  => {console.log(JSON.stringify(val)) })
  }

  cronFlavorChange() {
    this.cronEditorDemo1.options = this.cronOptions;
    this.cronEditorDemo2.options = this.cronOptions;
  }
}
