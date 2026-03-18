require("dotenv").config();

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// --- KUDIFLOW WELCOME EMAIL PIPELINE ---
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendWelcomeEmail = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const snapshot = event.data;

    if (!snapshot) {
      logger.error("No data associated with the event. Aborting.");
      return;
    }

    const userData = snapshot.data();
    const userEmail = userData.email;
    const userName = userData.fullName || "Shop Owner";

    try {
      const result = await resend.emails.send({
        from: "KudiFlow <onboarding@resend.dev>",
        to: [userEmail],
        subject: "Welcome to KudiFlow! Let's grow your business.",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Inter',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background-color:#0f172a;padding:32px 40px;text-align:center;">
                      <p style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                        Kudi<span style="color:#10b981;">Flow</span>
                      </p>
                      <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;font-weight:500;">The Offline-First
App for Smart Vendors</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 40px 32px;">
                      <p style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">
                        Welcome aboard, ${userName}! 🎉
                      </p>
                      <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
                        Your KudiFlow shop is now <strong style="color:#10b981;">live and active</strong>. 
                        You can start recording your sales, tracking your debtors, and managing 
                        your inventory, even without internet.
                      </p>
                      <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.7;">
                        No more paper ledgers. No more guessing your stock levels. 
                        KudiFlow keeps your business running no matter the network.
                      </p>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="https://kudiflow.com/dashboard"
                              style="display:inline-block;background-color:#10b981;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;letter-spacing:0.1px;">
                              Open My Dashboard →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Feature highlights -->
                  <tr>
                    <td style="padding:0 40px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
                        <tr>
                          <td style="padding:20px 24px;">
                            <p style="margin:0 0 12px;font-size:12px;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:1px;">What you can do now</p>
                            <p style="margin:0 0 8px;font-size:14px;color:#1e293b;">⚡ <strong>Log sales in 3 seconds</strong> — even offline</p>
                            <p style="margin:0 0 8px;font-size:14px;color:#1e293b;">📦 <strong>Track your inventory</strong> with low-stock alerts</p>
                            <p style="margin:0;font-size:14px;color:#1e293b;">💸 <strong>Manage debtors</strong> and send WhatsApp reminders</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                        You received this because you signed up for KudiFlow.<br>
                        Questions? Reply to this email or visit 
                        <a href="https://kudiflow.com" style="color:#10b981;text-decoration:none;font-weight:600;">kudiflow.com</a>
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
      });

      logger.info(`Welcome email sent successfully to ${userEmail}`, {
        userId: snapshot.id,
        emailId: result.data?.id,
      });
    } catch (error) {
      logger.error(`Failed to send welcome email to ${userEmail}`, {
        userId: snapshot.id,
        error: error.message,
      });
    }
  }
);
