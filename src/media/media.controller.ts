import { Request, Response } from "express";
import fs from "fs";
import _ from "lodash";
import mime from "mime-types";

import { ResponseDTO } from "../core/dtos/response.dto";
import STATUSCODE from "../constants/statuscode.constant";

class MediaController {
  public async uploadImage(req: Request, res: Response): Promise<Response> {
    const image = req.file;
    try {
      console.log(req.user.username);

      const mediaController = new MediaController();
      const urlImage = await mediaController.saveImage(image);
      return ResponseDTO.createSuccessResponse(
        res,
        STATUSCODE.SUCCESS,
        urlImage
      );
    } catch (error) {
      console.log(error);
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error
      );
    }
  }

  private async saveImage(image: any): Promise<string> {
    try {
      const extension = mime.extension(image.mimetype);
      const accessExtension = ["jpeg", "jpg", "png"];
      if (_.indexOf(accessExtension, extension) === -1) {
        throw new Error("Invalid file");
      }
      fs.renameSync(image.path, `${image.path}.${extension}`);
      const fileName = `${image.filename}.${extension}`;
      const urlImage = `${process.env.URL_MEDIA}api/v1/image/${fileName}`;
      return urlImage;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getImage(req: Request, res: Response): Promise<void | Response> {
    const imageName = req.params.image;
    try {
      const fullfilePath = `uploads/${imageName}`;
      const pathImage = `${process.cwd()}/${fullfilePath}`;
      return ResponseDTO.createSuccessResponseFile(
        res,
        STATUSCODE.SUCCESS,
        pathImage
      );
      // return res.sendFile(pathImage);
    } catch (error) {
      console.log(error);
      return ResponseDTO.createErrorResponse(
        res,
        STATUSCODE.SERVER_ERROR,
        error
      );
    }
  }
}

export { MediaController };
