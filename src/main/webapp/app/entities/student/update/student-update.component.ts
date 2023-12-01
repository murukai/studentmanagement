import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { StudentFormService, StudentFormGroup } from './student-form.service';
import { IStudent } from '../student.model';
import { StudentService } from '../service/student.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGuardian } from 'app/entities/guardian/guardian.model';
import { GuardianService } from 'app/entities/guardian/service/guardian.service';
import { IGrade } from 'app/entities/grade/grade.model';
import { GradeService } from 'app/entities/grade/service/grade.service';
import { Gender } from 'app/entities/enumerations/gender.model';

@Component({
  selector: 'jhi-student-update',
  templateUrl: './student-update.component.html',
})
export class StudentUpdateComponent implements OnInit {
  isSaving = false;
  student: IStudent | null = null;
  genderValues = Object.keys(Gender);

  usersSharedCollection: IUser[] = [];
  guardiansSharedCollection: IGuardian[] = [];
  gradesSharedCollection: IGrade[] = [];

  editForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();

  constructor(
    protected studentService: StudentService,
    protected studentFormService: StudentFormService,
    protected userService: UserService,
    protected guardianService: GuardianService,
    protected gradeService: GradeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareGuardian = (o1: IGuardian | null, o2: IGuardian | null): boolean => this.guardianService.compareGuardian(o1, o2);

  compareGrade = (o1: IGrade | null, o2: IGrade | null): boolean => this.gradeService.compareGrade(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.student = student;
      if (student) {
        this.updateForm(student);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const student = this.studentFormService.getStudent(this.editForm);
    if (student.id !== null) {
      this.subscribeToSaveResponse(this.studentService.update(student));
    } else {
      this.subscribeToSaveResponse(this.studentService.create(student));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(student: IStudent): void {
    this.student = student;
    this.studentFormService.resetForm(this.editForm, student);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, student.user);
    this.guardiansSharedCollection = this.guardianService.addGuardianToCollectionIfMissing<IGuardian>(
      this.guardiansSharedCollection,
      ...(student.guardians ?? [])
    );
    this.gradesSharedCollection = this.gradeService.addGradeToCollectionIfMissing<IGrade>(this.gradesSharedCollection, student.grade);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.student?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.guardianService
      .query()
      .pipe(map((res: HttpResponse<IGuardian[]>) => res.body ?? []))
      .pipe(
        map((guardians: IGuardian[]) =>
          this.guardianService.addGuardianToCollectionIfMissing<IGuardian>(guardians, ...(this.student?.guardians ?? []))
        )
      )
      .subscribe((guardians: IGuardian[]) => (this.guardiansSharedCollection = guardians));

    this.gradeService
      .query()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grades: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing<IGrade>(grades, this.student?.grade)))
      .subscribe((grades: IGrade[]) => (this.gradesSharedCollection = grades));
  }
}
