import { Response } from "express";

class ResponseDTO {
  private data: any;
  private statusCode: any;
  private error: any;
  // private static res: Response;

  // constructor() { }

  public static createResponse(
    statusCode: number,
    error: any,
    data: any
  ): ResponseDTO {
    const responseFormat = new ResponseDTO();
    responseFormat.statusCode = statusCode;
    responseFormat.error = error;
    responseFormat.data = data;
    return responseFormat;
  }

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

  public static createSuccessResponseFile(
    res: Response,
    statusCode = 200,
    data: any
  ): void {
    return res.status(statusCode).sendFile(data);
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

  public static isSuccess(reponse: ResponseDTO): boolean {
    return reponse.statusCode >= 200 && reponse.statusCode < 400;
  }

  public static getStatusCode(reponse: ResponseDTO): number {
    return reponse.statusCode;
  }

  public static getError(reponse: ResponseDTO): any {
    return reponse.error;
  }

  public static getData(reponse: ResponseDTO): any {
    return reponse.data;
  }
}

export { ResponseDTO };
