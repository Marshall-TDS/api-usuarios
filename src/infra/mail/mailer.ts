import nodemailer from 'nodemailer'
import { env } from '../../config/env'

export const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: env.mail.secure,
  auth:
    env.mail.user && env.mail.password
      ? {
          user: env.mail.user,
          pass: env.mail.password,
        }
      : undefined,
})

export const sendMail = async (options: { to: string; subject: string; html: string }) => {
  await transporter.sendMail({
    from: env.mail.from,
    ...options,
  })
}

