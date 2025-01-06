import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../../config/ses.config.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const command = new SendEmailCommand({
      Source: process.env.SES_EMAIL_FROM,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } },
      },
    });

    await sesClient.send(command);
    console.log(
      `Email sent successfully to ${Array.isArray(to) ? to.join(", ") : to}`
    );
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};
