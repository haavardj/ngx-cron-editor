import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TimePickerComponent } from './cron-time-picker.component';
import { CronGenComponent } from './cron-editor.component';
import * as i0 from "@angular/core";
export class CronEditorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: CronEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.6", ngImport: i0, type: CronEditorModule, declarations: [TimePickerComponent, CronGenComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatTabsModule,
            MatListModule,
            MatSelectModule,
            MatInputModule,
            MatRadioModule,
            MatCheckboxModule], exports: [TimePickerComponent, CronGenComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: CronEditorModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatTabsModule,
            MatListModule,
            MatSelectModule,
            MatInputModule,
            MatRadioModule,
            MatCheckboxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.6", ngImport: i0, type: CronEditorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        MatTabsModule,
                        MatListModule,
                        MatSelectModule,
                        MatInputModule,
                        MatRadioModule,
                        MatCheckboxModule
                    ],
                    exports: [TimePickerComponent, CronGenComponent],
                    declarations: [TimePickerComponent, CronGenComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvbi1lZGl0b3IubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGlicy9uZ3gtY3Jvbi1lZGl0b3Ivc3JjL2Nyb24tZWRpdG9yLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7QUFpQjNELE1BQU0sT0FBTyxnQkFBZ0I7OEdBQWhCLGdCQUFnQjsrR0FBaEIsZ0JBQWdCLGlCQUZaLG1CQUFtQixFQUFFLGdCQUFnQixhQVg5QyxZQUFZO1lBQ1osV0FBVztZQUNYLG1CQUFtQjtZQUNuQixhQUFhO1lBQ2IsYUFBYTtZQUNiLGVBQWU7WUFDZixjQUFjO1lBQ2QsY0FBYztZQUNkLGlCQUFpQixhQUViLG1CQUFtQixFQUFFLGdCQUFnQjsrR0FHcEMsZ0JBQWdCLFlBYnJCLFlBQVk7WUFDWixXQUFXO1lBQ1gsbUJBQW1CO1lBQ25CLGFBQWE7WUFDYixhQUFhO1lBQ2IsZUFBZTtZQUNmLGNBQWM7WUFDZCxjQUFjO1lBQ2QsaUJBQWlCOzsyRkFLWixnQkFBZ0I7a0JBZjVCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxtQkFBbUI7d0JBQ25CLGFBQWE7d0JBQ2IsYUFBYTt3QkFDYixlQUFlO3dCQUNmLGNBQWM7d0JBQ2QsY0FBYzt3QkFDZCxpQkFBaUI7cUJBQ3BCO29CQUNILE9BQU8sRUFBRSxDQUFDLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDO29CQUNoRCxZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxnQkFBZ0IsQ0FBQztpQkFDdEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0Q2hlY2tib3hNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XG5pbXBvcnQgeyBNYXRJbnB1dE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2lucHV0JztcbmltcG9ydCB7IE1hdExpc3RNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9saXN0JztcbmltcG9ydCB7IE1hdFJhZGlvTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcmFkaW8nO1xuaW1wb3J0IHsgTWF0U2VsZWN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcbmltcG9ydCB7IE1hdFRhYnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90YWJzJztcbmltcG9ydCB7IFRpbWVQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2Nyb24tdGltZS1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENyb25HZW5Db21wb25lbnQgfSBmcm9tICcuL2Nyb24tZWRpdG9yLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgICAgICBNYXRUYWJzTW9kdWxlLFxuICAgICAgICBNYXRMaXN0TW9kdWxlLFxuICAgICAgICBNYXRTZWxlY3RNb2R1bGUsXG4gICAgICAgIE1hdElucHV0TW9kdWxlLFxuICAgICAgICBNYXRSYWRpb01vZHVsZSxcbiAgICAgICAgTWF0Q2hlY2tib3hNb2R1bGVcbiAgICBdLFxuICBleHBvcnRzOiBbVGltZVBpY2tlckNvbXBvbmVudCwgQ3JvbkdlbkNvbXBvbmVudF0sXG4gIGRlY2xhcmF0aW9uczogW1RpbWVQaWNrZXJDb21wb25lbnQsIENyb25HZW5Db21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIENyb25FZGl0b3JNb2R1bGUgeyB9XG4iXX0=