import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: message,
    })

    return NextResponse.json({
      reply: result.text,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error: 'Something went wrong',
      },
      { status: 500 }
    )
  }
}