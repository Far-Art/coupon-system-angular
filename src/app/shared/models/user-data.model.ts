import {SignupData} from '../../auth/auth.service';
import {FirebaseResponseModel} from '../../auth/models/firebase-response.model';


export interface UserData extends Omit<SignupData, 'password'> {
  couponsInWish: number[];
  couponsInCart: number[];
  couponsPurchased: number[];
  authData: Omit<FirebaseResponseModel, 'email'>
}