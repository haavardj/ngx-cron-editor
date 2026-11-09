import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CronGenComponent } from './cron-editor.component';
import { CronEditorModule } from './cron-editor.module';

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
});
