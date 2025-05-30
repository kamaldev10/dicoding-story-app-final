// File: add-story-view.js

export class AddStoryView {
  constructor() {
    this.form = document.getElementById("add-story-form");
    this.errorMessage = document.getElementById("error-message");
    this.loading = document.getElementById("loading");
    this.backButton = document.getElementById("back-button");
    this.video = document.getElementById("camera-stream");
    this.canvas = document.getElementById("photo-canvas");
    this.captureBtn = document.getElementById("capture-btn");
    this.photoInput = document.getElementById("photo-input");
    this.previewImg = document.getElementById("photo-preview");
    this.recaptureBtn = document.getElementById("recapture-btn");
    this.textArea = document.getElementById("text-area");
    this.latInput = document.querySelector('input[name="lat"]');
    this.lonInput = document.querySelector('input[name="lon"]');
  }

  showLoading() {
    this.loading.classList.remove("hidden");
  }

  hideLoading() {
    this.loading.classList.add("hidden");
  }

  showError(msg) {
    this.errorMessage.textContent = msg;
  }

  focusTextArea() {
    this.textArea.focus();
  }

  resetForm() {
    this.form.reset();
    this.errorMessage.textContent = "";
    this.previewImg.src = "";
    this.previewImg.classList.add("hidden");
    this.video.classList.remove("hidden");
    this.recaptureBtn.classList.add("hidden");
    this.captureBtn.classList.remove("hidden");
  }
}
