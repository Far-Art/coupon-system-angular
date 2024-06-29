import {SignupData} from '../../auth/auth.service';
import {FirebaseResponseModel} from '../../auth/models/firebase-response.model';
import {Themes} from '../services/theme.service';


export interface UserData extends Omit<SignupData, 'password'> {
  couponsInWish: string[];
  couponsInCart: string[];
  couponsPurchased: string[];
  authData: Omit<FirebaseResponseModel, 'email'>
  preferredTheme: Themes
}