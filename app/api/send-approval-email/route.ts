import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userEmail, userName, contentTitle } = await req.json()

    console.log("APPROVAL EMAIL:", userEmail)

    if (!userEmail) {
      return NextResponse.json({ error: "No recipient email" }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: `"ProteinAI" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Submission Approved 🎉",
      text: `Hello ${userName},

Great news! Your submission "${contentTitle}" has been approved and is now published on ProteinAI.

Regards,
ProteinAI Team`,
    })

    console.log("APPROVAL EMAIL SENT:", info.response)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("APPROVAL EMAIL ERROR:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}