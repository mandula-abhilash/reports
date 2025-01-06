import { sendEmail } from "./ses.service.js";
import { adminNotificationTemplate } from "./templates/admin-notification.template.js";
import { userInvoiceTemplate } from "./templates/user-invoice.template.js";

/**
 * Send all notifications related to successful checkout
 */
export const sendCheckoutNotifications = async ({
  session,
  userName,
  email,
  businessName,
}) => {
  try {
    const invoiceNumber = generateInvoiceNumber();
    let siteDetails = {};

    try {
      const siteRequest = JSON.parse(session.metadata.siteRequest || "{}");
      siteDetails = {
        siteName: siteRequest.siteName || "Not specified",
        siteLocation: siteRequest.siteLocation || "Not specified",
        coordinates: siteRequest.coordinates || null,
      };
    } catch (error) {
      console.error("Error parsing site request data:", error);
      siteDetails = {
        siteName: "Not specified",
        siteLocation: "Not specified",
        coordinates: null,
      };
    }

    // Send individual emails to each admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const adminNotifications = adminEmails.map((adminEmail) =>
      sendAdminNotification({
        to: adminEmail,
        userName,
        businessName,
        email,
        planName: session.metadata.name,
        amount: session.amount_total,
        currency: session.currency,
        ...siteDetails,
      })
    );

    await Promise.all([
      ...adminNotifications,
      sendUserInvoice({
        userName,
        email,
        planName: session.metadata.name,
        amount: session.amount_total,
        currency: session.currency,
        invoiceNumber,
        sessionId: session.id,
        ...siteDetails,
      }),
    ]);
  } catch (error) {
    console.error("Error sending notifications:", error);
    // Don't throw the error to prevent webhook failure
    // but log it for monitoring
  }
};

/**
 * Send notification to a single admin
 */
const sendAdminNotification = async ({ to, ...params }) => {
  const template = adminNotificationTemplate(params);
  await sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  });
};

/**
 * Send invoice to user
 */
const sendUserInvoice = async (params) => {
  const template = userInvoiceTemplate(params);
  await sendEmail({
    to: params.email,
    subject: template.subject,
    html: template.html,
  });
};

/**
 * Generate a unique invoice number
 */
const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV-${timestamp}-${random}`;
};
