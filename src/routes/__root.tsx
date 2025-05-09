import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { MapPin } from 'lucide-react'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex items-center justify-center">
        <div className="flex w-[600px]">
          <MapPin />
        </div>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
})
