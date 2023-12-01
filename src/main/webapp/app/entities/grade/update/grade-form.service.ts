import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGrade, NewGrade } from '../grade.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGrade for edit and NewGradeFormGroupInput for create.
 */
type GradeFormGroupInput = IGrade | PartialWithRequiredKeyOf<NewGrade>;

type GradeFormDefaults = Pick<NewGrade, 'id' | 'educators'>;

type GradeFormGroupContent = {
  id: FormControl<IGrade['id'] | NewGrade['id']>;
  name: FormControl<IGrade['name']>;
  description: FormControl<IGrade['description']>;
  educators: FormControl<IGrade['educators']>;
};

export type GradeFormGroup = FormGroup<GradeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GradeFormService {
  createGradeFormGroup(grade: GradeFormGroupInput = { id: null }): GradeFormGroup {
    const gradeRawValue = {
      ...this.getFormDefaults(),
      ...grade,
    };
    return new FormGroup<GradeFormGroupContent>({
      id: new FormControl(
        { value: gradeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(gradeRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(gradeRawValue.description, {
        validators: [Validators.required],
      }),
      educators: new FormControl(gradeRawValue.educators ?? []),
    });
  }

  getGrade(form: GradeFormGroup): IGrade | NewGrade {
    return form.getRawValue() as IGrade | NewGrade;
  }

  resetForm(form: GradeFormGroup, grade: GradeFormGroupInput): void {
    const gradeRawValue = { ...this.getFormDefaults(), ...grade };
    form.reset(
      {
        ...gradeRawValue,
        id: { value: gradeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GradeFormDefaults {
    return {
      id: null,
      educators: [],
    };
  }
}
