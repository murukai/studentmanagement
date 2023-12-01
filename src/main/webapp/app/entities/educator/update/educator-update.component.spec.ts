import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EducatorFormService } from './educator-form.service';
import { EducatorService } from '../service/educator.service';
import { IEducator } from '../educator.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGrade } from 'app/entities/grade/grade.model';
import { GradeService } from 'app/entities/grade/service/grade.service';

import { EducatorUpdateComponent } from './educator-update.component';

describe('Educator Management Update Component', () => {
  let comp: EducatorUpdateComponent;
  let fixture: ComponentFixture<EducatorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let educatorFormService: EducatorFormService;
  let educatorService: EducatorService;
  let userService: UserService;
  let gradeService: GradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EducatorUpdateComponent],
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
      .overrideTemplate(EducatorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EducatorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    educatorFormService = TestBed.inject(EducatorFormService);
    educatorService = TestBed.inject(EducatorService);
    userService = TestBed.inject(UserService);
    gradeService = TestBed.inject(GradeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const educator: IEducator = { id: 456 };
      const user: IUser = { id: 24570 };
      educator.user = user;

      const userCollection: IUser[] = [{ id: 46107 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ educator });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Grade query and add missing value', () => {
      const educator: IEducator = { id: 456 };
      const grades: IGrade[] = [{ id: 51187 }];
      educator.grades = grades;

      const gradeCollection: IGrade[] = [{ id: 3599 }];
      jest.spyOn(gradeService, 'query').mockReturnValue(of(new HttpResponse({ body: gradeCollection })));
      const additionalGrades = [...grades];
      const expectedCollection: IGrade[] = [...additionalGrades, ...gradeCollection];
      jest.spyOn(gradeService, 'addGradeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ educator });
      comp.ngOnInit();

      expect(gradeService.query).toHaveBeenCalled();
      expect(gradeService.addGradeToCollectionIfMissing).toHaveBeenCalledWith(
        gradeCollection,
        ...additionalGrades.map(expect.objectContaining)
      );
      expect(comp.gradesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const educator: IEducator = { id: 456 };
      const user: IUser = { id: 69281 };
      educator.user = user;
      const grade: IGrade = { id: 22109 };
      educator.grades = [grade];

      activatedRoute.data = of({ educator });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.gradesSharedCollection).toContain(grade);
      expect(comp.educator).toEqual(educator);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducator>>();
      const educator = { id: 123 };
      jest.spyOn(educatorFormService, 'getEducator').mockReturnValue(educator);
      jest.spyOn(educatorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: educator }));
      saveSubject.complete();

      // THEN
      expect(educatorFormService.getEducator).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(educatorService.update).toHaveBeenCalledWith(expect.objectContaining(educator));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducator>>();
      const educator = { id: 123 };
      jest.spyOn(educatorFormService, 'getEducator').mockReturnValue({ id: null });
      jest.spyOn(educatorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educator: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: educator }));
      saveSubject.complete();

      // THEN
      expect(educatorFormService.getEducator).toHaveBeenCalled();
      expect(educatorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducator>>();
      const educator = { id: 123 };
      jest.spyOn(educatorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(educatorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGrade', () => {
      it('Should forward to gradeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(gradeService, 'compareGrade');
        comp.compareGrade(entity, entity2);
        expect(gradeService.compareGrade).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
