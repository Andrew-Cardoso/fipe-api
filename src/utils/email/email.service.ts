import { Injectable } from '@nestjs/common';
import NodeMailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SMTP_CONFIG } from './email.config';

type Transporter = NodeMailer.Transporter<SMTPTransport.SentMessageInfo>;
type Message = Pick<Mail.Options, 'attachments' | 'subject' | 'to' | 'html'>;

const createTransporter = () => {
  const { host, port, pass, user } = SMTP_CONFIG;
  return NodeMailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    secure: false,
  });
};

@Injectable()
export class EmailService {
  private transporter: Readonly<Transporter>;
  constructor() {
    this.transporter = Object.freeze(createTransporter());
  }
  async sendEmail(message: Message) {
    const mailOptions: Mail.Options = {
      ...message,
      from: 'Consulta Fipe',
    };
    return this.transporter.sendMail(mailOptions);
  }
}
