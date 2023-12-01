export interface IProvince {
  id: number;
  provinceName?: string | null;
}

export type NewProvince = Omit<IProvince, 'id'> & { id: null };
