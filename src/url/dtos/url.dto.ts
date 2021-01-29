import { IsNotEmpty, IsString } from "class-validator";

import { IUrl } from "../models/url.model";

class UrlDTO {
  private id: string;

  @IsNotEmpty({
    message: "full url is not empty",
  })
  @IsString()
  private full_url: string;

  @IsNotEmpty({
    message: "short url is not empty",
  })
  @IsString()
  private short_url: string;

  @IsNotEmpty({
    message: "username url is not empty",
  })
  @IsString()
  private username: string;

  @IsNotEmpty({
    message: "token url is not empty",
  })
  @IsString()
  private token: string;

  constructor() {
    this.id = "";
    this.full_url = "";
    this.short_url = "";
    this.username = "";
    this.token = "";
  }

  public toUrl(url: IUrl): UrlDTO {
    const urlDTO = new UrlDTO();
    urlDTO.id = url._id;
    urlDTO.full_url = url.full_url;
    urlDTO.short_url = process.env.BASE_URL + url.short_url;
    urlDTO.username = url.username;
    urlDTO.token = url.token;
    return urlDTO;
  }

  public createUrlDTO(
    fullUrl: string,
    shortUrl: string,
    username: string,
    token: string
  ): UrlDTO {
    const urlDTO = new UrlDTO();
    urlDTO.id = "";
    urlDTO.full_url = fullUrl;
    urlDTO.short_url = shortUrl;
    urlDTO.username = username;
    urlDTO.token = token;
    return urlDTO;
  }

  //getter and setter
  getId(): string {
    return this.id;
  }
  setId(id: string): void {
    this.id = id;
  }

  getFullUrl(): string {
    return this.full_url;
  }
  setFullUrl(fullUrl: string): void {
    this.full_url = fullUrl;
  }

  getShortUrl(): string {
    return this.short_url;
  }
  setShortUrl(shortUrl: string): void {
    this.short_url = shortUrl;
  }
}

export { UrlDTO };
