import { Order, MODEL_Y_TRIMS, MODEL_3_TRIMS, COLORS, DRIVES, COUNTRIES } from './types'
import { parseGermanDate, calculateDaysBetween } from './statistics'

// Resolve internal value to display label
function resolveLabel(value: string, dimension: 'model' | 'color' | 'drive' | 'country'): string {
  const allOptions: { value: string; label: string }[] = (() => {
    switch (dimension) {
      case 'model': return [...MODEL_Y_TRIMS, ...MODEL_3_TRIMS]
      case 'color': return COLORS
      case 'drive': return DRIVES
      case 'country': return COUNTRIES
    }
  })()
  const match = allOptions.find(o => o.value === value || o.label.toLowerCase() === value.toLowerCase())
  return match?.label || value
}

export interface DeliveryPrediction {
  optimisticDays: number
  expectedDays: number
  pessimisticDays: number
  optimisticDate: string
  expectedDate: string
  pessimisticDate: string
  confidence: 'high' | 'medium' | 'low'
  sampleSize: number
  filtersUsed: string[]
}

export interface DeliveryTrend {
  monthlyAverages: { month: string; avgDays: number; medianDays: number; count: number }[]
  currentTrend: 'accelerating' | 'decelerating' | 'stable'
  trendChangePercent: number
}

export interface ConfigDeliveryInsight {
  dimension: string
  values: { name: string; avgDays: number; medianDays: number; count: number }[]
}

export interface VinActivity {
  weeklyData: { week: string; count: number }[]
  thisWeek: number
  lastWeek: number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
}

function formatGermanDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function percentile(sorted: number[], p: number): number {
  const index = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  return Math.round(sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower))
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid]
}

export function predictDelivery(
  orders: Order[],
  vehicleType: string,
  model?: string,
  country?: string,
  drive?: string,
  orderDate?: string
): DeliveryPrediction | null {
  const filtersUsed: string[] = []

  // Start with strict filters, progressively relax
  let candidates = orders.filter(o => o.deliveryDate && o.vehicleType === vehicleType)
  filtersUsed.push(vehicleType)

  if (model && candidates.filter(o => o.model === model).length >= 5) {
    candidates = candidates.filter(o => o.model === model)
    filtersUsed.push(model)
  }

  if (country && candidates.filter(o => o.country === country).length >= 5) {
    candidates = candidates.filter(o => o.country === country)
    filtersUsed.push(country)
  }

  if (drive && candidates.filter(o => o.drive === drive).length >= 3) {
    candidates = candidates.filter(o => o.drive === drive)
    filtersUsed.push(drive)
  }

  // Calculate delivery days
  const deliveryDays = candidates
    .map(o => calculateDaysBetween(o.orderDate, o.deliveryDate))
    .filter((d): d is number => d !== null)
    .sort((a, b) => a - b)

  if (deliveryDays.length < 3) return null

  const p25 = percentile(deliveryDays, 25)
  const p50 = percentile(deliveryDays, 50)
  const p75 = percentile(deliveryDays, 75)

  const confidence: DeliveryPrediction['confidence'] =
    deliveryDays.length >= 30 ? 'high' : deliveryDays.length >= 10 ? 'medium' : 'low'

  const baseDate = orderDate ? parseGermanDate(orderDate) : new Date()
  const refDate = baseDate || new Date()

  return {
    optimisticDays: p25,
    expectedDays: p50,
    pessimisticDays: p75,
    optimisticDate: formatGermanDate(addDays(refDate, p25)),
    expectedDate: formatGermanDate(addDays(refDate, p50)),
    pessimisticDate: formatGermanDate(addDays(refDate, p75)),
    confidence,
    sampleSize: deliveryDays.length,
    filtersUsed,
  }
}

