import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEducator, NewEducator } from '../educator.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEducator for edit and NewEducatorFormGroupInput for create.
 */
type EducatorFormGroupInput = IEducator | PartialWithRequiredKeyOf<NewEducator>;

type EducatorFormDefaults = Pick<NewEducator, 'id' | 'grades'>;

type EducatorFormGroupContent = {
  id: FormControl<IEducator['id'] | NewEducator['id']>;
  firstName: FormControl<IEducator['firstName']>;
  lastName: FormControl<IEducator['lastName']>;
  gender: FormControl<IEducator['gender']>;
  profileImage: FormControl<IEducator['profileImage']>;
  profileImageContentType: FormControl<IEducator['profileImageContentType']>;
  email: FormControl<IEducator['email']>;
  user: FormControl<IEducator['user']>;
  grades: FormControl<IEducator['grades']>;
};

export type EducatorFormGroup = FormGroup<EducatorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EducatorFormService {
  createEducatorFormGroup(educator: EducatorFormGroupInput = { id: null }): EducatorFormGroup {
    const educatorRawValue = {
      ...this.getFormDefaults(),
      ...educator,
    };
    return new FormGroup<EducatorFormGroupContent>({
      id: new FormControl(
        { value: educatorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(educatorRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(educatorRawValue.lastName, {
        validators: [Validators.required],
      }),
      gender: new FormControl(educatorRawValue.gender, {
        validators: [Validators.required],
      }),
      profileImage: new FormControl(educatorRawValue.profileImage),
      profileImageContentType: new FormControl(educatorRawValue.profileImageContentType),
      email: new FormControl(educatorRawValue.email, {
        validators: [Validators.required],
      }),
      user: new FormControl(educatorRawValue.user, {
        validators: [Validators.required],
      }),
      grades: new FormControl(educatorRawValue.grades ?? []),
    });
  }

  getEducator(form: EducatorFormGroup): IEducator | NewEducator {
    return form.getRawValue() as IEducator | NewEducator;
  }

  resetForm(form: EducatorFormGroup, educator: EducatorFormGroupInput): void {
    const educatorRawValue = { ...this.getFormDefaults(), ...educator };
    form.reset(
      {
        ...educatorRawValue,
        id: { value: educatorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EducatorFormDefaults {
    return {
      id: null,
      grades: [],
    };
  }
}
