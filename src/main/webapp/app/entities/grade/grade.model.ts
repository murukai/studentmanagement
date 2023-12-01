import { IEducator } from 'app/entities/educator/educator.model';

export interface IGrade {
  id: number;
  name?: string | null;
  description?: string | null;
  educators?: Pick<IEducator, 'id'>[] | null;
}

export type NewGrade = Omit<IGrade, 'id'> & { id: null };
