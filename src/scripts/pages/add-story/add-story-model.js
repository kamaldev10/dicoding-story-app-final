import { StoryApi } from '../../data/story-api';

export class AddStoryModel {
  constructor() {
    this.storyApi = new StoryApi();
  }

  async submitStory({ token, description, photo, lat, lon }) {
    try {
      const result = await this.storyApi.addStory({
        token,
        description,
        photo,
        lat,
        lon,
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  validateStoryData({ description, photo }) {
    const errors = [];

    if (!description || description.trim() === '') {
      errors.push('Deskripsi tidak boleh kosong.');
    }

    if (!photo) {
      errors.push('Foto harus diisi.');
    }

    if (photo && photo.size > 1024 * 1024) {
      errors.push('Ukuran gambar maksimal 1MB.');
    }

    return {
      isValid: !errors.length,
      errors,
    };
  }

  getUserToken() {
    return localStorage.getItem('authToken');
  }

  isUserAuthenticated() {
    return !!this.getUserToken();
  }
}
