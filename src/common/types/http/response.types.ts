export class DataResponse<T> {
  data: T;
  message?: string;
  errors?: string;
}