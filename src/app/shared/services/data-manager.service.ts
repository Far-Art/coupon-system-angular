import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserData} from '../models/user-data.model';
import {FirebaseResponseModel} from '../../auth/models/firebase-response.model';


@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  constructor(private http: HttpClient) { }

  fetchUserData(id: string): Observable<UserData> {
    return this.http.get<UserData>(`https://couponsasartng-default-rtdb.firebaseio.com/users/${id}.json`);
  }

  putUserData(id: string, data: UserData): Observable<FirebaseResponseModel> {
    return this.http.put<FirebaseResponseModel>(`https://couponsasartng-default-rtdb.firebaseio.com/users/${id}.json`, data);
  }

}
