import {
  Outlet,
} from 'react-router'

import {
  PublicFooter,
} from '../components/public/PublicFooter'

import {
  PublicHeader,
} from '../components/public/PublicHeader'

export function PublicLayout() {
  return (
    <div
      className="public-layout"
      data-testid="public-layout"
    >
      <PublicHeader />

      <main
        className="public-main"
        data-testid="public-main"
      >
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  )
}