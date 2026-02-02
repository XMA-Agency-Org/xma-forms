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

    const fileFields = ["passportFront", "passportBack", "profilePhoto", "certifications", "previousEmploymentDocs"];
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
      <h1>New Employee Onboarding Submission</h1>

      <h2>Personal Information</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">First Name</td><td style="padding:4px 8px">${jsonData.firstName}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Last Name</td><td style="padding:4px 8px">${jsonData.lastName}</td></tr>
        ${jsonData.middleName ? `<tr><td style="padding:4px 8px;font-weight:bold">Middle Name</td><td style="padding:4px 8px">${jsonData.middleName}</td></tr>` : ""}
        ${jsonData.preferredName ? `<tr><td style="padding:4px 8px;font-weight:bold">Preferred Name</td><td style="padding:4px 8px">${jsonData.preferredName}</td></tr>` : ""}
        <tr><td style="padding:4px 8px;font-weight:bold">Date of Birth</td><td style="padding:4px 8px">${jsonData.dateOfBirth}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Passport Number</td><td style="padding:4px 8px">${jsonData.passportNumber}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Phone</td><td style="padding:4px 8px">${jsonData.phone}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Email</td><td style="padding:4px 8px">${jsonData.email}</td></tr>
        ${jsonData.secondaryPhone ? `<tr><td style="padding:4px 8px;font-weight:bold">Secondary Phone</td><td style="padding:4px 8px">${jsonData.secondaryPhone}</td></tr>` : ""}
        <tr><td style="padding:4px 8px;font-weight:bold">Address</td><td style="padding:4px 8px">${formatAddress(jsonData.residentialAddress)}</td></tr>
      </table>

      <h2>Employment Details</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">Employment Type</td><td style="padding:4px 8px">${jsonData.employmentType}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Job Title</td><td style="padding:4px 8px">${jsonData.jobTitle}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Start Date</td><td style="padding:4px 8px">${jsonData.startDate}</td></tr>
        ${jsonData.taxIdentificationNumber ? `<tr><td style="padding:4px 8px;font-weight:bold">Tax ID</td><td style="padding:4px 8px">${jsonData.taxIdentificationNumber}</td></tr>` : ""}
      </table>

      <h2>Bank Details</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">Bank Name</td><td style="padding:4px 8px">${jsonData.bankName}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Account Holder</td><td style="padding:4px 8px">${jsonData.accountHolderName}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Account/IBAN</td><td style="padding:4px 8px">${jsonData.accountNumberIban}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">SWIFT Code</td><td style="padding:4px 8px">${jsonData.swiftCode}</td></tr>
      </table>

      <h2>Emergency Contact</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;font-weight:bold">Name</td><td style="padding:4px 8px">${jsonData.emergencyContact.name}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Relationship</td><td style="padding:4px 8px">${jsonData.emergencyContact.relationship}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Phone</td><td style="padding:4px 8px">${jsonData.emergencyContact.phone}</td></tr>
      </table>

      ${jsonData.maritalStatus || jsonData.numberOfDependents || jsonData.medicalInformation ? `
        <h2>Additional Information</h2>
        <table style="border-collapse:collapse;width:100%">
          ${jsonData.maritalStatus ? `<tr><td style="padding:4px 8px;font-weight:bold">Marital Status</td><td style="padding:4px 8px">${jsonData.maritalStatus}</td></tr>` : ""}
          ${jsonData.numberOfDependents ? `<tr><td style="padding:4px 8px;font-weight:bold">Dependents</td><td style="padding:4px 8px">${jsonData.numberOfDependents}</td></tr>` : ""}
          ${jsonData.medicalInformation ? `<tr><td style="padding:4px 8px;font-weight:bold">Medical Info</td><td style="padding:4px 8px">${jsonData.medicalInformation}</td></tr>` : ""}
        </table>
      ` : ""}

      <p style="margin-top:20px;color:#666">File attachments are included with this email.</p>
    `;

    await resend.emails.send({
      from: "XMA Forms <onboarding@updates.xma.ae>",
      to: ADMIN_EMAIL,
      subject: `Employee Onboarding: ${jsonData.firstName} ${jsonData.lastName}`,
      html: htmlContent,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Employee submission error:", error);
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}
