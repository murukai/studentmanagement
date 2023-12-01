import { IGrade, NewGrade } from './grade.model';

export const sampleWithRequiredData: IGrade = {
  id: 2061,
  name: 'Fish connecting',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IGrade = {
  id: 66696,
  name: 'withdrawal',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IGrade = {
  id: 11986,
  name: 'Ball Human Streamlined',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewGrade = {
  name: 'CSS hack',
  description: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
