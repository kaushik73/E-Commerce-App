import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firebaseLink } from '../../environment';
@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  constructor(private httpClient: HttpClient) {}
  updateData(url: string, body: any): Observable<Object> {
    return this.httpClient.put(`${firebaseLink}${url}`, body);
  }
  getData(url: string): Observable<Object> {
    return this.httpClient.get(`${firebaseLink}${url}`);
  }
  sendData(url: string, body: any): Observable<Object> {
    return this.httpClient.post(`${firebaseLink}${url}`, body);
  }
}
