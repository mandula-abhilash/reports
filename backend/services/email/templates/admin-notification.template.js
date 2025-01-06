export const adminNotificationTemplate = ({
  userName = "Unknown",
  businessName = "Unknown",
  email = "",
  planName = "",
  amount = 0,
  currency = "GBP",
  siteName = "Not specified",
  siteLocation = "Not specified",
  coordinates = null,
}) => {
  const locationLink = coordinates
    ? `<li><strong>Coordinates:</strong> <a href="https://www.google.com/maps?q=${coordinates.replace(
        /\s+/g,
        ""
      )}">${coordinates}</a></li>`
    : "";

  return {
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
        <li><strong>Site Name:</strong> ${siteName}</li>
        <li><strong>Location:</strong> ${siteLocation}</li>
        ${locationLink}
      </ul>
      <p>Please review and process this request.</p>
    `,
  };
};
