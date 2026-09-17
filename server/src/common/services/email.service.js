import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null

const FROM_EMAIL =
    process.env.EMAIL_FROM || "MERN Template <onboarding@resend.dev>"

/**
 * Core send helper with local development terminal fallback
 */
export const sendEmail = async ({ to, subject, html, text }) => {
    // Development fallback if Resend API key is not configured
    if (!resend) {
        console.log("\n=======================================================")
        console.log("📨 [DEV EMAIL PREVIEW - No RESEND_API_KEY configured]")
        console.log(`To:      ${to}`)
        console.log(`From:    ${FROM_EMAIL}`)
        console.log(`Subject: ${subject}`)
        console.log("-------------------------------------------------------")
        console.log(text || "HTML Email Body Generated")
        console.log("=======================================================\n")
        return { success: true, isDev: true }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
            text
        })

        if (error) {
            console.error("❌ Resend Email Error:", error)
            return { success: false, error }
        }

        console.log(`✅ Email sent successfully to ${to} (ID: ${data?.id})`)
        return { success: true, data }
    } catch (err) {
        console.error("❌ Failed to send email:", err)
        return { success: false, error: err.message }
    }
}

/**
 * 1. Send Welcome Email (Sent on first-time user registration)
 */
export const sendWelcomeEmail = async ({ to, name }) => {
    const displayName = name || "there"
    const dashboardUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 36px; }
          .logo { display: inline-block; background-color: #ffffff; color: #020617; font-weight: bold; font-size: 18px; width: 40px; height: 40px; line-height: 40px; text-align: center; border-radius: 10px; margin-bottom: 24px; }
          h1 { color: #ffffff; font-size: 24px; margin-top: 0; font-weight: 700; }
          p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
          .btn { display: inline-block; background-color: #ffffff; color: #0f172a !important; font-weight: 600; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin: 24px 0; }
          .footer { margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 20px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">M</div>
          <h1>Welcome to MERN Template, ${displayName}! 👋</h1>
          <p>We're thrilled to have you on board. Your account is ready, and you can start exploring your dashboard right away.</p>
          <a href="${dashboardUrl}" class="btn">Go to Dashboard</a>
          <p>If you have any questions or need help getting started, feel free to reply directly to this email.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MERN Production Template. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `

    const text = `Welcome to MERN Template, ${displayName}!\n\nYour account has been created successfully. Access your dashboard here: ${dashboardUrl}`

    return sendEmail({
        to,
        subject: `Welcome to MERN Template, ${displayName}! 🚀`,
        html,
        text
    })
}
