import { ICountry } from 'app/entities/country/country.model';
import { IProvince } from 'app/entities/province/province.model';

export interface IAddress {
  id: number;
  streetAddress?: string | null;
  suburb?: string | null;
  city?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  country?: Pick<ICountry, 'id'> | null;
  province?: Pick<IProvince, 'id'> | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
