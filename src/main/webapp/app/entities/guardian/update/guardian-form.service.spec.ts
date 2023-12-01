import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../guardian.test-samples';

import { GuardianFormService } from './guardian-form.service';

describe('Guardian Form Service', () => {
  let service: GuardianFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardianFormService);
  });

  describe('Service methods', () => {
    describe('createGuardianFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGuardianFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            gender: expect.any(Object),
            profession: expect.any(Object),
            students: expect.any(Object),
          })
        );
      });

      it('passing IGuardian should create a new form with FormGroup', () => {
        const formGroup = service.createGuardianFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            gender: expect.any(Object),
            profession: expect.any(Object),
            students: expect.any(Object),
          })
        );
      });
    });

    describe('getGuardian', () => {
      it('should return NewGuardian for default Guardian initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGuardianFormGroup(sampleWithNewData);

        const guardian = service.getGuardian(formGroup) as any;

        expect(guardian).toMatchObject(sampleWithNewData);
      });

      it('should return NewGuardian for empty Guardian initial value', () => {
        const formGroup = service.createGuardianFormGroup();

        const guardian = service.getGuardian(formGroup) as any;

        expect(guardian).toMatchObject({});
      });

      it('should return IGuardian', () => {
        const formGroup = service.createGuardianFormGroup(sampleWithRequiredData);

        const guardian = service.getGuardian(formGroup) as any;

        expect(guardian).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGuardian should not enable id FormControl', () => {
        const formGroup = service.createGuardianFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGuardian should disable id FormControl', () => {
        const formGroup = service.createGuardianFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
