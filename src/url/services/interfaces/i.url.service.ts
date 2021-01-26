import { IUrl } from "../../models/url.model";
import { UrlDTO } from "../../dtos/url.dto";

interface IUrlService {
  getFullUrl(shorUrl: string): Promise<IUrl>;
  createShortUrl(url: UrlDTO): Promise<IUrl>;
}

export { IUrlService };
