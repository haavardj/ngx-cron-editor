﻿import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroup} from '@angular/forms';

export interface TimePickerModel {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

@Component({
  selector: 'cron-time-picker',
  templateUrl: './cron-time-picker.template.html',
  providers: []
})
export class TimePickerComponent implements OnInit {
  @Input() public disabled = false;
  @Input() public use24HourTime = true;
  @Input() public hideHours = false;
  @Input() public hideMinutes = false;
  @Input() public hideSeconds = true;

  allForm: FormGroup;

  public minutes =  [...range(0, 59) ].map(String);
  public seconds = [...range(0, 59) ].map(String);
  public hourTypes = ['AM', 'PM'];

  get hours(): string[] {
    return this.use24HourTime ? [... range(0, 23)].map(String) : [... range(0, 12)].map(String);
  }

  constructor(public parent: ControlContainer) {}

  ngOnInit(): void {
    this.allForm = this.parent.control as FormGroup;
  }
}


