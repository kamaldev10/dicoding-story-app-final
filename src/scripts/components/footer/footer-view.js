export const footerView = {
  containerId: "footer",

  render(data) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = this._template(data);
    this.afterRender();
  },

  clear() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = "";
    }
  },

  _template(data) {
    const socialLinksHtml = data.socialLinks
      .map(
        (social) => `
      <a href="${social.url}" target="_blank" rel="noopener" class="hover:text-blue-400 transition duration-300">
        <i class="${social.icon} text-xl"></i>
      </a>`
      )
      .join("");

    const bottomLinksHtml = data.links
      .map(
        (link) => `
      <li>
        <a href="${link.url}" class="text-gray-400 hover:text-white transition duration-300">${link.text}</a>
      </li>`
      )
      .join("");

    return `
    <footer class="bg-gray-800 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-6 md:mb-0">
            <h1 class="text-2xl font-bold">${data.appName}</h1>
            <p class="mt-2 text-gray-400">${data.tagline}</p>
          </div>
          <div class="flex space-x-6">
            ${socialLinksHtml}
          </div>
        </div>
        <hr class="border-gray-700 my-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400">© ${data.year} ${data.appName}. All rights reserved.</p>
          <div class="mt-4 md:mt-0">
            <ul class="flex space-x-6">
              ${bottomLinksHtml}
            </ul>
          </div>
        </div>
      </div>
    </footer>
    `;
  },

  afterRender() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      const targetId = anchor.getAttribute("href");
      const excluded = ["/about", "/"];

      if (excluded.includes(targetId)) return;

      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          window.scrollTo({ top: targetEl.offsetTop, behavior: "smooth" });
        }
      });
    });
  },
};
