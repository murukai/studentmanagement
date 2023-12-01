import { IUser } from 'app/entities/user/user.model';
import { IGrade } from 'app/entities/grade/grade.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IEducator {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  gender?: Gender | null;
  profileImage?: string | null;
  profileImageContentType?: string | null;
  email?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  grades?: Pick<IGrade, 'id'>[] | null;
}

export type NewEducator = Omit<IEducator, 'id'> & { id: null };
