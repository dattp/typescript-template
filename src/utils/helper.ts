import sha1 from "sha1";
import md5 from "md5";
import moment from "moment";

class Helper {
  public static createSalt(): string {
    let salt = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 8; i++) {
      salt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return salt;
  }

  public static validatePassword(
    passwordInput: string,
    passwordUser: string,
    salt: string
  ): boolean {
    if (!passwordInput || !passwordUser || !salt) return false;
    return passwordUser === sha1(md5(passwordInput) + salt);
  }

  public static hashPassword(password: string, salt: string): string {
    return sha1(md5(password) + salt);
  }

  public static convertStringToDate(dateString: string): Date | null {
    if (!dateString) return null;
    const dateNow = moment(dateString).format("YYYY-MM-DD");
    return new Date(dateNow);
  }
}

export { Helper };
