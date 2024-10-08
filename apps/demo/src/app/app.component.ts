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
  public cronExpression = '0/3 * 1/1 * *';
  public cronOptions = new DefaultOptions();


  @ViewChild('cronEditorDemo1')
  cronEditorDemo1: CronGenComponent | undefined;

  @ViewChild('cronEditorDemo2')
  cronEditorDemo2: CronGenComponent | undefined;

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

    if (!controlInput) {
      return
    }

    if (!controlEditor) {
      return
    }

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

    if (this.cronEditorDemo1) {
      this.cronEditorDemo1.options = this.cronOptions;
    }

    if (this.cronEditorDemo2) {
      this.cronEditorDemo2.options = this.cronOptions;
    }



  }
}
