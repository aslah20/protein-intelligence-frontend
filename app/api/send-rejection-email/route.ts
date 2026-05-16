import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userEmail, userName, contentTitle, reason } = await req.json()

    console.log("API RECEIVED EMAIL:", userEmail)

    if (!userEmail) {
      return NextResponse.json({ error: "No recipient email" }, { status: 400 })
    }

    // ✅ CREATE TRANSPORTER (GMAIL)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // ✅ SEND EMAIL
    const info = await transporter.sendMail({
      from: `"ProteinAI" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Submission Rejected",
      text: `Hello ${userName},

Your submission "${contentTitle}" has been rejected.

Reason:
${reason}

Regards,
ProteinAI Team`,
    })

    console.log("EMAIL SENT:", info.response)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("EMAIL ERROR:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}