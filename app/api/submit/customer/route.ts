import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "admin@xmaagency.com";

function formatAddress(address: Record<string, string>): string {
  return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jsonData = JSON.parse(formData.get("data") as string);

    const attachments: { filename: string; content: Buffer }[] = [];

    const fileFields = ["vatRegistrationCertificate", "supportingDocuments"];
    for (const field of fileFields) {
      const files = formData.getAll(field);
      for (const file of files) {
        if (file instanceof File) {
          const buffer = Buffer.from(await file.arrayBuffer());
          attachments.push({ filename: `${field}-${file.name}`, content: buffer });
        }
      }
    }

    const isCompany = jsonData.customerType === "company";
    const customerName = isCompany ? jsonData.companyName : jsonData.fullName;

    const htmlContent = `
      <h1>New Customer Onboarding Submission</h1>

      <h2>Customer Type: ${jsonData.customerType === "individual" ? "Individual" : "Company"}</h2>

      <h2>${isCompany ? "Company" : "Personal"} Details</h2>
      <table style="border-collapse:collapse;width:100%">
        ${isCompany ? `
          <tr><td style="padding:4px 8px;font-weight:bold">Company Name</td><td style="padding:4px 8px">${jsonData.companyName}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold">Registration Number</td><td style="padding:4px 8px">${jsonData.companyRegistrationNumber}</td></tr>
          ${jsonData.companySize ? `<tr><td style="padding:4px 8px;font-weight:bold">Company Size</td><td style="padding:4px 8px">${jsonData.companySize}</td></tr>` : ""}
        ` : `
          <tr><td style="padding:4px 8px;font-weight:bold">Full Name</td><td style="padding:4px 8px">${jsonData.fullName}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold">National ID</td><td style="padding:4px 8px">${jsonData.nationalIdNumber}</td></tr>
        `}
        ${jsonData.industryType ? `<tr><td style="padding:4px 8px;font-weight:bold">Industry</td><td style="padding:4px 8px">${jsonData.industryType}</td></tr>` : ""}
      </table>

      <h2>Contact Information</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">Primary Contact</td><td style="padding:4px 8px">${jsonData.primaryContactPerson}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Phone</td><td style="padding:4px 8px">${jsonData.phone}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Email</td><td style="padding:4px 8px">${jsonData.email}</td></tr>
        ${jsonData.secondaryContactPerson ? `<tr><td style="padding:4px 8px;font-weight:bold">Secondary Contact</td><td style="padding:4px 8px">${jsonData.secondaryContactPerson}</td></tr>` : ""}
        ${jsonData.alternatePhone ? `<tr><td style="padding:4px 8px;font-weight:bold">Alternate Phone</td><td style="padding:4px 8px">${jsonData.alternatePhone}</td></tr>` : ""}
        ${jsonData.preferredCommunicationMethod ? `<tr><td style="padding:4px 8px;font-weight:bold">Preferred Method</td><td style="padding:4px 8px">${jsonData.preferredCommunicationMethod}</td></tr>` : ""}
      </table>

      <h2>Billing Address</h2>
      <p style="padding:4px 8px">${formatAddress(jsonData.billingAddress)}</p>

      ${!jsonData.shippingAddressSameAsBilling && jsonData.shippingAddress ? `
        <h2>Shipping Address</h2>
        <p style="padding:4px 8px">${formatAddress(jsonData.shippingAddress)}</p>
      ` : `<p style="padding:4px 8px"><em>Shipping address same as billing</em></p>`}

      <h2>VAT / Tax Details</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">TRN/VAT</td><td style="padding:4px 8px">${jsonData.trnVat}</td></tr>
      </table>

      <p style="margin-top:20px;color:#666">File attachments are included with this email.</p>
    `;

    await resend.emails.send({
      from: "XMA Forms <onboarding@updates.xma.ae>",
      to: ADMIN_EMAIL,
      subject: `Customer Onboarding: ${customerName} (${jsonData.customerType})`,
      html: htmlContent,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer submission error:", error);
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}
