import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'
import appCss from '~/styles/app.css?url'
import { AuthProvider } from '~/context/AuthContext'
import { Navbar } from '~/components/navbar/navbar'
import { currentProject } from '~/config/project'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: currentProject.title },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/png', href: '/assets/logo_transparent.png' },
      {
        rel: 'stylesheet',
        href: 'https://api.fontshare.com/v2/css?f[]=synonym@300,400,500,700&f[]=amulya@300,400,500,700&f[]=gambetta@300,400,500,700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap',
      },
    ],
  }),
  notFoundComponent: () => <div>Route not found</div>,
  component: RootComponent,
})

function RootComponent() {
  return (
    <AuthProvider>
      <RootDocument>
        <Navbar />
        <div className="flex flex-col gap-y-8 items-center">
          <Outlet />
        </div>
      </RootDocument>
    </AuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" data-project={currentProject.id}>
      <head>
        <HeadContent />
      </head>
      <body className={currentProject.backgroundColor}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