export function calculateDeliveryTrend(orders: Order[]): DeliveryTrend | null {
  const delivered = orders.filter(o => o.deliveryDate)

  // Group by delivery month
  const monthMap: Record<string, number[]> = {}
  delivered.forEach(o => {
    const date = parseGermanDate(o.deliveryDate)
    const days = calculateDaysBetween(o.orderDate, o.deliveryDate)
    if (date && days !== null) {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!monthMap[key]) monthMap[key] = []
      monthMap[key].push(days)
    }
  })

  const months = Object.keys(monthMap).sort()
  if (months.length < 3) return null

  const monthlyAverages = months.map(month => {
    const days = monthMap[month]
    const avg = Math.round(days.reduce((s, d) => s + d, 0) / days.length)
    const med = median(days)
    const [year, m] = month.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return {
      month: `${monthNames[parseInt(m) - 1]} ${year}`,
      avgDays: avg,
      medianDays: med,
      count: days.length,
    }
  })

  // Compare last 3 months avg to previous 3 months
  const recent3 = monthlyAverages.slice(-3)
  const previous3 = monthlyAverages.slice(-6, -3)

  if (previous3.length < 2) {
    return { monthlyAverages, currentTrend: 'stable', trendChangePercent: 0 }
  }

  const recentAvg = recent3.reduce((s, m) => s + m.avgDays, 0) / recent3.length
  const previousAvg = previous3.reduce((s, m) => s + m.avgDays, 0) / previous3.length

  const changePercent = previousAvg > 0 ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) : 0

  let currentTrend: DeliveryTrend['currentTrend'] = 'stable'
  if (changePercent <= -5) currentTrend = 'accelerating'
  else if (changePercent >= 5) currentTrend = 'decelerating'

  return { monthlyAverages, currentTrend, trendChangePercent: Math.abs(changePercent) }
}

export function calculateConfigInsights(
  orders: Order[],
  dimension: 'model' | 'color' | 'drive' | 'country'
): ConfigDeliveryInsight {
  const delivered = orders.filter(o => o.deliveryDate)
  const groups: Record<string, number[]> = {}

  delivered.forEach(o => {
    const days = calculateDaysBetween(o.orderDate, o.deliveryDate)
    if (days === null) return

    let rawKey: string | null = null
    switch (dimension) {
      case 'model': rawKey = o.model; break
      case 'color': rawKey = o.color; break
      case 'drive': rawKey = o.drive; break
      case 'country': rawKey = o.country; break
    }
    if (!rawKey) return

    const key = resolveLabel(rawKey, dimension)
    if (!groups[key]) groups[key] = []
    groups[key].push(days)
  })

  const values = Object.entries(groups)
    .filter(([, days]) => days.length >= 3)
    .map(([name, days]) => ({
      name,
      avgDays: Math.round(days.reduce((s, d) => s + d, 0) / days.length),
      medianDays: median(days),
      count: days.length,
    }))
    .sort((a, b) => a.medianDays - b.medianDays)

  return { dimension, values }
}

export function calculateVinActivity(orders: Order[]): VinActivity | null {
  const withVin = orders.filter(o => o.vinReceivedDate)
  if (withVin.length < 5) return null

  // Group by ISO week
  const weekMap: Record<string, number> = {}
  withVin.forEach(o => {
    const date = parseGermanDate(o.vinReceivedDate)
    if (!date) return
    // ISO week calculation
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
    const week1 = new Date(d.getFullYear(), 0, 4)
    const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    const key = `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
    weekMap[key] = (weekMap[key] || 0) + 1
  })

  const weeks = Object.keys(weekMap).sort()
  const weeklyData = weeks.slice(-12).map(week => ({ week, count: weekMap[week] }))

  const thisWeek = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].count : 0
  const lastWeek = weeklyData.length > 1 ? weeklyData[weeklyData.length - 2].count : 0

  let trend: VinActivity['trend'] = 'stable'
  let trendPercent = 0
  if (lastWeek > 0) {
    trendPercent = Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
    if (trendPercent >= 10) trend = 'up'
    else if (trendPercent <= -10) trend = 'down'
  }

  return { weeklyData, thisWeek, lastWeek, trend, trendPercent: Math.abs(trendPercent) }
}
