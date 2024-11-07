import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedesSociaisFormComponent } from './redes-sociais-form.component';

describe('RedesSociaisFormComponent', () => {
  let component: RedesSociaisFormComponent;
  let fixture: ComponentFixture<RedesSociaisFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedesSociaisFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedesSociaisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
