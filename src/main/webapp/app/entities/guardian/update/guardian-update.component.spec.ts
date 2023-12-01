import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GuardianFormService } from './guardian-form.service';
import { GuardianService } from '../service/guardian.service';
import { IGuardian } from '../guardian.model';

import { GuardianUpdateComponent } from './guardian-update.component';

describe('Guardian Management Update Component', () => {
  let comp: GuardianUpdateComponent;
  let fixture: ComponentFixture<GuardianUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let guardianFormService: GuardianFormService;
  let guardianService: GuardianService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GuardianUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GuardianUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GuardianUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    guardianFormService = TestBed.inject(GuardianFormService);
    guardianService = TestBed.inject(GuardianService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const guardian: IGuardian = { id: 456 };

      activatedRoute.data = of({ guardian });
      comp.ngOnInit();

      expect(comp.guardian).toEqual(guardian);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGuardian>>();
      const guardian = { id: 123 };
      jest.spyOn(guardianFormService, 'getGuardian').mockReturnValue(guardian);
      jest.spyOn(guardianService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ guardian });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: guardian }));
      saveSubject.complete();

      // THEN
      expect(guardianFormService.getGuardian).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(guardianService.update).toHaveBeenCalledWith(expect.objectContaining(guardian));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGuardian>>();
      const guardian = { id: 123 };
      jest.spyOn(guardianFormService, 'getGuardian').mockReturnValue({ id: null });
      jest.spyOn(guardianService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ guardian: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: guardian }));
      saveSubject.complete();

      // THEN
      expect(guardianFormService.getGuardian).toHaveBeenCalled();
      expect(guardianService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGuardian>>();
      const guardian = { id: 123 };
      jest.spyOn(guardianService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ guardian });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(guardianService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
