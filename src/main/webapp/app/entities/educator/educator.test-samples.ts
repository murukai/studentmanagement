import { Gender } from 'app/entities/enumerations/gender.model';

import { IEducator, NewEducator } from './educator.model';

export const sampleWithRequiredData: IEducator = {
  id: 49679,
  firstName: 'Lonzo',
  lastName: 'Morissette',
  gender: Gender['FEMALE'],
  email: 'Jasen.Skiles90@yahoo.com',
};

export const sampleWithPartialData: IEducator = {
  id: 10552,
  firstName: 'Kailey',
  lastName: 'Kuhn',
  gender: Gender['MALE'],
  email: 'Sunny_Fadel18@yahoo.com',
};

export const sampleWithFullData: IEducator = {
  id: 9352,
  firstName: 'Jeromy',
  lastName: 'Zemlak',
  gender: Gender['MALE'],
  profileImage: '../fake-data/blob/hipster.png',
  profileImageContentType: 'unknown',
  email: 'Raymundo.Russel34@yahoo.com',
};

export const sampleWithNewData: NewEducator = {
  firstName: 'Rosanna',
  lastName: 'Spinka',
  gender: Gender['FEMALE'],
  email: 'Sammy1@hotmail.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
