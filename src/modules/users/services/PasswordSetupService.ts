import { env } from '../../../config/env'
import type { UserProps } from '../entities/User'
import { sendMail } from '../../../infra/mail/mailer'
import { generatePasswordToken } from '../../../core/utils/jwt'
import { passwordSetupTemplate } from '../templates/passwordSetupTemplate'

export class PasswordSetupService {
  async send(user: UserProps) {
    const token = generatePasswordToken(user.id, user.login)
    const baseUrl = env.app.webUrl.replace(/\/$/, '')
    const path = env.app.passwordResetPath.startsWith('/')
      ? env.app.passwordResetPath
      : `/${env.app.passwordResetPath}`
    const actionUrl = `${baseUrl}${path}?token=${token}`

    await sendMail({
      to: user.email,
      subject: 'Defina sua senha • Marshall ERP',
      html: passwordSetupTemplate({
        fullName: user.fullName,
        login: user.login,
        actionUrl,
      }),
    })
  }
}

