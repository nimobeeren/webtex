// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  docs: [
    { slug: 'index', frontmatter: { title: 'Getting Started' } },
    { slug: 'second-doc', frontmatter: { title: 'This is the Second Doc' } }
  ]
})
