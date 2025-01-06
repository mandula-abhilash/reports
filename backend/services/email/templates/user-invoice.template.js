export const userInvoiceTemplate = ({
  userName,
  planName,
  amount,
  currency,
  invoiceNumber,
  sessionId,
}) => ({
  subject: "Payment Confirmation - FGB Acumen Site Assessment",
  html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for your payment. Here are your transaction details:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Invoice #${invoiceNumber}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Plan:</strong></td>
              <td style="padding: 8px 0;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0;">${currency.toUpperCase()} ${(
    amount / 100
  ).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Transaction ID:</strong></td>
              <td style="padding: 8px 0;">${sessionId}</td>
            </tr>
          </table>
        </div>
  
        <p>Your site assessment report will be generated and sent to you shortly.</p>
        
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>FGB Acumen Team</p>
      </div>
    `,
});
