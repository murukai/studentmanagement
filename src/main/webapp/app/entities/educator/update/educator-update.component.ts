import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EducatorFormService, EducatorFormGroup } from './educator-form.service';
import { IEducator } from '../educator.model';
import { EducatorService } from '../service/educator.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGrade } from 'app/entities/grade/grade.model';
import { GradeService } from 'app/entities/grade/service/grade.service';
import { Gender } from 'app/entities/enumerations/gender.model';

@Component({
  selector: 'jhi-educator-update',
  templateUrl: './educator-update.component.html',
})
export class EducatorUpdateComponent implements OnInit {
  isSaving = false;
  educator: IEducator | null = null;
  genderValues = Object.keys(Gender);

  usersSharedCollection: IUser[] = [];
  gradesSharedCollection: IGrade[] = [];

  editForm: EducatorFormGroup = this.educatorFormService.createEducatorFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected educatorService: EducatorService,
    protected educatorFormService: EducatorFormService,
    protected userService: UserService,
    protected gradeService: GradeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareGrade = (o1: IGrade | null, o2: IGrade | null): boolean => this.gradeService.compareGrade(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ educator }) => {
      this.educator = educator;
      if (educator) {
        this.updateForm(educator);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('studentmanagementApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const educator = this.educatorFormService.getEducator(this.editForm);
    if (educator.id !== null) {
      this.subscribeToSaveResponse(this.educatorService.update(educator));
    } else {
      this.subscribeToSaveResponse(this.educatorService.create(educator));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEducator>>): void {
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

  protected updateForm(educator: IEducator): void {
    this.educator = educator;
    this.educatorFormService.resetForm(this.editForm, educator);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, educator.user);
    this.gradesSharedCollection = this.gradeService.addGradeToCollectionIfMissing<IGrade>(
      this.gradesSharedCollection,
      ...(educator.grades ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.educator?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.gradeService
      .query()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grades: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing<IGrade>(grades, ...(this.educator?.grades ?? []))))
      .subscribe((grades: IGrade[]) => (this.gradesSharedCollection = grades));
  }
}
