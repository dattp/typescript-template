import { v4 as uuidv4 } from "uuid";

import UrlModel, { IUrl } from "../models/url.model";
import { IUrlService } from "./interfaces/i.url.service";
import { UrlDTO } from "../dtos/url.dto";

class UrlService implements IUrlService {
  public async getFullUrl(shortUrl: string): Promise<IUrl> {
    try {
      return UrlModel.findOne({ short_url: shortUrl }).lean();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async createShortUrl(urlDto: UrlDTO): Promise<IUrl> {
    try {
      return UrlModel.create(urlDto);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export { UrlService };
