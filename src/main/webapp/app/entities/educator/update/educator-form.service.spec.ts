import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../educator.test-samples';

import { EducatorFormService } from './educator-form.service';

describe('Educator Form Service', () => {
  let service: EducatorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducatorFormService);
  });

  describe('Service methods', () => {
    describe('createEducatorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEducatorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            gender: expect.any(Object),
            profileImage: expect.any(Object),
            email: expect.any(Object),
            user: expect.any(Object),
            grades: expect.any(Object),
          })
        );
      });

      it('passing IEducator should create a new form with FormGroup', () => {
        const formGroup = service.createEducatorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            gender: expect.any(Object),
            profileImage: expect.any(Object),
            email: expect.any(Object),
            user: expect.any(Object),
            grades: expect.any(Object),
          })
        );
      });
    });

    describe('getEducator', () => {
      it('should return NewEducator for default Educator initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEducatorFormGroup(sampleWithNewData);

        const educator = service.getEducator(formGroup) as any;

        expect(educator).toMatchObject(sampleWithNewData);
      });

      it('should return NewEducator for empty Educator initial value', () => {
        const formGroup = service.createEducatorFormGroup();

        const educator = service.getEducator(formGroup) as any;

        expect(educator).toMatchObject({});
      });

      it('should return IEducator', () => {
        const formGroup = service.createEducatorFormGroup(sampleWithRequiredData);

        const educator = service.getEducator(formGroup) as any;

        expect(educator).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEducator should not enable id FormControl', () => {
        const formGroup = service.createEducatorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEducator should disable id FormControl', () => {
        const formGroup = service.createEducatorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
