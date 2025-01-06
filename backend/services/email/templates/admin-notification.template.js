export const adminNotificationTemplate = ({
  userName,
  businessName,
  email,
  planName,
  amount,
  currency,
}) => ({
  subject: "New Site Assessment Request",
  html: `
      <h2>New Site Assessment Request Received</h2>
      <p>A new site assessment request has been submitted with the following details:</p>
      <ul>
        <li><strong>Name:</strong> ${userName}</li>
        <li><strong>Business:</strong> ${businessName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Plan:</strong> ${planName}</li>
        <li><strong>Amount:</strong> ${currency.toUpperCase()} ${(
    amount / 100
  ).toFixed(2)}</li>
      </ul>
      <p>Please review and process this request in the admin dashboard.</p>
    `,
});
