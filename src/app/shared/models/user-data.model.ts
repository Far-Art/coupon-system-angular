import {SignupData} from '../../auth/auth.service';


export interface UserData extends Omit<SignupData, 'password'> {
  couponsInWish: number[];
  couponsInCart: number[];
  couponsBought: number[];
}