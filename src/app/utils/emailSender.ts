import nodemailer from "nodemailer";
import dotenv from "dotenv";
import config from "../config";
dotenv.config();
export const emailSender = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: process.env.NODE_ENV === "production",
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
  });

  await transporter.sendMail({
    from: config.emailSender.email, // sender address
    to, // list of receivers
    subject: "E-Commerce forget password within 5 mins!", // Subject line
    text: "Forget Password", // plain text body
    html, // html body
  });
};
