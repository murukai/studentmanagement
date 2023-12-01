import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GuardianDetailComponent } from './guardian-detail.component';

describe('Guardian Management Detail Component', () => {
  let comp: GuardianDetailComponent;
  let fixture: ComponentFixture<GuardianDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuardianDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ guardian: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GuardianDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GuardianDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load guardian on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.guardian).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
