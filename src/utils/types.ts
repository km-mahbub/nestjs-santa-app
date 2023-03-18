export type ErrorResponse = {
  statusCode: number;
  message: string;
  errors?: any;
};

export type OkResponse = {
  statusCode: number;
  data: any;
};
