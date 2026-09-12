import { useEffect, useState } from 'react'
import { marked } from 'marked'
import categories from './categories'
import posts from './posts'
import './App.css'

function PostList({ posts, openPostId, onTogglePost, categoryLabels }) {
  return posts.map((post, i) => (
    <div key={post.id} className="post-entry">
      <button className="post-line" onClick={() => onTogglePost(post)}>
        {i + 1}. {post.title} — {post.date}
        {categoryLabels && <span className="post-category"> ({categoryLabels[post.category]})</span>}
      </button>
      {openPostId === post.id && (
        <article className="post" dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }} />
      )}
    </div>
  ))
}

function App() {
  const [selected, setSelected] = useState(null) // subcategory id, or the category id itself if no subs
  const [openPostId, setOpenPostId] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  function selectCategory(cat) {
    if (!cat.subcategories) setSelected(cat.id)
    setOpenPostId(null)
  }

  function selectSubcategory(sub) {
    setSelected(sub.id)
    setOpenPostId(null)
  }

  function togglePost(post) {
    setOpenPostId(openPostId === post.id ? null : post.id)
  }

  function goHome() {
    setSelected(null)
    setOpenPostId(null)
  }

  const categoryLabels = Object.fromEntries(
    categories.flatMap((cat) => [
      [cat.id, cat.label],
      ...(cat.subcategories?.map((sub) => [sub.id, sub.label]) ?? []),
    ]),
  )

  const recentPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
  const visiblePosts = selected ? posts.filter((p) => p.category === selected) : []

  return (
    <div className="page">
      <button className="site-title" onClick={goHome}>
        My Blog
      </button>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        aria-pressed={theme === 'dark'}
      >
        <span className="theme-toggle-track">
          <span className="theme-toggle-thumb">
            <svg className="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <svg className="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </span>
        </span>
      </button>

      <nav className="top-nav">
        {categories.map((cat) => (
          <div key={cat.id} className="nav-column">
            <button
              className={`category-line ${selected === cat.id ? 'active' : ''}`}
              onClick={() => selectCategory(cat)}
            >
              {cat.label}
            </button>
            {cat.subcategories && (
              <div className="subcategories">
                {cat.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    className={`sub-line ${selected === sub.id ? 'active' : ''}`}
                    onClick={() => selectSubcategory(sub)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <main className="content">
        {selected === null && (
          <>
            <h2 className="section-title">Recent Posts</h2>
            {recentPosts.length === 0 && <p className="hint">No posts yet.</p>}
            <PostList
              posts={recentPosts}
              openPostId={openPostId}
              onTogglePost={togglePost}
              categoryLabels={categoryLabels}
            />
          </>
        )}
        {selected !== null && (
          <>
            {visiblePosts.length === 0 && <p className="hint">No posts yet.</p>}
            <PostList posts={visiblePosts} openPostId={openPostId} onTogglePost={togglePost} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
