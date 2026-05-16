import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const title = formData.get("title") as string
    const authorName = formData.get("authorName") as string
    const description = formData.get("description") as string
    const contentType = formData.get("contentType") as string
    const file = formData.get("file") as File

    if (!title || !authorName || !description || !contentType || !file) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create email content
    const emailSubject = `[ProteinAI Portal] New ${contentType} Submission: ${title}`
    const emailBody = `
New Research Submission for Review
===================================

Content Type: ${contentType.toUpperCase()}
Title: ${title}
Author: ${authorName}

Description:
${description}

File Details:
- Name: ${file.name}
- Size: ${(file.size / 1024).toFixed(2)} KB
- Type: ${file.type || "Unknown"}

---
This submission requires your review and approval before it can be published on the Researcher's Portal.

Please review and respond to approve or reject this submission.
    `.trim()

    // For a production app, you would use an email service like Resend, SendGrid, etc.
    // Since we don't have an email service configured, we'll return the email details
    // so the client can open a mailto link as a fallback

    return NextResponse.json({
      success: true,
      message: "Submission received successfully",
      emailData: {
        to: "proteinanalysisfyp@gmail.com",
        subject: emailSubject,
        body: emailBody,
        fileName: file.name,
        fileSize: file.size,
      },
    })
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 })
  }
}
