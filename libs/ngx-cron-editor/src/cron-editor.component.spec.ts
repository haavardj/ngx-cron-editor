import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CronGenComponent } from './cron-editor.component';
import { CronEditorModule } from './cron-editor.module';
import { CronOptions, DefaultOptions } from './CronOptions';

describe('CronGenComponent', () => {
  let component: CronGenComponent;
  let fixture: ComponentFixture<CronGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronEditorModule, NoopAnimationsModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  template: '<cron-editor [formControl]="cron"></cron-editor>',
  imports: [CronEditorModule, ReactiveFormsModule],
})
class HostComponent {
  cron = new FormControl<string | null>(null);
}

describe('CronGenComponent in a form (standard flavor)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function selectedTabLabel(): string {
    const tab: HTMLElement = fixture.nativeElement.querySelector('[role="tab"][aria-selected="true"]');
    return tab?.textContent?.trim() ?? '';
  }

  function load(expression: string) {
    host.cron.setValue(expression);
    fixture.detectChanges();
    tick(100); // valueChanges is debounced by 50 ms
    fixture.detectChanges();
    tick(500); // tab change animation
    fixture.detectChanges();
  }

  const cases: [string, string][] = [
    ['0/5 * 1/1 * *', 'Minutely'],
    ['30 0/2 1/1 * *', 'Hourly'],
    ['30 10 1/3 * *', 'Daily'],
    ['30 10 * * MON-FRI', 'Daily'],
    ['30 10 * * MON,WED', 'Weekly'],
    ['30 10 15 1/2 *', 'Monthly'],
    ['30 10 * 1/2 TUE#2', 'Monthly'],
    ['30 10 15 6 *', 'Yearly'],
    ['1 2 3 4 5', 'Advanced'],
  ];

  for (const [expression, tab] of cases) {
    it(`selects the ${tab} tab and round-trips "${expression}"`, fakeAsync(() => {
      load(expression);
      expect(selectedTabLabel()).toBe(tab);
      expect(host.cron.value).toBe(expression);
    }));
  }

  it('emits a new expression when the user switches tab', fakeAsync(() => {
    load('30 10 15 6 *');
    const tabs: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
    tabs.find(t => t.textContent?.trim() === 'Daily')!.click();
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();

    expect(selectedTabLabel()).toBe('Daily');
    expect(host.cron.value).toMatch(/^30 10 1\/\d+ \* \*$/);
  }));

  // The host is OnPush (the Angular 22 default). The editor must mark itself for
  // check when a later value changes the tab, or the tab group never sees it.
  it('switches tab for a later value inside an OnPush parent', fakeAsync(() => {
    load('0/5 * 1/1 * *');
    expect(selectedTabLabel()).toBe('Minutely');
    load('1 2 3 4 5');
    expect(selectedTabLabel()).toBe('Advanced');
  }));

  it('defaults the Daily tab to "Every N day(s)" when there is no value', fakeAsync(() => {
    const tabs: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
    tabs.find(t => t.textContent?.trim() === 'Daily')!.click();
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();

    const checked: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('mat-radio-button.mat-mdc-radio-checked'));
    expect(checked.length).toBe(1);
    expect(checked[0].textContent).toContain('Day(s)');
  }));
});

@Component({
  template: '<cron-editor [formControl]="cron" [options]="options"></cron-editor>',
  imports: [CronEditorModule, ReactiveFormsModule],
})
class QuartzHostComponent {
  options: CronOptions = {...new DefaultOptions(), cronFlavor: 'quartz'};
  cron = new FormControl<string | null>('3 5 1 ? * MON-FRI *');
}

describe('CronGenComponent with an initial value (quartz flavor)', () => {
  // Issue #35: the Daily tab showed "Every N day(s)" selected for a MON-FRI expression.
  it('checks the "Week Day (MON-FRI)" radio for an initial MON-FRI expression', fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuartzHostComponent, NoopAnimationsModule],
    });
    const fixture = TestBed.createComponent(QuartzHostComponent);
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();

    const tab: HTMLElement = fixture.nativeElement.querySelector('[role="tab"][aria-selected="true"]');
    expect(tab.textContent?.trim()).toBe('Daily');

    const checked: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('mat-radio-button.mat-mdc-radio-checked'));
    expect(checked.length).toBe(1);
    expect(checked[0].textContent).toContain('Week Day (MON-FRI)');
    expect(fixture.componentInstance.cron.value).toBe('3 5 1 ? * MON-FRI *');
  }));
});
