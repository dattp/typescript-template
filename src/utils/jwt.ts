import jwt from "jsonwebtoken";

export class JWTToken {
  public static async generateToken(
    infoUser: any,
    secretToken: string,
    tokenTime: string
  ): Promise<string | null> {
    if (!infoUser || !secretToken || !tokenTime) {
      throw new Error("missing param to create jwt");
    }
    try {
      const token = await jwt.sign({ data: infoUser }, secretToken, {
        algorithm: "HS256",
        expiresIn: tokenTime,
      });
      return token;
    } catch (error) {
      throw error;
    }
  }

  public static async verifyToken(
    token: string,
    secretToken: string
  ): Promise<any> {
    if (!token || !secretToken) {
      throw new Error("missing param to create jwt");
    }
    try {
      const decoded = await jwt.verify(token, secretToken);
      return decoded;
    } catch (error) {
      throw error;
    }
  }
}
