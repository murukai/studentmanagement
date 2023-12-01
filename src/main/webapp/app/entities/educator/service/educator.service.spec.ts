import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEducator } from '../educator.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../educator.test-samples';

import { EducatorService } from './educator.service';

const requireRestSample: IEducator = {
  ...sampleWithRequiredData,
};

describe('Educator Service', () => {
  let service: EducatorService;
  let httpMock: HttpTestingController;
  let expectedResult: IEducator | IEducator[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EducatorService);
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

    it('should create a Educator', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const educator = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(educator).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Educator', () => {
      const educator = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(educator).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Educator', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Educator', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Educator', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEducatorToCollectionIfMissing', () => {
      it('should add a Educator to an empty array', () => {
        const educator: IEducator = sampleWithRequiredData;
        expectedResult = service.addEducatorToCollectionIfMissing([], educator);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(educator);
      });

      it('should not add a Educator to an array that contains it', () => {
        const educator: IEducator = sampleWithRequiredData;
        const educatorCollection: IEducator[] = [
          {
            ...educator,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEducatorToCollectionIfMissing(educatorCollection, educator);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Educator to an array that doesn't contain it", () => {
        const educator: IEducator = sampleWithRequiredData;
        const educatorCollection: IEducator[] = [sampleWithPartialData];
        expectedResult = service.addEducatorToCollectionIfMissing(educatorCollection, educator);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(educator);
      });

      it('should add only unique Educator to an array', () => {
        const educatorArray: IEducator[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const educatorCollection: IEducator[] = [sampleWithRequiredData];
        expectedResult = service.addEducatorToCollectionIfMissing(educatorCollection, ...educatorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const educator: IEducator = sampleWithRequiredData;
        const educator2: IEducator = sampleWithPartialData;
        expectedResult = service.addEducatorToCollectionIfMissing([], educator, educator2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(educator);
        expect(expectedResult).toContain(educator2);
      });

      it('should accept null and undefined values', () => {
        const educator: IEducator = sampleWithRequiredData;
        expectedResult = service.addEducatorToCollectionIfMissing([], null, educator, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(educator);
      });

      it('should return initial array if no Educator is added', () => {
        const educatorCollection: IEducator[] = [sampleWithRequiredData];
        expectedResult = service.addEducatorToCollectionIfMissing(educatorCollection, undefined, null);
        expect(expectedResult).toEqual(educatorCollection);
      });
    });

    describe('compareEducator', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEducator(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEducator(entity1, entity2);
        const compareResult2 = service.compareEducator(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEducator(entity1, entity2);
        const compareResult2 = service.compareEducator(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEducator(entity1, entity2);
        const compareResult2 = service.compareEducator(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
