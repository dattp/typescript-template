import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import shortid from "shortid";

import { IUrlController } from "./interfaces/i.url.controller";
import { ResponseDTO } from "../../core/dtos/response.dto";
import STATUSCODE from "../../constants/statuscode.constant";
import { ResponseMessage } from "../../constants/message.constants";
import { IUrlService } from "../services/interfaces/i.url.service";
import { UrlDTO } from "../dtos/url.dto";

class UrlController implements IUrlController {
  private static urlService: IUrlService;
  private static urlDTO: UrlDTO;

  constructor(service: IUrlService) {
    UrlController.urlService = service;
    UrlController.urlDTO = new UrlDTO();
  }

  public async getFullUrlByShortUrl(
    req: Request,
    res: Response
  ): Promise<Response> {
    const shortUrl = req.params.short_url as string;
    try {
      const url = await UrlController.urlService.getFullUrl(shortUrl);
      if (!url) {
        return ResponseDTO.createErrorResponse(
          res,
          STATUSCODE.NOT_FOUND,
          ResponseMessage.NOT_FOUND
        );
      }
      res.writeHead(301, {
        Location: url.full_url,
      });
      res.end();
      return res;
    } catch (error) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error.message
      );
    }
  }

  public async createUrl(req: Request, res: Response): Promise<Response> {
    try {
      const fullUrl: string = req.query.full_url as string;
      const shortUrlObj = await UrlController.createShortUrlCtl(fullUrl);
      if (ResponseDTO.isSuccess(shortUrlObj)) {
        return ResponseDTO.createSuccessResponse(
          res,
          ResponseDTO.getStatusCode(shortUrlObj),
          ResponseDTO.getData(shortUrlObj)
        );
      }
      return ResponseDTO.createErrorResponse(
        res,
        ResponseDTO.getStatusCode(shortUrlObj),
        ResponseDTO.getError(shortUrlObj)
      );
    } catch (error) {
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error.message
      );
    }
  }

  public static async createShortUrlCtl(fullUrl: string): Promise<ResponseDTO> {
    try {
      if (!fullUrl) {
        return ResponseDTO.createResponse(
          STATUSCODE.NOT_FOUND,
          ResponseMessage.MISSING_PARAM,
          null
        );
      }
      let urlDTO: UrlDTO;
      try {
        const shorUrl: string = shortid.generate();
        urlDTO = UrlController.urlDTO.createUrlDTO(fullUrl, shorUrl);
        await validateOrReject(urlDTO);
      } catch (error) {
        return ResponseDTO.createResponse(
          STATUSCODE.NOT_FOUND,
          ResponseMessage.NOT_FOUND,
          null
        );
      }

      const urlCreate = await UrlController.urlService.createShortUrl(urlDTO);
      if (urlCreate) {
        return ResponseDTO.createResponse(
          STATUSCODE.SUCCESS,
          null,
          UrlController.urlDTO.toUrl(urlCreate)
        );
      }
      return ResponseDTO.createResponse(
        STATUSCODE.NOT_FOUND,
        ResponseMessage.FAIL,
        null
      );
    } catch (error) {
      console.log(error);

      return ResponseDTO.createResponse(
        STATUSCODE.SERVER_ERROR,
        error.message,
        null
      );
    }
  }
}

export { UrlController };
