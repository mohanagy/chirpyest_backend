class SuccessResponse {
  message?: string;

  data?: any;

  constructor(data?: any, message?: string) {
    this.message = message;
    this.data = data;
  }
}

export default SuccessResponse;
