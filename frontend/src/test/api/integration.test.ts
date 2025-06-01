import { describe, it, expect, beforeEach } from 'vitest'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

// Mock API client - adapt this to match your actual API client
const API_BASE_URL = '/api'

const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  },
  
  post: async (url: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  }
}

describe('API Integration Tests', () => {
  describe('Projects API', () => {
    it('fetches all projects', async () => {
      const projects = await apiClient.get('/projects/')
      
      expect(projects).toBeDefined()
      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)
      expect(projects[0]).toHaveProperty('title')
      expect(projects[0]).toHaveProperty('slug')
    })

    it('fetches published projects only', async () => {
      const projects = await apiClient.get('/projects/published/')
      
      expect(projects).toBeDefined()
      expect(Array.isArray(projects)).toBe(true)
      projects.forEach(project => {
        expect(project.status).toBe('published')
      })
    })

    it('fetches project by slug', async () => {
      const project = await apiClient.get('/projects/by-slug/?slug=test-project')
      
      expect(project).toBeDefined()
      expect(project.slug).toBe('test-project')
      expect(project.title).toBe('Test Project')
    })

    it('returns 404 for non-existent project slug', async () => {
      await expect(
        apiClient.get('/projects/by-slug/?slug=non-existent')
      ).rejects.toThrow('HTTP 404')
    })

    it('handles server errors gracefully', async () => {
      // Override handler for this test
      server.use(
        http.get('/api/projects/error/', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(
        apiClient.get('/projects/error/')
      ).rejects.toThrow('HTTP 500')
    })
  })

  describe('Journal API', () => {
    it('fetches all journal entries', async () => {
      const entries = await apiClient.get('/journal/')
      
      expect(entries).toBeDefined()
      expect(Array.isArray(entries)).toBe(true)
      expect(entries.length).toBeGreaterThan(0)
      expect(entries[0]).toHaveProperty('title')
      expect(entries[0]).toHaveProperty('excerpt')
    })

    it('fetches published journal entries', async () => {
      const entries = await apiClient.get('/journal/published/')
      
      expect(entries).toBeDefined()
      expect(Array.isArray(entries)).toBe(true)
      entries.forEach(entry => {
        expect(entry.status).toBe('published')
      })
    })

    it('fetches journal entry by slug', async () => {
      const entry = await apiClient.get('/journal/by-slug/?slug=test-journal-entry')
      
      expect(entry).toBeDefined()
      expect(entry.slug).toBe('test-journal-entry')
      expect(entry.title).toBe('Test Journal Entry')
    })
  })

  describe('Services API', () => {
    it('fetches all services', async () => {
      const services = await apiClient.get('/services/')
      
      expect(services).toBeDefined()
      expect(Array.isArray(services)).toBe(true)
      expect(services.length).toBeGreaterThan(0)
      expect(services[0]).toHaveProperty('title')
      expect(services[0]).toHaveProperty('description_rich_text')
    })

    it('fetches published services only', async () => {
      const services = await apiClient.get('/services/published/')
      
      expect(services).toBeDefined()
      expect(Array.isArray(services)).toBe(true)
      services.forEach(service => {
        expect(service.status).toBe('published')
      })
    })
  })

  describe('Contact API', () => {
    it('submits contact form successfully', async () => {
      const contactData = {
        email: 'test@example.com',
        name: 'Test User',
        message: 'This is a test message'
      }

      const response = await apiClient.post('/contact/', contactData)
      
      expect(response).toBeDefined()
      expect(response.message).toBe('Contact form submitted successfully')
    })

    it('validates contact form data', async () => {
      const invalidData = {
        name: 'Test User',
        message: 'Missing email'
      }

      await expect(
        apiClient.post('/contact/', invalidData)
      ).rejects.toThrow('HTTP 400')
    })
  })

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      // Override handler to simulate network error
      server.use(
        http.get('/api/projects/', () => {
          return HttpResponse.error()
        })
      )

      await expect(
        apiClient.get('/projects/')
      ).rejects.toThrow()
    })

    it('handles malformed JSON responses', async () => {
      server.use(
        http.get('/api/projects/', () => {
          return new HttpResponse('invalid json', {
            headers: { 'Content-Type': 'application/json' }
          })
        })
      )

      await expect(
        apiClient.get('/projects/')
      ).rejects.toThrow()
    })
  })

  describe('Rate Limiting', () => {
    it('handles rate limiting gracefully', async () => {
      server.use(
        http.get('/api/projects/', () => {
          return new HttpResponse(null, { 
            status: 429,
            headers: { 'Retry-After': '60' }
          })
        })
      )

      await expect(
        apiClient.get('/projects/')
      ).rejects.toThrow('HTTP 429')
    })
  })
})

describe('Data Validation Tests', () => {
  it('validates project data structure', async () => {
    const projects = await apiClient.get('/projects/')
    const project = projects[0]

    // Required fields
    expect(project).toHaveProperty('id')
    expect(project).toHaveProperty('title')
    expect(project).toHaveProperty('slug')
    expect(project).toHaveProperty('status')

    // Optional fields should be present or null
    expect(project.main_image === null || typeof project.main_image === 'object').toBe(true)
    expect(Array.isArray(project.tech_stack)).toBe(true)
    expect(Array.isArray(project.tags)).toBe(true)

    // URL validation if present
    if (project.live_url) {
      expect(project.live_url).toMatch(/^https?:\/\//)
    }
    if (project.repo_url) {
      expect(project.repo_url).toMatch(/^https?:\/\//)
    }
  })

  it('validates journal entry data structure', async () => {
    const entries = await apiClient.get('/journal/')
    const entry = entries[0]

    expect(entry).toHaveProperty('id')
    expect(entry).toHaveProperty('title')
    expect(entry).toHaveProperty('slug')
    expect(entry).toHaveProperty('excerpt')
    expect(entry).toHaveProperty('status')
    expect(entry).toHaveProperty('created_at')
    expect(entry).toHaveProperty('updated_at')

    // Date validation
    expect(new Date(entry.created_at).toString()).not.toBe('Invalid Date')
    expect(new Date(entry.updated_at).toString()).not.toBe('Invalid Date')
  })
})
