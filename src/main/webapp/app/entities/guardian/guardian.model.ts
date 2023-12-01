import { IStudent } from 'app/entities/student/student.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IGuardian {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  gender?: Gender | null;
  profession?: string | null;
  students?: Pick<IStudent, 'id' | 'lastName'>[] | null;
}

export type NewGuardian = Omit<IGuardian, 'id'> & { id: null };
