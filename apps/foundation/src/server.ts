import handler from '@tanstack/react-start/server-entry'

export default {
  fetch: (request: Request, env: Record<string, unknown>, ctx: ExecutionContext) =>
    (handler.fetch as any)(request, env, ctx),
}
