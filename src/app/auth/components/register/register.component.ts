import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserModel } from 'src/app/models/UserModel';
import { UserAuthenticationService } from 'src/app/auth/services/user-authentication.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { map, timer } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public showMessage: boolean = false;
  public showConfirmPassword: boolean = false;
  public showPassword: boolean = false;
  public eyeIconPassword: string = 'fa fa-eye';
  public eyeIconConfirmPassword: string = 'fa fa-eye';
  public passwordType: string = 'password';
  public confirmPasswordType: string = 'password';
  public usersArray!: UserModel[];
  public password: string = '';
  public confirmPassword: string = '';
  public registerUserForm!: FormGroup;
  public UserObject!: UserModel;

  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthenticationService,
    private sharedService: SharedService,
    private router: Router,
    private toaster: NgToastService
  ) {}
  ngOnInit(): void {
    this.registerUserForm = this.formBuilder.group(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        contactNumber: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('[0-9 ]{10}'),
        ]),
        password: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ])
        ),
        confirmPassword: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ])
        ),
        isAdmin: new FormControl(false),
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
    this.sharedService.showSubNavbar = false;
    this.getUsers();
  }
  private passwordMatchValidator(
    registerUserForm: FormGroup
  ): { mismatch: boolean } | null {
    return registerUserForm.get('password')?.value ===
      registerUserForm.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }
  public togglePassword() {
    if (this.passwordType == 'password') {
      this.passwordType = 'text';
      this.eyeIconPassword = 'fa fa-eye-slash';
    } else {
      this.passwordType = 'password';
      this.eyeIconPassword = 'fa fa-eye';
    }
  }
  public toggleConfirmPassword() {
    if (this.confirmPasswordType == 'password') {
      this.confirmPasswordType = 'text';
      this.eyeIconConfirmPassword = 'fa fa-eye-slash';
    } else {
      this.confirmPasswordType = 'password';
      this.eyeIconConfirmPassword = 'fa fa-eye';
    }
  }
  public getUsers(): any {
    this.userAuthService
      .getUsers()
      .pipe(
        map((user: any) => {
          this.usersArray = user;
          const users = [];
          for (const key in user) {
            users.push({ ...user[key], id: key });
            this.usersArray = users;
          }
        })
      )
      .subscribe();
  }
  public addUserToFirebase(): void {
    let isEmailExist = 0;
    for (let i in this.usersArray) {
      if (this.usersArray[i].email === this.registerUserForm.value.email) {
        isEmailExist = 1;
        this.toaster.warning({
          detail: 'User Already Exist!',
          duration: 3000,
        });
        return;
      }
    }
    if (this.registerUserForm.invalid) {
      this.toaster.warning({
        detail: 'Something Went Wrong!',
        summary: 'Please Try Later',
        duration: 3000,
      });
    }
    if (isEmailExist === 0 && !this.registerUserForm.invalid) {
      this.userAuthService
        .addUser(this.registerUserForm.value)
        .subscribe(() => {
          this.toaster.success({
            detail: 'User Registered Succesfully!!',
            summary: '',
            duration: 3000,
          });
        });
      this.router.navigate(['/auth/login']);
    }
  }
  ngOnDestroy(): void {
    this.sharedService.showSubNavbar = true;
  }
}
