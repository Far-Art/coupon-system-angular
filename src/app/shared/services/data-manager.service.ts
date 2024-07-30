import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserData} from '../models/user-data.model';


@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  constructor(private http: HttpClient) { }

  fetchUserData(id: string): Observable<UserData> {
    return this.http.get<UserData>(`https://couponsasartng-default-rtdb.firebaseio.com/users/${id}.json`);
  }

  putUserData(id: string, data: Omit<Partial<UserData>, 'authData'>): Observable<UserData> {
    return this.http.put<UserData>(`https://couponsasartng-default-rtdb.firebaseio.com/users/${id}.json`, data);
  }

  putComment(id: string, data: Object): Observable<UserData> {
    return this.http.put<UserData>(`https://couponsasartng-default-rtdb.firebaseio.com/comments/${id}.json`, data);
  }

}
