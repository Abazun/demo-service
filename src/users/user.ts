export interface UserResponse {
  id: number;
  firstName: string;
  email: string;
  password?: string;
  emailVerifiedAt?: Date;
  accountStatus: string;
}

// TODO - really not using this anywhere
export interface  UserInfo {
  firstName: string;
  lastName?: string;
  emailVerifiedAt?: Date;
  accountStatus: 'active' | 'inactive';
}
