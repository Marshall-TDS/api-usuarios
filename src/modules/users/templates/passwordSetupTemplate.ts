export const passwordSetupTemplate = ({
  fullName,
  login,
  actionUrl,
}: {
  fullName: string
  login: string
  actionUrl: string
}) => `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Bem-vindo ao Marshall ERP</title>
  </head>
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 45px rgba(15,23,42,0.1);">
            <tr>
              <td style="padding:32px;background:linear-gradient(135deg,#111827,#1f2937);">
                <img src="https://i.imgur.com/1yYTQf7.png" alt="Marshall ERP" style="height:32px;display:block;margin-bottom:24px;" />
                <h1 style="color:#f9fafb;font-size:24px;margin:0;">Bem-vindo ao Marshall ERP</h1>
                <p style="color:#d1d5db;margin:8px 0 0;font-size:15px;">
                  Olá, ${fullName}! Estamos felizes em ter você com a gente.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 16px;">
                  Seu usuário <strong>${login}</strong> foi criado com sucesso. Para começar a usar o sistema, defina sua senha clicando no botão abaixo. Este link expira em 2 horas por segurança.
                </p>
                <div style="text-align:center;margin:32px 0;">
                  <a
                    href="${actionUrl}"
                    style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;text-decoration:none;border-radius:999px;font-size:15px;font-weight:600;letter-spacing:0.3px;"
                  >
                    Definir minha senha
                  </a>
                </div>
                <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0;">
                  Se o botão não funcionar, copie e cole esta URL no navegador: <br />
                  <a href="${actionUrl}" style="color:#2563eb;">${actionUrl}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;background-color:#f9fafb;text-align:center;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} Marshall ERP • Plataforma de Operações Inteligentes
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`

