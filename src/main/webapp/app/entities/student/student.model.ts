import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IGuardian } from 'app/entities/guardian/guardian.model';
import { IGrade } from 'app/entities/grade/grade.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IStudent {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  middleNames?: string | null;
  gender?: Gender | null;
  dateOfBirth?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  guardians?: Pick<IGuardian, 'id' | 'lastName'>[] | null;
  grade?: Pick<IGrade, 'id' | 'name'> | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
