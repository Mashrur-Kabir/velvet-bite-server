/**
 * A template for email verification sent on a gmail account.
 */

export function verificationEmailTemplate(
  verificationURL: string,
  userName: string,
) {
  return `
  <div style="margin:0;padding:0;background:#0b1020;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:48px 16px;">
          <table width="100%" max-width="560px" cellpadding="0" cellspacing="0"
            style="
              background:#0f172a;
              border-radius:14px;
              box-shadow:0 20px 50px rgba(79,70,229,0.25);
              overflow:hidden;
            ">

            <!-- Header -->
            <tr>
              <td style="
                padding:32px;
                background:linear-gradient(135deg, #1e3a8a, #6d28d9);
                color:#ffffff;
              ">
                <h1 style="
                  margin:0;
                  font-size:22px;
                  font-weight:700;
                  letter-spacing:0.5px;
                ">
                  Velvet Bite
                </h1>
                <p style="
                  margin:6px 0 0;
                  font-size:13px;
                  opacity:0.85;
                ">
                  Secure • Modern • Developer-first
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px;">
                <h2 style="
                  margin:0 0 14px;
                  font-size:24px;
                  color:#e5e7eb;
                ">
                  Verify your email
                </h2>

                <p style="
                  margin:0 0 24px;
                  font-size:15px;
                  color:#c7d2fe;
                  line-height:1.7;
                ">
                  Hello <strong style="color:#ffffff;">${userName}</strong>,
                  <br /><br />
                  Thanks for joining <strong>Velvet Bite</strong> 🎉  
                  Please verify your email address to activate your account and get started.
                </p>

                <!-- Button -->
                <div style="text-align:center;margin:36px 0;">
                  <a href="${verificationURL}"
                    style="
                      display:inline-block;
                      padding:15px 34px;
                      background:linear-gradient(135deg, #4f46e5, #9333ea);
                      color:#ffffff;
                      text-decoration:none;
                      font-weight:700;
                      border-radius:999px;
                      font-size:15px;
                      letter-spacing:0.3px;
                      box-shadow:0 10px 30px rgba(147,51,234,0.45);
                    ">
                    Verify Email →
                  </a>
                </div>

                <!-- Fallback link -->
                <p style="
                  margin:0;
                  font-size:13px;
                  color:#9ca3af;
                  line-height:1.6;
                ">
                  If the button doesn’t work, click the link below or copy-paste it into your browser:
                </p>

                <p style="
                  margin:10px 0 0;
                  font-size:13px;
                  word-break:break-all;
                  color:#a5b4fc;
                ">
                  ${verificationURL}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                padding:22px 32px;
                background:#020617;
                font-size:12px;
                color:#6b7280;
                text-align:center;
              ">
                If you didn’t create an account, you can safely ignore this email.
                <br /><br />
                © 2025 Velvet Bite. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}
