import { http, HttpResponse } from 'msw'

// Mock data
const mockProjects = [
  {
    id: 1,
    title: 'Test Project',
    slug: 'test-project',
    description: 'A test project description',
    long_description_html: '<p>Long description</p>',
    status: 'published',
    category: 'Web Development',
    year: '2023',
    tech_stack: ['React', 'TypeScript', 'Vite'],
    tags: ['frontend', 'portfolio'],
    live_url: 'https://example.com',
    repo_url: 'https://github.com/example/test',
    main_image: {
      id: 1,
      title: 'Project Image',
      file: '/media/project.jpg'
    },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
]

const mockJournalEntries = [
  {
    id: 1,
    title: 'Test Journal Entry',
    slug: 'test-journal-entry',
    excerpt: 'A test journal entry excerpt',
    content_rich_text: '<p>Journal content</p>',
    status: 'published',
    tags: ['development', 'thoughts'],
    featured_image: {
      id: 2,
      title: 'Journal Image',
      file: '/media/journal.jpg'
    },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
]

const mockServices = [
  {
    id: 1,
    title: 'Web Development',
    description_rich_text: '<p>Professional web development services</p>',
    icon_svg: '<svg>...</svg>',
    status: 'published',
    featured_image: {
      id: 3,
      title: 'Service Image',
      file: '/media/service.jpg'
    },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
]

export const handlers = [
  // Projects
  http.get('/api/projects/', () => {
    return HttpResponse.json(mockProjects)
  }),

  http.get('/api/projects/published/', () => {
    return HttpResponse.json(mockProjects.filter(p => p.status === 'published'))
  }),

  http.get('/api/projects/by-slug/', ({ request }) => {
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')
    const project = mockProjects.find(p => p.slug === slug)
    
    if (!project) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(project)
  }),

  http.get('/api/projects/:id/', ({ params }) => {
    const project = mockProjects.find(p => p.id === Number(params.id))
    
    if (!project) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(project)
  }),

  // Journal Entries
  http.get('/api/journal/', () => {
    return HttpResponse.json(mockJournalEntries)
  }),

  http.get('/api/journal/published/', () => {
    return HttpResponse.json(mockJournalEntries.filter(j => j.status === 'published'))
  }),

  http.get('/api/journal/by-slug/', ({ request }) => {
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')
    const entry = mockJournalEntries.find(j => j.slug === slug)
    
    if (!entry) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(entry)
  }),

  // Services
  http.get('/api/services/', () => {
    return HttpResponse.json(mockServices)
  }),

  http.get('/api/services/published/', () => {
    return HttpResponse.json(mockServices.filter(s => s.status === 'published'))
  }),

  // Error handlers for testing error states
  http.get('/api/projects/error/', () => {
    return new HttpResponse(null, { status: 500 })
  }),

  // Contact form
  http.post('/api/contact/', async ({ request }) => {
    const body = await request.json()
    
    if (!body || !body.email) {
      return new HttpResponse('Invalid data', { status: 400 })
    }
    
    return HttpResponse.json({ message: 'Contact form submitted successfully' })
  }),
]
