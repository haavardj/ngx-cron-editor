import { Component } from '@angular/core';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
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
    // '15' has no step, so the Daily step stays at its default of 1 (was '1/0').
    expect(host.cron.value).toBe('30 10 1/1 * *');
  }));

  function clickTab(label: string) {
    const tabs: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
    tabs.find(t => t.textContent?.trim() === label)!.click();
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();
  }

  // Without a value, every tab must emit a usable expression: no step of 0,
  // no day-of-month 0 and no month 0.
  const defaults: [string, string][] = [
    ['Minutely', '0/1 * 1/1 * *'],
    ['Hourly', '0 0/1 1/1 * *'],
    ['Daily', '0 0 1/1 * *'],
    ['Monthly', '0 0 1 1/1 *'],
    ['Yearly', '0 0 1 1 *'],
  ];
  for (const [tab, expected] of defaults) {
    it(`emits "${expected}" from the ${tab} tab when there is no value`, fakeAsync(() => {
      if (tab === 'Minutely') {
        clickTab('Hourly'); // Minutely is already selected; clicking it changes nothing
      }
      clickTab(tab);
      expect(host.cron.value).toBe(expected);
    }));
  }

  it('does not offer 0 as a minute step', () => {
    const ed = fixture.debugElement.children[0].componentInstance as CronGenComponent;
    expect(ed.selectOptions.minutes[0]).toBe('1');
    expect(ed.selectOptions.minutes).not.toContain('0');
  });

  it('keeps a parsed step when switching back to its tab', fakeAsync(() => {
    load('0/15 * 1/1 * *');
    clickTab('Hourly');
    clickTab('Minutely');
    expect(host.cron.value).toBe('0/15 * 1/1 * *');
  }));

  it('is valid for an expression with the right segment count', fakeAsync(() => {
    load('30 10 * * MON-FRI');
    expect(host.cron.valid).toBeTrue();
    expect(host.cron.errors).toBeNull();
  }));

  it('reports cronSegments instead of throwing for a wrong segment count', fakeAsync(() => {
    load('0/5 * 1/1 * *');
    expect(() => load('3 5 1 ? * MON-FRI *')).not.toThrow();

    expect(host.cron.value).toBe('3 5 1 ? * MON-FRI *');
    expect(host.cron.valid).toBeFalse();
    expect(host.cron.getError('cronSegments')).toEqual({flavor: 'standard', expected: [5], actual: 7});

    // The expression is shown in the Advanced tab so the user can correct it.
    expect(selectedTabLabel()).toBe('Advanced');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input.advanced-cron-editor-input');
    expect(input.value).toBe('3 5 1 ? * MON-FRI *');
  }));

  // The host is OnPush (the Angular 22 default). The editor must mark itself for
  // check when a later value changes the tab, or the tab group never sees it.
  it('switches tab for a later value inside an OnPush parent', fakeAsync(() => {
    load('0/5 * 1/1 * *');
    expect(selectedTabLabel()).toBe('Minutely');
    load('1 2 3 4 5');
    expect(selectedTabLabel()).toBe('Advanced');
  }));

  it('becomes valid again when the user corrects the expression', fakeAsync(() => {
    load('3 5 1 ? * MON-FRI *');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input.advanced-cron-editor-input');
    input.value = '5 1 * * MON-FRI';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(100);

    expect(host.cron.value).toBe('5 1 * * MON-FRI');
    expect(host.cron.valid).toBeTrue();
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

  it('revalidates when the flavor is changed in place', fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuartzHostComponent, NoopAnimationsModule],
    });
    const fixture = TestBed.createComponent(QuartzHostComponent);
    const host = fixture.componentInstance;
    fixture.detectChanges();
    tick(600);
    expect(host.cron.valid).toBeTrue();

    host.options.cronFlavor = 'standard';
    fixture.detectChanges();
    flushMicrotasks();
    expect(host.cron.getError('cronSegments')).toEqual({flavor: 'standard', expected: [5], actual: 7});

    host.options.cronFlavor = 'quartz';
    fixture.detectChanges();
    flushMicrotasks();
    expect(host.cron.valid).toBeTrue();
    discardPeriodicTasks();
  }));

  it('does not throw for an invalid initial value', fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuartzHostComponent, NoopAnimationsModule],
    });
    const fixture = TestBed.createComponent(QuartzHostComponent);
    fixture.componentInstance.cron.setValue('1 2 3');
    expect(() => { fixture.detectChanges(); tick(600); fixture.detectChanges(); }).not.toThrow();
    expect(fixture.componentInstance.cron.getError('cronSegments')).toEqual({flavor: 'quartz', expected: [6, 7], actual: 3});
  }));

  it('keeps the current tab when the Advanced tab is hidden', fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuartzHostComponent, NoopAnimationsModule],
    });
    const fixture = TestBed.createComponent(QuartzHostComponent);
    const host = fixture.componentInstance;
    host.options = {...host.options, hideAdvancedTab: true};
    // Let the initial render, its tab change and the resulting recompute finish.
    for (let i = 0; i < 2; i++) {
      fixture.detectChanges();
      tick(600);
    }
    fixture.detectChanges();

    host.cron.setValue('1 2 3');
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();

    const tab: HTMLElement = fixture.nativeElement.querySelector('[role="tab"][aria-selected="true"]');
    expect(tab.textContent?.trim()).toBe('Daily');
    expect(host.cron.value).toBe('1 2 3');
    expect(host.cron.hasError('cronSegments')).toBeTrue();
  }));
});
