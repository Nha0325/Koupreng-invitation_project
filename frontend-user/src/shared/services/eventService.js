import client from '../api/client';

const MOCK =
  typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_USE_MOCK !== undefined
    ? import.meta.env.VITE_USE_MOCK === 'true'
    : true;

const SAMPLE_EVENT = {
  id: 'evt_panha_lyly',
  slug: 'panha-lyly',
  template: 'classic',
  groomName: 'Panha',
  brideName: 'Lyly',
  date: '2026-05-10T14:00:00+07:00',
  location: 'Sokha Hotel, Phnom Penh',
  story:
    'Two souls met under the monsoon rains of Phnom Penh and decided to walk through every season together.',
  coverImage: '/example/cover.jpg',
  gallery: [
    { src: '/example/g1.jpg', alt: 'Engagement portrait', w: 1600, h: 1067 },
    { src: '/example/g2.jpg', alt: 'Couple at sunset', w: 1600, h: 1067 },
    { src: '/example/g3.jpg', alt: 'Pre-wedding shoot', w: 1600, h: 1067 },
    { src: '/example/g4.jpg', alt: 'Khmer ceremony attire', w: 1600, h: 1067 },
  ],
  music: '/example/song.mp3',
  schedule: [
    { time: '08:00', event: 'Khmer traditional ceremony', location: 'Bride\'s home' },
    { time: '12:00', event: 'Lunch reception', location: 'Sokha Hotel' },
    { time: '17:30', event: 'Evening reception', location: 'Sokha Hotel ballroom' },
    { time: '20:00', event: 'First dance' },
  ],
  colors: {
    primary: '#7033ff',
    accent: '#c9a84c',
  },
};

/**
 * Build a defensive deep-clone of the mock so callers can mutate freely.
 * Avoids leaking shared mock state between components.
 */
function cloneSample() {
  return JSON.parse(JSON.stringify(SAMPLE_EVENT));
}

const eventService = {
  /**
   * GET `/events` — list events for the current user.
   *
   * @returns {Promise<object[]>}
   */
  async list() {
    if (MOCK) {
      return [cloneSample()];
    }
    const response = await client.get('/events');
    return response.data;
  },

  /**
   * GET `/events/:id` — fetch a single event by id.
   *
   * @param {string} id
   * @returns {Promise<object>}
   */
  async getById(id) {
    if (MOCK) {
      const sample = cloneSample();
      return { ...sample, id };
    }
    const response = await client.get(`/events/${id}`);
    return response.data;
  },

  /**
   * GET `/events/slug/:slug` — public lookup by slug, used by the
   * invitation route. Sets `config.public = true` so the request
   * interceptor skips the Authorization header.
   *
   * @param {string} slug
   * @returns {Promise<object>}
   */
  async getBySlug(slug) {
    if (MOCK) {
      const sample = cloneSample();
      return { ...sample, slug };
    }
    const response = await client.get(`/events/slug/${slug}`, { public: true });
    return response.data;
  },

  /**
   * POST `/events` — create a new event.
   *
   * @param {object} payload
   * @returns {Promise<object>}
   */
  async create(payload) {
    if (MOCK) {
      return { ...cloneSample(), ...payload, id: `evt_${Date.now()}` };
    }
    const response = await client.post('/events', payload);
    return response.data;
  },

  /**
   * PUT `/events/:id` — update an existing event.
   *
   * @param {string} id
   * @param {object} payload
   * @returns {Promise<object>}
   */
  async update(id, payload) {
    if (MOCK) {
      return { ...cloneSample(), ...payload, id };
    }
    const response = await client.put(`/events/${id}`, payload);
    return response.data;
  },

  /**
   * DELETE `/events/:id` — remove an event.
   *
   * @param {string} id
   * @returns {Promise<unknown>}
   */
  async remove(id) {
    if (MOCK) {
      return { id, deleted: true };
    }
    const response = await client.delete(`/events/${id}`);
    return response.data;
  },

  /**
   * POST `/events/:id/upload` — upload a cover/gallery image as
   * `multipart/form-data` under the `image` field.
   *
   * @param {string} id
   * @param {File | Blob} file
   * @returns {Promise<object>}
   */
  async uploadImage(id, file) {
    if (MOCK) {
      return {
        id,
        url: `/mock/uploads/${id}/${file?.name ?? 'image.jpg'}`,
      };
    }
    const formData = new FormData();
    formData.append('image', file);
    const response = await client.post(`/events/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * POST `/events/:id/music` — upload a background music track as
   * `multipart/form-data` under the `music` field.
   *
   * @param {string} id
   * @param {File | Blob} file
   * @returns {Promise<object>}
   */
  async uploadMusic(id, file) {
    if (MOCK) {
      return {
        id,
        url: `/mock/uploads/${id}/${file?.name ?? 'song.mp3'}`,
      };
    }
    const formData = new FormData();
    formData.append('music', file);
    const response = await client.post(`/events/${id}/music`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default eventService;
