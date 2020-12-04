import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutletPage } from './outlet.page';

describe('OutletPage', () => {
  let component: OutletPage;
  let fixture: ComponentFixture<OutletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
