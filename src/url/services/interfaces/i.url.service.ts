import { IUrl } from "../../models/url.model";
import { UrlDTO } from "../../dtos/url.dto";

interface IUrlService {
  getlUrl(shorUrl: string): Promise<IUrl | null>;
  createShortUrl(url: UrlDTO): Promise<IUrl>;
}

export { IUrlService };
