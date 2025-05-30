import Database from '../../data/database';

// src/scripts/pages/saved-stories/saved-stories-presenter.js

export class SavedStoriesPresenter {
  constructor(view) {
    this._view = view;
    this._database = Database; // Gunakan instance Database yang sudah diimpor
  }

  async loadSavedStories() {
    this._view.showLoading();
    try {
      const stories = await this._database.getAllStories();
      this._view.renderStories(stories, this._handleUnsaveStory.bind(this));
    } catch (error) {
      console.error('Error loading saved stories:', error);
      this._view.showError('Failed to load saved stories.');
    } finally {
      this._view.hideLoading();
    }
  }

  async _handleUnsaveStory(storyId) {
    try {
      await this._database.removeStory(storyId);
      this._view.showActionNotification('Success', 'Story has been unsaved.', 'success');
      // Cara 1: Reload semua cerita (lebih simpel)
      // await this.loadSavedStories();
      // Cara 2: Hapus dari DOM (lebih responsif)
      this._view.removeStoryFromDOM(storyId);
    } catch (error) {
      console.error('Error unsaving story:', error);
      this._view.showActionNotification('Error', 'Failed to unsave story.', 'error');
    }
  }
}
