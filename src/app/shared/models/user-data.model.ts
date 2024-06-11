import {SignupData} from '../../auth/auth.service';


export type UserData = {
  couponsInWish: number[];
  couponsInCart: number[];
  couponsBought: number[];
} & Exclude<SignupData, {
  password: string
}>