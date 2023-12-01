import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GuardianFormService, GuardianFormGroup } from './guardian-form.service';
import { IGuardian } from '../guardian.model';
import { GuardianService } from '../service/guardian.service';
import { Gender } from 'app/entities/enumerations/gender.model';

@Component({
  selector: 'jhi-guardian-update',
  templateUrl: './guardian-update.component.html',
})
export class GuardianUpdateComponent implements OnInit {
  isSaving = false;
  guardian: IGuardian | null = null;
  genderValues = Object.keys(Gender);

  editForm: GuardianFormGroup = this.guardianFormService.createGuardianFormGroup();

  constructor(
    protected guardianService: GuardianService,
    protected guardianFormService: GuardianFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ guardian }) => {
      this.guardian = guardian;
      if (guardian) {
        this.updateForm(guardian);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const guardian = this.guardianFormService.getGuardian(this.editForm);
    if (guardian.id !== null) {
      this.subscribeToSaveResponse(this.guardianService.update(guardian));
    } else {
      this.subscribeToSaveResponse(this.guardianService.create(guardian));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGuardian>>): void {
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

  protected updateForm(guardian: IGuardian): void {
    this.guardian = guardian;
    this.guardianFormService.resetForm(this.editForm, guardian);
  }
}
