// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Route, Router, Set } from '@redwoodjs/router'
import DocsLayout from './layouts/DocsLayout/DocsLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={DocsLayout}>
        <Route path="/docs" page={DocsPage} name="docsIndex" />
        <Route path="/docs/{slug}" page={DocsPage} name="docs" />
      </Set>
      <Route path="/" page={EditorPage} name="editor" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
