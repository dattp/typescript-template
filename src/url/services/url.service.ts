import UrlModel, { IUrl } from "../models/url.model";
import { IUrlService } from "./interfaces/i.url.service";
import { UrlDTO } from "../dtos/url.dto";

class UrlService implements IUrlService {
  public async getlUrl(shortUrl: string): Promise<IUrl | null> {
    try {
      return UrlModel.findOne({ short_url: shortUrl }).lean();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async createShortUrl(urlDto: UrlDTO): Promise<IUrl> {
    try {
      const urlModel = new UrlModel(urlDto);
      return UrlModel.create(urlModel);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export { UrlService };
