// Posts are markdown files in src/content/posts/. Each file needs
// frontmatter (title, category, date) followed by the post body.
//
// Example:
// ---
// title: My title
// category: career
// date: 2026-09-12
// ---
// The rest of the file is the post content, written in markdown.

const files = import.meta.glob('./content/posts/*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const [, frontmatter, content] = match
  const data = {}
  for (const line of frontmatter.split('\n')) {
    const i = line.indexOf(':')
    if (i === -1) continue
    const key = line.slice(0, i).trim()
    const value = line.slice(i + 1).trim()
    data[key] = value
  }
  return { data, content: content.trim() }
}

const posts = Object.entries(files).map(([path, raw]) => {
  const { data, content } = parseFrontmatter(raw)
  const slug = path.split('/').pop().replace(/\.md$/, '')
  return {
    id: slug,
    title: data.title || slug,
    category: data.category || '',
    date: data.date || '',
    content,
  }
})

export default posts
