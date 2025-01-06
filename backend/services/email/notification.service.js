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
  const invoiceNumber = generateInvoiceNumber();

  await Promise.all([
    sendAdminNotification({
      userName,
      businessName,
      email,
      planName: session.metadata.name,
      amount: session.amount_total,
      currency: session.currency,
    }),
    sendUserInvoice({
      userName,
      email,
      planName: session.metadata.name,
      amount: session.amount_total,
      currency: session.currency,
      invoiceNumber,
      sessionId: session.id,
    }),
  ]);
};

/**
 * Send notification to admin(s)
 */
const sendAdminNotification = async (params) => {
  const adminEmails = process.env.ADMIN_EMAILS.split(",");
  const template = adminNotificationTemplate(params);

  await sendEmail({
    to: adminEmails,
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
