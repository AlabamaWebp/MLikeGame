import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpFightComponent } from './help-fight.component';

describe('HelpFightComponent', () => {
  let component: HelpFightComponent;
  let fixture: ComponentFixture<HelpFightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpFightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpFightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
