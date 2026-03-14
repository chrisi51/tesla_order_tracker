import { NextRequest } from 'next/server'
import { withTostAuth } from '@/lib/tost-auth'
import { createApiSuccessResponse } from '@/lib/api-response'
import { getTostLogs, clearTostLogs } from '@/lib/tost-debug-log'

// GET /api/v1/tost/debug - Get recent TOST API call logs
// Query params:
//   limit=50        max entries (1-100)
//   status=error    only 4xx/5xx responses
//   status=success  only 2xx responses
//   status=409      specific status code
//   method=POST     filter by HTTP method
export const GET = withTostAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50'), 1), 100)
  const status = searchParams.get('status')
  const method = searchParams.get('method')?.toUpperCase()

  let logs = getTostLogs(limit)

  if (status === 'error') {
    logs = logs.filter(l => l.responseStatus >= 400)
  } else if (status === 'success') {
    logs = logs.filter(l => l.responseStatus < 400)
  } else if (status) {
    const code = parseInt(status)
    if (!isNaN(code)) {
      logs = logs.filter(l => l.responseStatus === code)
    }
  }

  if (method) {
    logs = logs.filter(l => l.method === method)
  }

  return createApiSuccessResponse(logs, { count: logs.length })
})

// DELETE /api/v1/tost/debug - Clear all debug logs
export const DELETE = withTostAuth(async () => {
  clearTostLogs()
  return createApiSuccessResponse({ message: 'Debug logs cleared' })
})
