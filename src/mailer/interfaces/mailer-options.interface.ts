/** Interfaces **/
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface MailerOptions {
  defaults?: SMTPTransport.Options;
  transport?: SMTPTransport | SMTPTransport.Options | string;
  template?: {
    dir?: string;
    options?: { [name: string]: any };
  };
}
