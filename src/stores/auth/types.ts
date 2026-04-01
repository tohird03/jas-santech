export type SignInParamsType = {
  username: string;
  password: string;
};

export type TokenType = {
  accessToken: string;
};

export type StaffInfoType = {
  id: number;
  roleId: number;
  firstName: string;
  lastName: string;
  userId: number;
  social: string;
  phoneNumber: string;
  createdAt: string;
  status: number;
  password: string;
  photo: string;
  login: string;
  aboutMe: string;
};

export interface ISignInResponse extends TokenType {
  studentInfo: string | null;
  staffInfo: StaffInfoType;
}
