import CONFIG from '../config';
import { getAccessToken } from './auth-api';

const ENDPOINTS = {
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export class StoryApi {
  constructor(baseUrl = CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getAllStories({ page = 1, size = 10, token, location = 1 }) {
    const url = `${this.baseUrl}/stories?page=${page}&size=${size}&location=${location}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }

    return result;
  }

  async getStoryById({ id, token }) {
    const url = `${this.baseUrl}/stories/${id}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }

    return result;
  }

  async addStory({ token, description, photo, lat = null, lon = null }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);

    if (lat !== null && lon !== null) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch(`${this.baseUrl}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }

    return result;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
