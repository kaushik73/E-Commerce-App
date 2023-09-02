export interface UserModel {
  id: number;
  userId : string
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  isAdmin?:boolean
}
