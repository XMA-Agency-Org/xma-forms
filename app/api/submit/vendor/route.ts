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

    const fileFields = ["vatRegistrationCertificate", "complianceDocuments"];
    for (const field of fileFields) {
      const files = formData.getAll(field);
      for (const file of files) {
        if (file instanceof File) {
          const buffer = Buffer.from(await file.arrayBuffer());
          attachments.push({ filename: `${field}-${file.name}`, content: buffer });
        }
      }
    }

    const htmlContent = `
      <h1>New Vendor/Supplier Onboarding Submission</h1>

      <h2>Business Information</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">Vendor Name</td><td style="padding:4px 8px">${jsonData.vendorName}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Business Reg. Number</td><td style="padding:4px 8px">${jsonData.businessRegistrationNumber}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Tax ID / VAT</td><td style="padding:4px 8px">${jsonData.taxIdentificationVatNumber}</td></tr>
      </table>

      <h2>Contact Details</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">Contact Person</td><td style="padding:4px 8px">${jsonData.contactPersonName}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Phone</td><td style="padding:4px 8px">${jsonData.phone}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Email</td><td style="padding:4px 8px">${jsonData.email}</td></tr>
        ${jsonData.secondaryContactPerson ? `<tr><td style="padding:4px 8px;font-weight:bold">Secondary Contact</td><td style="padding:4px 8px">${jsonData.secondaryContactPerson}</td></tr>` : ""}
        ${jsonData.alternateContactDetails ? `<tr><td style="padding:4px 8px;font-weight:bold">Alternate Contact</td><td style="padding:4px 8px">${jsonData.alternateContactDetails}</td></tr>` : ""}
        <tr><td style="padding:4px 8px;font-weight:bold">Business Address</td><td style="padding:4px 8px">${formatAddress(jsonData.businessAddress)}</td></tr>
      </table>

      <h2>Bank Details</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">Bank Name</td><td style="padding:4px 8px">${jsonData.bankName}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Account Holder</td><td style="padding:4px 8px">${jsonData.accountHolderName}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Account/IBAN</td><td style="padding:4px 8px">${jsonData.accountNumberIban}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">SWIFT Code</td><td style="padding:4px 8px">${jsonData.swiftCode}</td></tr>
      </table>

      ${jsonData.yearsInOperation || jsonData.preferredPaymentMethod || jsonData.references || jsonData.notesAdditionalComments ? `
        <h2>Additional Information</h2>
        <table style="border-collapse:collapse;width:100%">
          ${jsonData.yearsInOperation ? `<tr><td style="padding:4px 8px;font-weight:bold">Years in Operation</td><td style="padding:4px 8px">${jsonData.yearsInOperation}</td></tr>` : ""}
          ${jsonData.preferredPaymentMethod ? `<tr><td style="padding:4px 8px;font-weight:bold">Preferred Payment</td><td style="padding:4px 8px">${jsonData.preferredPaymentMethod}</td></tr>` : ""}
          ${jsonData.references ? `<tr><td style="padding:4px 8px;font-weight:bold">References</td><td style="padding:4px 8px">${jsonData.references}</td></tr>` : ""}
          ${jsonData.notesAdditionalComments ? `<tr><td style="padding:4px 8px;font-weight:bold">Notes</td><td style="padding:4px 8px">${jsonData.notesAdditionalComments}</td></tr>` : ""}
        </table>
      ` : ""}

      <p style="margin-top:20px;color:#666">File attachments are included with this email.</p>
    `;

    await resend.emails.send({
      from: "XMA Forms <onboarding@updates.xma.ae>",
      to: ADMIN_EMAIL,
      subject: `Vendor Onboarding: ${jsonData.vendorName}`,
      html: htmlContent,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vendor submission error:", error);
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}
