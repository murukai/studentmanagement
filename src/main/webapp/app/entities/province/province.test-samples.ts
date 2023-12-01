import { IProvince, NewProvince } from './province.model';

export const sampleWithRequiredData: IProvince = {
  id: 16991,
  provinceName: 'models repurpose',
};

export const sampleWithPartialData: IProvince = {
  id: 11666,
  provinceName: 'program JBOD Salad',
};

export const sampleWithFullData: IProvince = {
  id: 14482,
  provinceName: 'compress',
};

export const sampleWithNewData: NewProvince = {
  provinceName: 'Philippines Fantastic',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
