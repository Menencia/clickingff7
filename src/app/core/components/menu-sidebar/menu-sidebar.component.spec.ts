import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSidebarComponent } from './menu-sidebar.component';

describe('MenuSidebarComponent', () => {
  let component: MenuSidebarComponent;
  let fixture: ComponentFixture<MenuSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
