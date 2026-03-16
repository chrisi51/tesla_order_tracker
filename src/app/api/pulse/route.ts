import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { Order } from '@/lib/types'
import { parseGermanDate } from '@/lib/statistics'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { archived: false },
    }) as unknown as Order[]

    const totalOrders = orders.length
    const deliveredOrders = orders.filter(o => o.deliveryDate).length
    const deliveredPercent = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0

    // Average delivery days from the pre-calculated orderToDelivery field
    const deliveryDays = orders
      .filter(o => o.orderToDelivery !== null && o.orderToDelivery !== undefined)
      .map(o => o.orderToDelivery as number)
      .filter(d => d >= 0 && d <= 365)
    const avgDeliveryDays = deliveryDays.length > 0
      ? Math.round(deliveryDays.reduce((s, d) => s + d, 0) / deliveryDays.length)
      : null

    // VINs this week — use local time to match parseGermanDate
    const now = new Date()
    const localDay = now.getDay() || 7
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - localDay + 1)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const vinsThisWeek = orders.filter(o => {
      const d = parseGermanDate(o.vinReceivedDate)
      if (!d) return false
      return d >= weekStart && d < weekEnd
    }).length

    const response = NextResponse.json({
      totalOrders,
      deliveredOrders,
      deliveredPercent,
      avgDeliveryDays,
      vinsThisWeek,
    })

    response.headers.set('Cache-Control', 'public, max-age=300')
    return response
  } catch (error) {
    console.error('Failed to fetch pulse data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pulse data' },
      { status: 500 }
    )
  }
}
