export interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}
