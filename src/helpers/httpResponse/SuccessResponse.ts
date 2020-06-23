class SuccessResponse {
  success: boolean;

  message: string;

  data: any;

  constructor(data: any, message: string) {
    this.message = message;
    this.success = true;
    this.data = data;
  }
}

export default SuccessResponse;
