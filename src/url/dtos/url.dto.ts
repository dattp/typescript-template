import { IsNotEmpty, IsString } from "class-validator";

import { IUrl } from "../models/url.model";

class UrlDTO {
  private id: string;

  @IsNotEmpty({
    message: "long url is not empty",
  })
  @IsString()
  private full_url: string;

  @IsString()
  private short_url: string;

  constructor() {
    this.id = "";
    this.full_url = "";
    this.short_url = "";
  }

  public toUrl(url: IUrl): UrlDTO {
    const urlDTO = new UrlDTO();
    urlDTO.id = url._id;
    urlDTO.full_url = url.full_url;
    urlDTO.short_url = process.env.BASE_URL + url.short_url;
    return urlDTO;
  }

  public createUrlDTO(fullUrl: string, shortUrl: string): UrlDTO {
    const urlDTO = new UrlDTO();
    urlDTO.full_url = fullUrl;
    urlDTO.short_url = shortUrl;
    return urlDTO;
  }

  //getter and setter
  getId(): string {
    return this.id;
  }
  getFullUrl(): string {
    return this.full_url;
  }
  getShort(): string {
    return this.short_url;
  }
}

export { UrlDTO };
