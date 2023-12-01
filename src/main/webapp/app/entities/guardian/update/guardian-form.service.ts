import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGuardian, NewGuardian } from '../guardian.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGuardian for edit and NewGuardianFormGroupInput for create.
 */
type GuardianFormGroupInput = IGuardian | PartialWithRequiredKeyOf<NewGuardian>;

type GuardianFormDefaults = Pick<NewGuardian, 'id' | 'students'>;

type GuardianFormGroupContent = {
  id: FormControl<IGuardian['id'] | NewGuardian['id']>;
  firstName: FormControl<IGuardian['firstName']>;
  lastName: FormControl<IGuardian['lastName']>;
  gender: FormControl<IGuardian['gender']>;
  profession: FormControl<IGuardian['profession']>;
  students: FormControl<IGuardian['students']>;
};

export type GuardianFormGroup = FormGroup<GuardianFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GuardianFormService {
  createGuardianFormGroup(guardian: GuardianFormGroupInput = { id: null }): GuardianFormGroup {
    const guardianRawValue = {
      ...this.getFormDefaults(),
      ...guardian,
    };
    return new FormGroup<GuardianFormGroupContent>({
      id: new FormControl(
        { value: guardianRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(guardianRawValue.firstName, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      lastName: new FormControl(guardianRawValue.lastName, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      gender: new FormControl(guardianRawValue.gender, {
        validators: [Validators.required],
      }),
      profession: new FormControl(guardianRawValue.profession),
      students: new FormControl(guardianRawValue.students ?? []),
    });
  }

  getGuardian(form: GuardianFormGroup): IGuardian | NewGuardian {
    return form.getRawValue() as IGuardian | NewGuardian;
  }

  resetForm(form: GuardianFormGroup, guardian: GuardianFormGroupInput): void {
    const guardianRawValue = { ...this.getFormDefaults(), ...guardian };
    form.reset(
      {
        ...guardianRawValue,
        id: { value: guardianRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GuardianFormDefaults {
    return {
      id: null,
      students: [],
    };
  }
}
