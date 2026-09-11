import { Resend } from 'resend'

import { env } from '../config/env.js'

const resend = new Resend(
  env.RESEND_API_KEY,
)

type SendPasswordResetCodeEmailInput = {
  email: string
  nome: string
  codigo: string
}

export async function sendPasswordResetCodeEmail(
  input: SendPasswordResetCodeEmailInput,
) {
  const result = await resend.emails.send({
    from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,

    to: [input.email],

    subject:
      'Código para redefinição de senha',

    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>
            Redefinição de senha
          </title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              padding: 32px 16px;
              background-color: #f4f6f8;
            "
          >
            <tr>
              <td align="center">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    max-width: 560px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 32px;
                      "
                    >
                      <h1
                        style="
                          margin: 0 0 24px;
                          font-size: 24px;
                          line-height: 32px;
                        "
                      >
                        Redefinição de senha
                      </h1>

                      <p
                        style="
                          margin: 0 0 16px;
                          font-size: 16px;
                          line-height: 24px;
                        "
                      >
                        Olá, ${input.nome}.
                      </p>

                      <p
                        style="
                          margin: 0 0 24px;
                          font-size: 16px;
                          line-height: 24px;
                        "
                      >
                        Recebemos uma solicitação
                        para redefinir a senha da
                        sua conta.
                      </p>

                      <p
                        style="
                          margin: 0 0 12px;
                          font-size: 14px;
                          line-height: 20px;
                        "
                      >
                        Seu código de verificação é:
                      </p>

                      <div
                        style="
                          margin: 0 0 24px;
                          padding: 20px;
                          border-radius: 8px;
                          background-color: #f3f4f6;
                          text-align: center;
                          font-size: 32px;
                          font-weight: 700;
                          letter-spacing: 8px;
                        "
                      >
                        ${input.codigo}
                      </div>

                      <p
                        style="
                          margin: 0 0 12px;
                          font-size: 14px;
                          line-height: 20px;
                        "
                      >
                        Este código é válido por
                        <strong>10 minutos</strong>.
                      </p>

                      <p
                        style="
                          margin: 0;
                          font-size: 14px;
                          line-height: 20px;
                          color: #6b7280;
                        "
                      >
                        Se você não solicitou a
                        redefinição da senha, ignore
                        este e-mail. Sua senha atual
                        continuará válida.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,

    text: [
      `Olá, ${input.nome}.`,
      '',
      'Recebemos uma solicitação para redefinir a senha da sua conta.',
      '',
      `Código de verificação: ${input.codigo}`,
      '',
      'Este código é válido por 10 minutos.',
      '',
      'Se você não solicitou a redefinição da senha, ignore este e-mail.',
    ].join('\n'),
  })

  if (result.error) {
    console.error(
      'Erro ao enviar e-mail pelo Resend:',
      result.error,
    )

    throw new Error(
      'Não foi possível enviar o e-mail de recuperação de senha',
    )
  }

  return result.data
}