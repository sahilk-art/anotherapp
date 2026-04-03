export interface IResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: any;
  errors?: any;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
