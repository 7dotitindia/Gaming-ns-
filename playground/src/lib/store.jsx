import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

// Small persisted hook — localStorage stands in for the backend (Supabase) in this prototype.
export function usePersist(key, initial) {
  const [v, setV] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial } catch { return initial }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, setV]
}

export function AppProvider({ children }) {
  const [user, setUser] = usePersist('pg.user', null)
  const [favorites, setFavorites] = usePersist('pg.favs', [])
  const [downloads, setDownloads] = usePersist('pg.downloads', [])
  const [follows, setFollows] = usePersist('pg.follows', [])
  const [likes, setLikes] = usePersist('pg.likes', [])
  const [designs, setDesigns] = usePersist('pg.designs', [])
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, kind = 'ok') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, msg, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const toggle = (setter, list, id) => setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  const value = useMemo(() => ({
    user, toasts, toast, favorites, downloads, follows, likes, designs, setDesigns,
    login: (u) => { setUser(u); toast(`Welcome, ${u.name}`) },
    logout: () => { setUser(null); toast('Signed out') },
    updateUser: (p) => setUser({ ...user, ...p }),
    // Returns false when login is required so the caller can redirect.
    requireAuth: () => !!user,
    toggleFav: (slug) => { toggle(setFavorites, favorites, slug); toast(favorites.includes(slug) ? 'Removed from favorites' : 'Saved to favorites') },
    toggleFollow: (u) => { toggle(setFollows, follows, u); toast(follows.includes(u) ? 'Unfollowed' : 'Following') },
    toggleLike: (s) => toggle(setLikes, likes, s),
    recordDownload: (asset) => {
      setDownloads([{ slug: asset.slug, at: new Date().toISOString(), price: asset.price }, ...downloads])
      toast(`${asset.title} added to Downloads`)
    },
  }), [user, toasts, favorites, downloads, follows, likes, designs]) // eslint-disable-line

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
