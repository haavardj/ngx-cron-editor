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
    // FormControl for input
    expressionInput: [this.cronExpression],
    // FormControl for editor
    expressionEditor: [this.cronExpression]
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const controlInput = this.form.get('expressionInput');
    const controlEditor = this.form.get('expressionEditor');
    controlInput.valueChanges
      .subscribe(m => {
        if (m !== controlEditor.value) {
          // updating the editor when the input value changes
          controlEditor.setValue(m);
        }
      });
    controlEditor.valueChanges
      .subscribe(m => {
        if (m !== controlInput.value) {
          // updating the input when the editor value changes
          controlInput.setValue(m);
        }
      });
    // this.form.valueChanges.subscribe( val  => {console.log(JSON.stringify(val)) })
  }

  cronFlavorChange() {
    this.cronEditorDemo1.options = this.cronOptions;
    this.cronEditorDemo2.options = this.cronOptions;
  }
}
