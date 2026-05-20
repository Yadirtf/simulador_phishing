import nodemailer from "nodemailer";
// import { MailtrapTransport } from "mailtrap";

// const token = process.env.MAILTRAP_TOKEN;

// if (!token) {
//   throw new Error("Por favor, define la variable de entorno MAILTRAP_TOKEN en .env.local");
// }

// export const transport = nodemailer.createTransport(
//   MailtrapTransport({
//     token: token,
//   })
// );

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

if (!smtpUser || !smtpPass) {
  throw new Error("Por favor, define las variables SMTP_USER y SMTP_PASS en .env.local");
}

export const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para puerto 465 (SSL/TLS implícito)
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    // Evita problemas de desconexión si algún antivirus o firewall local intermedia la conexión TLS
    rejectUnauthorized: false,
  },
});

export const SENDER_EMAIL = smtpUser;
export const SENDER_NAME = "Netflix Support";
