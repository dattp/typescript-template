import { Response } from "express";

class ResponseDTO {
  private data: any;
  private statusCode: any;
  private error: any;
  private static res: Response;

  // constructor() { }

  public static createSuccessResponse(
    res: Response,
    statusCode = 200,
    data: any
  ): Response {
    const responseFormat = new ResponseDTO();
    responseFormat.statusCode = statusCode;
    responseFormat.data = data;
    responseFormat.error = null;
    return res.status(statusCode).send(responseFormat);
  }

  public static createErrorResponse(
    res: Response,
    statusCode = 400,
    error: any
  ): Response {
    const responseFormat = new ResponseDTO();
    responseFormat.statusCode = statusCode;
    responseFormat.data = null;
    responseFormat.error = error;
    return res.status(statusCode).send(responseFormat);
  }

  isSuccess(): boolean {
    return this.statusCode >= 200 && this.statusCode < 400;
  }
}

export { ResponseDTO };
