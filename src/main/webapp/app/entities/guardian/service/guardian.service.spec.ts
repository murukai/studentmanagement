import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGuardian } from '../guardian.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../guardian.test-samples';

import { GuardianService } from './guardian.service';

const requireRestSample: IGuardian = {
  ...sampleWithRequiredData,
};

describe('Guardian Service', () => {
  let service: GuardianService;
  let httpMock: HttpTestingController;
  let expectedResult: IGuardian | IGuardian[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GuardianService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Guardian', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const guardian = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(guardian).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Guardian', () => {
      const guardian = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(guardian).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Guardian', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Guardian', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Guardian', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGuardianToCollectionIfMissing', () => {
      it('should add a Guardian to an empty array', () => {
        const guardian: IGuardian = sampleWithRequiredData;
        expectedResult = service.addGuardianToCollectionIfMissing([], guardian);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(guardian);
      });

      it('should not add a Guardian to an array that contains it', () => {
        const guardian: IGuardian = sampleWithRequiredData;
        const guardianCollection: IGuardian[] = [
          {
            ...guardian,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGuardianToCollectionIfMissing(guardianCollection, guardian);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Guardian to an array that doesn't contain it", () => {
        const guardian: IGuardian = sampleWithRequiredData;
        const guardianCollection: IGuardian[] = [sampleWithPartialData];
        expectedResult = service.addGuardianToCollectionIfMissing(guardianCollection, guardian);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(guardian);
      });

      it('should add only unique Guardian to an array', () => {
        const guardianArray: IGuardian[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const guardianCollection: IGuardian[] = [sampleWithRequiredData];
        expectedResult = service.addGuardianToCollectionIfMissing(guardianCollection, ...guardianArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const guardian: IGuardian = sampleWithRequiredData;
        const guardian2: IGuardian = sampleWithPartialData;
        expectedResult = service.addGuardianToCollectionIfMissing([], guardian, guardian2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(guardian);
        expect(expectedResult).toContain(guardian2);
      });

      it('should accept null and undefined values', () => {
        const guardian: IGuardian = sampleWithRequiredData;
        expectedResult = service.addGuardianToCollectionIfMissing([], null, guardian, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(guardian);
      });

      it('should return initial array if no Guardian is added', () => {
        const guardianCollection: IGuardian[] = [sampleWithRequiredData];
        expectedResult = service.addGuardianToCollectionIfMissing(guardianCollection, undefined, null);
        expect(expectedResult).toEqual(guardianCollection);
      });
    });

    describe('compareGuardian', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGuardian(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGuardian(entity1, entity2);
        const compareResult2 = service.compareGuardian(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGuardian(entity1, entity2);
        const compareResult2 = service.compareGuardian(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGuardian(entity1, entity2);
        const compareResult2 = service.compareGuardian(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
