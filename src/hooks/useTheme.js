import { useCallback, useEffect, useState } from 'react'

const KEY = 'kxn-theme'

/**
 * Dark/light theme toggle. The initial class is applied by a tiny inline
 * script in index.html (to avoid a flash); here we keep React in sync and
 * persist the user's explicit choice.
 */
export function useTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', dark)
    localStorage.setItem(KEY, dark ? 'dark' : 'light')
  }, [dark])

  const toggle = useCallback(() => setDark((d) => !d), [])

  return { dark, toggle }
}
