import nodemailer from "nodemailer";

class Mailer {
  private static readonly host = process.env.MAIL_HOST as string;
  private static readonly port = process.env.MAIL_PORT as string;
  private static readonly user = process.env.MAIL_USER as string;
  private static readonly password = process.env.MAIL_PASS as string;

  public static veryfyMail(receiver: string, name: string, link: string): void {
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });

    const option = {
      from: Mailer.user,
      to: receiver,
      subject: "[a22z] Verify your email",
      text: `Hi ${name}!

      To finish signing up for a22z please click the link below to verify your email address:
      ${link}`,
    };

    transporter.sendMail(option, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log(`Mail sent: ${info.response}`);
    });
  }
}
export { Mailer };
