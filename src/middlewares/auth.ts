import { auth } from "#/lib/auth"
import { createMiddleware } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { redirect } from '@tanstack/react-router'

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { session } })
  },
)

export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const url = new URL(request.url)

    if (
      !url.pathname.startsWith('/dashboard') &&
      !url.pathname.startsWith('/api/ai')
    ) {
      return next()
    }

    const session = await getSession();

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { session } })
  },
)

const getSession = async () => {
  const headers = getRequestHeaders()
  return await auth.api.getSession({ headers })
}