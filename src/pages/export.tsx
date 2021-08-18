import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Preview } from '../components/Preview'

/**
 * Gets raw HTML from query param and prints it.
 */
function Export() {
  const router = useRouter()

  let html = router.query.c
  if (Array.isArray(html)) {
    html = html[0]
  } else if (!html) {
    html = ''
  }

  // TODO: print after iframe has fully rendered
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && html) {
  //     window.print()
  //   }
  // }, [html])

  return <Preview contentHtml={html} width="800px" m="0 auto" height="100vh" />
}

export default Export
