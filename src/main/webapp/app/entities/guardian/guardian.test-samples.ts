import { Gender } from 'app/entities/enumerations/gender.model';

import { IGuardian, NewGuardian } from './guardian.model';

export const sampleWithRequiredData: IGuardian = {
  id: 12340,
  firstName: 'Billy',
  lastName: 'Hudson',
  gender: Gender['MALE'],
};

export const sampleWithPartialData: IGuardian = {
  id: 1571,
  firstName: 'Twila',
  lastName: 'Harris',
  gender: Gender['FEMALE'],
  profession: 'Lempira Ball Berkshire',
};

export const sampleWithFullData: IGuardian = {
  id: 37380,
  firstName: 'Oma',
  lastName: 'Crist',
  gender: Gender['MALE'],
  profession: 'maroon end-to-end Pizza',
};

export const sampleWithNewData: NewGuardian = {
  firstName: 'Eddie',
  lastName: 'Bauch',
  gender: Gender['MALE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
