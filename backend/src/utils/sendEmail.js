const { Resend } = require("resend");
const env = require("../config/env");

const sendEmail = async ({ to, subject, html, text }) => {
  if (!env.resendApiKey) {
    console.warn("RESEND_API_KEY is missing. Email not sent.");
    return null;
  }

  const resend = new Resend(env.resendApiKey);

  const fromEmail = env.emailFrom || "no-reply@info.subletmatch.com";
  const fromName = env.emailName || "SubletMatch";

  const response = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });

  return response;
};

module.exports = sendEmail;