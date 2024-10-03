import { OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import * as i0 from "@angular/core";
export interface TimePickerModel {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
export declare class TimePickerComponent implements OnInit {
    parent: ControlContainer;
    disabled: boolean;
    use24HourTime: boolean;
    hideHours: boolean;
    hideMinutes: boolean;
    hideSeconds: boolean;
    allForm: FormGroup;
    minutes: string[];
    seconds: string[];
    hourTypes: string[];
    get hours(): string[];
    constructor(parent: ControlContainer);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimePickerComponent, "cron-time-picker", never, { "disabled": { "alias": "disabled"; "required": false; }; "use24HourTime": { "alias": "use24HourTime"; "required": false; }; "hideHours": { "alias": "hideHours"; "required": false; }; "hideMinutes": { "alias": "hideMinutes"; "required": false; }; "hideSeconds": { "alias": "hideSeconds"; "required": false; }; }, {}, never, never, false, never>;
}
