import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadContent } from '../lib/contentLoader.js'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', content: null })

  useEffect(() => {
    let alive = true
    loadContent()
      .then((content) => alive && setState({ status: 'ready', content }))
      .catch((error) => {
        console.error('[content] Unexpected loading failure:', error)
        if (alive) setState({ status: 'error', error })
      })
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      getProject: (id) => state.content?.projects?.find((p) => p.id === id) ?? null,
    }),
    [state],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>')
  return ctx
}
