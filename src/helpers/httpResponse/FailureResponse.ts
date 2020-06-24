class FailureResponse {
  success: boolean;

  message: string;

  constructor(message: string) {
    this.success = false;
    this.message = message;
  }
}

export default FailureResponse;
