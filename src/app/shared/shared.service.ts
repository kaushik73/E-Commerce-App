import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProductModel } from '../models/Productmodel';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  showSubNavbar: boolean = true;
  isUserLogin = new BehaviorSubject<string>('0');
  userName = new BehaviorSubject<string>('');
  userId = new BehaviorSubject<string>('');
  searchItem = new BehaviorSubject<string>('');
  imageThumbnail = new BehaviorSubject<string>('');
  setUserData(userName: string, isUserLogin: string, userId: string): void {
    if (isUserLogin === '1') {
      localStorage.setItem('isUserLogin', '1');
      this.isUserLogin.next(isUserLogin);
    } else {
      localStorage.setItem('isUserLogin', '0');
      this.isUserLogin.next(isUserLogin);
    }
    localStorage.setItem('userName', userName);
    this.userName.next(userName);
    localStorage.setItem('userId', userId);
    this.userId.next(userId);
  }
  // setIsUserLogin(isLogin: string) {
  //   this.isUserLogin.next(isLogin);
  //   localStorage.setItem('isUserLogin', '1');
  // }
}
