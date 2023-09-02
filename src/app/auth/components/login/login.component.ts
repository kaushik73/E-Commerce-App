import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, timer } from 'rxjs';
import { UserModel } from 'src/app/models/UserModel';
import { SharedService } from 'src/app/shared/shared.service';
import { UserAuthenticationService } from 'src/app/auth/services/user-authentication.service';
import { AdminService } from 'src/app/admin/services/admin.service';
import { OrdersModel } from 'src/app/models/OrdersModel';
import { CartService } from 'src/app/services/cart.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public usersArray!: UserModel[];
  public isValidUser!: string;
  public showPassword: boolean = false;
  public password: string = '';
  public email: string = '';
  public userName: string | null = '';
  public userId: string = '';
  public cartId: string = '';
  public eyeIcon: string = 'fa fa-eye';
  public passwordType: string = 'password';
  public loginUserForm!: FormGroup;
  public userObject!: UserModel;
  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private cartService: CartService,
    private toaster: NgToastService
  ) {}
  ngOnInit(): void {
    this.createLoginForm();
    this.hideSubNavbar();
    this.getQueryParams();
    if (localStorage.getItem('isAdmin') === '1') {
      this.router.navigate(['/admin']);
    }
    if (localStorage.getItem('isUserLogin') === '1') {
      this.router.navigate(['/']);
    }
  }
  private hideSubNavbar(): void {
    this.sharedService.showSubNavbar = false;
  }
  public loginUserButton(): void {
    this.getUsers();
  }
  public togglePassword() {
    if (this.passwordType == 'password') {
      this.passwordType = 'text';
      this.eyeIcon = 'fa fa-eye-slash';
    } else {
      this.passwordType = 'password';
      this.eyeIcon = 'fa fa-eye';
    }
  }
  private createLoginForm(): void {
    this.loginUserForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ])
      ),
    });
  }
  private getQueryParams(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['isLogin'] != null) {
        this.toaster.warning({
          detail: 'Please Login Before Ordering',
          duration: 2000,
        });
      }
    });
  }

  public getUsers(): void {
    this.userAuthService
      .getUsers()
      .pipe(
        map((user: any) => {
          this.usersArray = user;
          const users = [];
          for (const key in user) {
            users.push({ ...user[key], userId: key });
            this.usersArray = users;
          }
        })
      )
      .subscribe(() => {
        this.validateUser();
      });
  }
  public validateUser(): void {
    this.email = this.loginUserForm.value.email;
    this.password = this.loginUserForm.value.password;
    for (let i in this.usersArray) {
      if (
        this.usersArray[i].isAdmin &&
        this.usersArray[i].email === this.email &&
        this.usersArray[i].password === this.password
      ) {
        localStorage.setItem('isAdmin', '1');
        this.router.navigate(['/admin']);
        return;
      } else {
        if (
          this.usersArray[i].email === this.email &&
          this.usersArray[i].password === this.password &&
          this.usersArray[i].isAdmin !== true
        ) {
          this.sharedService.setUserData(
            this.usersArray[i].name,
            '1',
            this.usersArray[i].userId
          );
          this.userName = localStorage.getItem('userName') || '';
          this.isValidUser = localStorage.getItem('isUserLogin') || '1';
          this.userId = localStorage.getItem('userId') || '';
          this.cartService.getAllOrders();
          timer(1000).subscribe(() => {
            this.router.navigate(['/']);
          });
          localStorage.setItem('isAdmin', '0');
          return;
        } else {
          this.sharedService.setUserData('', '0', '');
          this.isValidUser = localStorage.getItem('isUserLogin') || '0';
        }
      }
    }
    this.sharedService.setUserData('', '0', '');
    this.isValidUser = localStorage.getItem('isUserLogin') || '0';
  }
  public goToRegisterUser(): void {
    this.router.navigate(['/auth/register']);
  }
  ngOnDestroy(): void {
    this.sharedService.showSubNavbar = true;
  }
}
