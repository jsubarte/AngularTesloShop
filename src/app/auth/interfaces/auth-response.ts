import { IUser } from '@auth/interfaces/iuser';


export interface IAuthResponse {
  user:  IUser;
  token: string;
}
