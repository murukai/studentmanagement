import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: 4746,
  countryName: 'SCSI Configuration deposit',
};

export const sampleWithPartialData: ICountry = {
  id: 24965,
  countryName: 'payment',
};

export const sampleWithFullData: ICountry = {
  id: 42559,
  countryName: '1080p Concrete',
};

export const sampleWithNewData: NewCountry = {
  countryName: 'Denmark',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
