import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStudent, NewStudent } from '../student.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStudent for edit and NewStudentFormGroupInput for create.
 */
type StudentFormGroupInput = IStudent | PartialWithRequiredKeyOf<NewStudent>;

type StudentFormDefaults = Pick<NewStudent, 'id' | 'guardians'>;

type StudentFormGroupContent = {
  id: FormControl<IStudent['id'] | NewStudent['id']>;
  firstName: FormControl<IStudent['firstName']>;
  lastName: FormControl<IStudent['lastName']>;
  middleNames: FormControl<IStudent['middleNames']>;
  gender: FormControl<IStudent['gender']>;
  dateOfBirth: FormControl<IStudent['dateOfBirth']>;
  user: FormControl<IStudent['user']>;
  guardians: FormControl<IStudent['guardians']>;
  grade: FormControl<IStudent['grade']>;
};

export type StudentFormGroup = FormGroup<StudentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudentFormService {
  createStudentFormGroup(student: StudentFormGroupInput = { id: null }): StudentFormGroup {
    const studentRawValue = {
      ...this.getFormDefaults(),
      ...student,
    };
    return new FormGroup<StudentFormGroupContent>({
      id: new FormControl(
        { value: studentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(studentRawValue.firstName, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      lastName: new FormControl(studentRawValue.lastName, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      middleNames: new FormControl(studentRawValue.middleNames, {
        validators: [Validators.maxLength(100)],
      }),
      gender: new FormControl(studentRawValue.gender, {
        validators: [Validators.required],
      }),
      dateOfBirth: new FormControl(studentRawValue.dateOfBirth, {
        validators: [Validators.required],
      }),
      user: new FormControl(studentRawValue.user, {
        validators: [Validators.required],
      }),
      guardians: new FormControl(studentRawValue.guardians ?? []),
      grade: new FormControl(studentRawValue.grade),
    });
  }

  getStudent(form: StudentFormGroup): IStudent | NewStudent {
    return form.getRawValue() as IStudent | NewStudent;
  }

  resetForm(form: StudentFormGroup, student: StudentFormGroupInput): void {
    const studentRawValue = { ...this.getFormDefaults(), ...student };
    form.reset(
      {
        ...studentRawValue,
        id: { value: studentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StudentFormDefaults {
    return {
      id: null,
      guardians: [],
    };
  }
}
