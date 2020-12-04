import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputItemsPage } from './input-items.page';

describe('InputItemsPage', () => {
  let component: InputItemsPage;
  let fixture: ComponentFixture<InputItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputItemsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
