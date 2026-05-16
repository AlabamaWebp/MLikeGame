import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunchkinComponent } from './munchkin.component';

describe('MunchkinComponent', () => {
  let component: MunchkinComponent;
  let fixture: ComponentFixture<MunchkinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunchkinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MunchkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
