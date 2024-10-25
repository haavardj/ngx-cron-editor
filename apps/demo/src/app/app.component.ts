import {Component, OnInit, ViewChild} from '@angular/core';
import {DefaultOptions} from 'ngx-cron-editor';
import { CronGenComponent } from 'ngx-cron-editor';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public defaultExpression = '0/3 * 1/1 * *';
  public cronOptions = new DefaultOptions();


  @ViewChild('cronEditorDemo1')
  cronEditorDemo1: CronGenComponent | undefined;

  @ViewChild('cronEditorDemo2')
  cronEditorDemo2: CronGenComponent | undefined;

  form = this.fb.group({

    // FormControl for input
    expressionInput: [this.defaultExpression],

    // FormControl for output
    expressionOutput: [this.defaultExpression],

    // FormControl for editor
    expressionEditor: [this.defaultExpression]
  })

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const controlInput = this.form.get('expressionInput');
    const controlOutput = this.form.get('expressionOutput');
    const controlEditor = this.form.get('expressionEditor');

    if (!controlInput) {
      return
    }

    if (!controlEditor) {
      return
    }

    controlOutput.valueChanges
      .subscribe(m => {
        if (m !== controlEditor.value) {
          // updating the input when the editor value changes
          controlEditor.setValue(m);
        }
      });

    controlEditor.valueChanges
      .subscribe(m => {
        if (m !== controlOutput.value) {
          // updating the input when the editor value changes
          controlOutput.setValue(m);
        }
      });
  }

  cronFlavorChange() {

    if (this.cronEditorDemo1) {
      this.cronEditorDemo1.options = this.cronOptions;
    }

    if (this.cronEditorDemo2) {
      this.cronEditorDemo2.options = this.cronOptions;
    }
  }

  updateExpression() {

    // const controlInput = this.form.get('expressionInput');
    const controlEditor = this.form.get('expressionEditor');
    const controlInput = this.form.get('expressionInput');

    controlEditor.setValue(controlInput.getRawValue());
  }
}
