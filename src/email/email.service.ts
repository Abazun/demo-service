import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from "./send-email.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {

  constructor(private readonly mailService: MailerService,
              private configService: ConfigService) {
  }

  async sendEmail(data: SendEmailDto): Promise<{ success: boolean } | null> {
    const { recipients, subject, html, text } = data;
    return await this.mailService.sendMail({
      from: this.configService.get<string>('MAIL_SENDER_NAME_DEFAULT'),
      to: recipients,
      subject: subject,
      html: html,
      text: text,
    });
  }
}
