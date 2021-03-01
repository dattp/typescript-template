import { Mailer } from "../../utils/mailer";

class UserProcessQueue {
  public static async verifyMail(job: {
    data: { email: string; fullname: string; shortUrl: string };
  }): Promise<void> {
    try {
      const { email: receiver, fullname: name, shortUrl: link } = job.data;
      Mailer.veryfyMail(receiver, name, link);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { UserProcessQueue };
