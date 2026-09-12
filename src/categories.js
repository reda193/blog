// The 3 top-level categories, with optional subcategories.
const categories = [
  {
    id: 'career',
    label: 'My Career Learnings',
  },
  {
    id: 'individual',
    label: 'My Individual Learnings',
    subcategories: [
      { id: 'individual-education', label: 'Education' },
      { id: 'individual-personal', label: 'Personal' },
    ],
  },
  {
    id: 'media',
    label: 'My Media Learnings',
    subcategories: [{ id: 'media-movies-tv', label: 'Movies/TV' }],
  },
]

export default categories
