import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, festival = 'Lunar New Year', festivalDesc = 'red lanterns, gold coins, fireworks' } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    const fullPrompt = `Create a kawaii sticker of "Ding Ding Cat" — a Hong Kong mascot cat with a yellow-gold bell-shaped helmet, green propeller on top, green ear cutouts, calico cat face, big sparkly eyes, pink blush cheeks, chubby chibi body, bold dark outlines. Festival: ${festival} with ${festivalDesc}. Cat is: ${prompt}. White background, sticker style, no text.`

    const result = await generateText({
      model: 'google/gemini-3.1-flash-image-preview' as any,
      prompt: fullPrompt,
      experimental_providerMetadata: { gateway: { apiKey: process.env.AI_GATEWAY_API_KEY } }
    } as any)

    const files = (result as any).files?.filter((f: any) => f.mediaType?.startsWith('image/'))
    if (!files?.length) return NextResponse.json({ error: 'No image generated' }, { status: 500 })

    const base64 = Buffer.from(files[0].uint8Array).toString('base64')
    return NextResponse.json({ image: `data:${files[0].mediaType};base64,${base64}` })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
