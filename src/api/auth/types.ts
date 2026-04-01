export interface ILoginForm {
  phone: string;
  password: string;
}
export interface ILoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  }
}
