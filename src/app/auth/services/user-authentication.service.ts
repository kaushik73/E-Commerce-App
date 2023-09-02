import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../../models/UserModel';
import { HttpServiceService } from 'src/app/shared/http-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthenticationService {
  constructor(private httpClientService: HttpServiceService) {}
  getUser(userUniqueId: number): Observable<Object> {
    return this.httpClientService.getData(`${userUniqueId}.json`);
  }
  getUsers(): Observable<Object> {
    return this.httpClientService.getData(`user-data.json`);
  }
  addUser(user: UserModel): Observable<Object> {
    return this.httpClientService.sendData('user-data.json', user);
  }
}
