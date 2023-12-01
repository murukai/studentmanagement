import dayjs from 'dayjs/esm';

import { Gender } from 'app/entities/enumerations/gender.model';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 23105,
  firstName: 'Rowan',
  lastName: 'Parker',
  gender: Gender['MALE'],
  dateOfBirth: dayjs('2023-11-30'),
};

export const sampleWithPartialData: IStudent = {
  id: 45307,
  firstName: 'Emilie',
  lastName: 'Walker',
  middleNames: 'world-class PCI',
  gender: Gender['FEMALE'],
  dateOfBirth: dayjs('2023-12-01'),
};

export const sampleWithFullData: IStudent = {
  id: 33985,
  firstName: 'Arlene',
  lastName: 'Runolfsdottir',
  middleNames: 'Ngultrum Comoros Hawaii',
  gender: Gender['MALE'],
  dateOfBirth: dayjs('2023-12-01'),
};

export const sampleWithNewData: NewStudent = {
  firstName: 'Isom',
  lastName: 'McKenzie',
  gender: Gender['FEMALE'],
  dateOfBirth: dayjs('2023-12-01'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
