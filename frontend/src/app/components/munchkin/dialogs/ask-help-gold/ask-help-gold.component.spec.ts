import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskHelpGoldComponent } from './ask-help-gold.component';

describe('AskHelpGoldComponent', () => {
  let component: AskHelpGoldComponent;
  let fixture: ComponentFixture<AskHelpGoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskHelpGoldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AskHelpGoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
