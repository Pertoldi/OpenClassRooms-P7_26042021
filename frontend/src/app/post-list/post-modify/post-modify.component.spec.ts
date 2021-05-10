import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostModifyComponent } from './post-modify.component';

describe('PostModifyComponent', () => {
  let component: PostModifyComponent;
  let fixture: ComponentFixture<PostModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
