import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StudentFormService } from './student-form.service';
import { StudentService } from '../service/student.service';
import { IStudent } from '../student.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGuardian } from 'app/entities/guardian/guardian.model';
import { GuardianService } from 'app/entities/guardian/service/guardian.service';
import { IGrade } from 'app/entities/grade/grade.model';
import { GradeService } from 'app/entities/grade/service/grade.service';

import { StudentUpdateComponent } from './student-update.component';

describe('Student Management Update Component', () => {
  let comp: StudentUpdateComponent;
  let fixture: ComponentFixture<StudentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentFormService: StudentFormService;
  let studentService: StudentService;
  let userService: UserService;
  let guardianService: GuardianService;
  let gradeService: GradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StudentUpdateComponent],
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
      .overrideTemplate(StudentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentFormService = TestBed.inject(StudentFormService);
    studentService = TestBed.inject(StudentService);
    userService = TestBed.inject(UserService);
    guardianService = TestBed.inject(GuardianService);
    gradeService = TestBed.inject(GradeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const user: IUser = { id: 33190 };
      student.user = user;

      const userCollection: IUser[] = [{ id: 41907 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Guardian query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const guardians: IGuardian[] = [{ id: 1152 }];
      student.guardians = guardians;

      const guardianCollection: IGuardian[] = [{ id: 53880 }];
      jest.spyOn(guardianService, 'query').mockReturnValue(of(new HttpResponse({ body: guardianCollection })));
      const additionalGuardians = [...guardians];
      const expectedCollection: IGuardian[] = [...additionalGuardians, ...guardianCollection];
      jest.spyOn(guardianService, 'addGuardianToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(guardianService.query).toHaveBeenCalled();
      expect(guardianService.addGuardianToCollectionIfMissing).toHaveBeenCalledWith(
        guardianCollection,
        ...additionalGuardians.map(expect.objectContaining)
      );
      expect(comp.guardiansSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Grade query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const grade: IGrade = { id: 59798 };
      student.grade = grade;

      const gradeCollection: IGrade[] = [{ id: 44313 }];
      jest.spyOn(gradeService, 'query').mockReturnValue(of(new HttpResponse({ body: gradeCollection })));
      const additionalGrades = [grade];
      const expectedCollection: IGrade[] = [...additionalGrades, ...gradeCollection];
      jest.spyOn(gradeService, 'addGradeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(gradeService.query).toHaveBeenCalled();
      expect(gradeService.addGradeToCollectionIfMissing).toHaveBeenCalledWith(
        gradeCollection,
        ...additionalGrades.map(expect.objectContaining)
      );
      expect(comp.gradesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const student: IStudent = { id: 456 };
      const user: IUser = { id: 24126 };
      student.user = user;
      const guardians: IGuardian = { id: 41875 };
      student.guardians = [guardians];
      const grade: IGrade = { id: 37857 };
      student.grade = grade;

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.guardiansSharedCollection).toContain(guardians);
      expect(comp.gradesSharedCollection).toContain(grade);
      expect(comp.student).toEqual(student);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentFormService, 'getStudent').mockReturnValue(student);
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentFormService.getStudent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentService.update).toHaveBeenCalledWith(expect.objectContaining(student));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentFormService, 'getStudent').mockReturnValue({ id: null });
      jest.spyOn(studentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentFormService.getStudent).toHaveBeenCalled();
      expect(studentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentService.update).toHaveBeenCalled();
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

    describe('compareGuardian', () => {
      it('Should forward to guardianService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(guardianService, 'compareGuardian');
        comp.compareGuardian(entity, entity2);
        expect(guardianService.compareGuardian).toHaveBeenCalledWith(entity, entity2);
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
