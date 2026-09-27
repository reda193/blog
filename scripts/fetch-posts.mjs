import { mkdir, writeFile } from 'node:fs/promises'
import { loadEnv } from 'vite'

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')
const API_URL = env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set')

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} returned ${res.status}`)
  return res.json()
}

const list = await getJSON(`${API_URL}/posts`)
const posts = await Promise.all(
  list.map(async (p) => {
    const full = await getJSON(`${API_URL}/posts/${p.id}`)
    return {
      id: String(full.id),
      title: full.title,
      category: full.category,
      date: full.published_on,
      content: full.body,
    }
  }),
)

await mkdir('src/generated', { recursive: true })
await writeFile('src/generated/posts.json', JSON.stringify(posts))
console.log(`Fetched ${posts.length} posts`)