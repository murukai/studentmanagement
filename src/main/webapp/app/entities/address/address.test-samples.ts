import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 88754,
  streetAddress: 'Bulgarian application Avon',
  suburb: 'Court parsing bleeding-edge',
  city: 'Bertrandmouth',
  zipCode: '78454-0254',
  phone: '409-882-2102',
};

export const sampleWithPartialData: IAddress = {
  id: 28809,
  streetAddress: 'Unbranded Handcrafted',
  suburb: 'FTP',
  city: 'Cheektowaga',
  zipCode: '48703-5917',
  phone: '973.486.2549',
};

export const sampleWithFullData: IAddress = {
  id: 83372,
  streetAddress: 'bus',
  suburb: 'Handmade',
  city: 'South Geraldine',
  zipCode: '86356-4657',
  phone: '1-743-839-7386 x493',
};

export const sampleWithNewData: NewAddress = {
  streetAddress: 'Games',
  suburb: 'microchip Territories',
  city: 'New Allenehaven',
  zipCode: '54127',
  phone: '271-893-3040',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
