import { Injectable, Logger } from '@nestjs/common';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';

import { MailerOptions } from './interfaces/mailer-options.interface';
import { ISendMailOptions } from './interfaces/send-mail-options.interface';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private transporter: any;
  private mailerOptions: MailerOptions = {};
  private doConnect = null;

  constructor(private readonly configService: ConfigService) {
    this.doConnect = async () => {
      this.mailerOptions = {
        transport: {
          host: this.configService.get<string>('MAIL_HOST'),
          port: this.configService.get<number>('MAIL_PORT'),
          auth: {
            user: this.configService.get<string>('MAIL_USER'),
            pass: this.configService.get<string>('MAIL_PASS'),
          },
          secure: false,
        },
        defaults: {
          from: this.configService.get<string>('MAIL_FROM'),
        },
        template: {
          dir: join(__dirname, 'templates'),
          options: {
            strict: true,
          },
        },
      };

      const transporter = createTransport(
        this.mailerOptions.transport,
        this.mailerOptions.defaults,
      );

      transporter.verify((error, success) => {
        if (error) {
          this.logger.warn(error, 'Email server connection failed');
        } else {
          this.transporter = transporter;
          this.logger.log('Email server connected successfully');
        }
      });
    };
    this.doConnect();
  }

  public async sendMail(
    sendMailOptions: ISendMailOptions,
  ): Promise<SentMessageInfo> {
    if (sendMailOptions.template) {
      const emailTemplateSource = readFileSync(
        join(this.mailerOptions.template.dir, sendMailOptions.template),
        'utf8',
      );
      const template = handlebars.compile(emailTemplateSource);
      sendMailOptions.html = template(sendMailOptions.context);
      delete sendMailOptions.template;
    }
    return await this.transporter.sendMail(sendMailOptions);
  }
}
