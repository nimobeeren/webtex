import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const DocsPage = () => {
  return (
    <>
      <MetaTags title="Docs" description="Docs page" />

      <h1>DocsPage</h1>
      <p>
        Find me in <code>./web/src/pages/DocsPage/DocsPage.tsx</code>
      </p>
      <p>
        My default route is named <code>docs</code>, link to me with `
        <Link to={routes.docs()}>Docs</Link>`
      </p>
    </>
  )
}

export default DocsPage
