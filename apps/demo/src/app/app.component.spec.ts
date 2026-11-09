import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import { AppComponent } from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppModule} from './app.module';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, NoopAnimationsModule],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Issue #35, through the demo UI: Quartz flavor, MON-FRI expression, "Update Editor".
  it('shows Daily / Week Day (MON-FRI) after loading a quartz MON-FRI expression', fakeAsync(() => {
    // Create the demo inside fakeAsync so the editor's debounce timer runs on fake time.
    fixture.destroy();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const el: HTMLElement = fixture.nativeElement;
    const settle = () => { fixture.detectChanges(); tick(600); fixture.detectChanges(); };
    settle();

    // Pick "Quartz" in the Flavor select.
    (el.querySelector('mat-select') as HTMLElement).click();
    settle();
    const quartz = Array.from(document.querySelectorAll('mat-option'))
      .find(o => o.textContent?.trim() === 'Quartz') as HTMLElement;
    quartz.click();
    settle();
    expect(component.cronOptions.cronFlavor).toBe('quartz');

    // Type the expression and press "Update Editor".
    const input = el.querySelector('input[formcontrolname="expressionInput"]') as HTMLInputElement;
    input.value = '3 5 1 ? * MON-FRI *';
    input.dispatchEvent(new Event('input'));
    (Array.from(el.querySelectorAll('button')).find(b => b.textContent?.includes('Update Editor')) as HTMLElement).click();
    settle();

    const tab = el.querySelector('[role="tab"][aria-selected="true"]') as HTMLElement;
    expect(tab.textContent?.trim()).toBe('Daily');
    const checked = el.querySelector('mat-radio-button.mat-mdc-radio-checked') as HTMLElement;
    expect(checked.textContent).toContain('Week Day (MON-FRI)');
  }));

});
