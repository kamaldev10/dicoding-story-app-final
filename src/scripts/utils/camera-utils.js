export const CameraUtils = {
  stream: null, // <--- penting

  async startCamera(videoElement) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      await videoElement.play();
      this.stream = stream;
    } catch (error) {
      throw new Error("Tidak dapat mengakses kamera.");
    }
  },

  stopCamera() {
    if (this.stream && this.stream.getTracks) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
      return;
    }
  },

  capturePhoto({
    videoEl,
    canvasEl,
    previewImgEl,
    photoInputEl,
    captureBtn,
    recaptureBtn,
  }) {
    const ctx = canvasEl.getContext("2d");
    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    ctx.drawImage(videoEl, 0, 0);

    canvasEl.toBlob((blob) => {
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      photoInputEl.files = dataTransfer.files;

      previewImgEl.src = URL.createObjectURL(blob);
      previewImgEl.classList.remove("hidden");
      videoEl.classList.add("hidden");
      captureBtn.classList.add("hidden");
      recaptureBtn.classList.remove("hidden");
    });
  },

  resetCapture({
    videoEl,
    previewImgEl,
    photoInputEl,
    captureBtn,
    recaptureBtn,
  }) {
    previewImgEl.src = "";
    previewImgEl.classList.add("hidden");
    videoEl.classList.remove("hidden");
    photoInputEl.value = "";
    captureBtn.classList.remove("hidden");
    recaptureBtn.classList.add("hidden");
  },
};
