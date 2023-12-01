import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GradeFormService } from './grade-form.service';
import { GradeService } from '../service/grade.service';
import { IGrade } from '../grade.model';

import { GradeUpdateComponent } from './grade-update.component';

describe('Grade Management Update Component', () => {
  let comp: GradeUpdateComponent;
  let fixture: ComponentFixture<GradeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gradeFormService: GradeFormService;
  let gradeService: GradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GradeUpdateComponent],
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
      .overrideTemplate(GradeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GradeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gradeFormService = TestBed.inject(GradeFormService);
    gradeService = TestBed.inject(GradeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grade: IGrade = { id: 456 };

      activatedRoute.data = of({ grade });
      comp.ngOnInit();

      expect(comp.grade).toEqual(grade);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrade>>();
      const grade = { id: 123 };
      jest.spyOn(gradeFormService, 'getGrade').mockReturnValue(grade);
      jest.spyOn(gradeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grade }));
      saveSubject.complete();

      // THEN
      expect(gradeFormService.getGrade).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gradeService.update).toHaveBeenCalledWith(expect.objectContaining(grade));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrade>>();
      const grade = { id: 123 };
      jest.spyOn(gradeFormService, 'getGrade').mockReturnValue({ id: null });
      jest.spyOn(gradeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grade: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grade }));
      saveSubject.complete();

      // THEN
      expect(gradeFormService.getGrade).toHaveBeenCalled();
      expect(gradeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrade>>();
      const grade = { id: 123 };
      jest.spyOn(gradeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gradeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
