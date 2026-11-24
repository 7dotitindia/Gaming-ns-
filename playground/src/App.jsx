import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { Explore, Categories } from './pages/Explore'
import AssetDetail from './pages/AssetDetail'
import { Login, Register } from './pages/Auth'
import { Static, NotFound } from './pages/Static'

// Heavier, less-visited areas are code-split.
const Studio = lazy(() => import('./pages/Studio'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Admin = lazy(() => import('./pages/Admin'))
const Tools = lazy(() => import('./pages/Tools'))
const Inspiration = lazy(() => import('./pages/Inspiration'))
const Community = lazy(() => import('./pages/Community'))
const Learn = lazy(() => import('./pages/Learn'))

const dash = (tab) => <Dashboard tab={tab} />

export default function App() {
  return (
    <Suspense fallback={<div className="grid h-[60vh] place-items-center text-sm text-mute">Loading…</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="categories" element={<Categories />} />
          <Route path="trending" element={<Explore preset="trending" />} />
          <Route path="free" element={<Explore preset="free" />} />
          <Route path="premium" element={<Explore preset="premium" />} />
          <Route path="assets/:cat" element={<Explore />} />
          <Route path="asset/:slug" element={<AssetDetail />} />

          <Route path="create" element={<Studio />} />
          <Route path="studio/:tool" element={<Studio />} />

          <Route path="inspiration" element={<Inspiration view="feed" />} />
          <Route path="shots/:slug" element={<Inspiration view="shot" />} />
          <Route path="collections" element={<Inspiration view="collections" />} />
          <Route path="collections/:slug" element={<Inspiration view="collection" />} />
          <Route path="creators/:username" element={<Inspiration view="creator" />} />
          <Route path="teams/:slug" element={<Inspiration view="team" />} />

          <Route path="tools" element={<Tools />} />
          <Route path="tools/:slug" element={<Tools />} />

          <Route path="learn" element={<Learn />} />
          <Route path="tutorials" element={<Learn kind="tutorials" />} />
          <Route path="gaming-resources" element={<Learn kind="resources" />} />
          <Route path="guides/:slug" element={<Learn />} />

          <Route path="community" element={<Community view="hub" />} />
          <Route path="challenges" element={<Community view="challenges" />} />
          <Route path="upload" element={<Community view="upload" />} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={dash('overview')} />
          <Route path="downloads" element={dash('downloads')} />
          <Route path="purchases" element={dash('purchases')} />
          <Route path="favorites" element={dash('favorites')} />
          <Route path="my-collections" element={dash('collections')} />
          <Route path="my-designs" element={dash('designs')} />
          <Route path="settings" element={dash('settings')} />
          <Route path="admin" element={<Admin />} />

          {['pricing', 'about', 'contact', 'licensing', 'advertise', 'privacy', 'terms'].map((p) => <Route key={p} path={p} element={<Static page={p} />} />)}
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
