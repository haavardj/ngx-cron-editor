import { ComponentFixture, TestBed } from '@angular/core/testing';
import {CronGenComponent} from './cron-editor.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CronEditorModule} from './cron-editor.module';

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
