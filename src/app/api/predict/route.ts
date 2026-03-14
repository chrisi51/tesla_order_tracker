import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { predictDelivery } from '@/lib/prediction'
import { Order } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const vehicleType = searchParams.get('vehicleType')

  if (!vehicleType) {
    return NextResponse.json({ error: 'vehicleType is required' }, { status: 400 })
  }

  const model = searchParams.get('model') || undefined
  const country = searchParams.get('country') || undefined
  const drive = searchParams.get('drive') || undefined
  const orderDate = searchParams.get('orderDate') || undefined

  try {
    const orders = await prisma.order.findMany({
      where: { archived: false },
    }) as unknown as Order[]

    const prediction = predictDelivery(orders, vehicleType, model, country, drive, orderDate)

    if (!prediction) {
      return NextResponse.json(
        { error: 'Not enough data for prediction', minRequired: 3 },
        { status: 404 }
      )
    }

    const response = NextResponse.json(prediction)
    response.headers.set('Cache-Control', 'public, max-age=300')
    return response
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
