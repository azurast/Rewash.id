import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutletDetailPage } from './outlet-detail.page';

describe('OutletDetailPage', () => {
  let component: OutletDetailPage;
  let fixture: ComponentFixture<OutletDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutletDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
