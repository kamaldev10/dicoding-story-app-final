class AboutView {
  constructor() {
    this.container = document.createElement('div');
  }

  render(data) {
    this.container.innerHTML = `
      <section class="py-16 bg-white" id="about">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h1 class="text-3xl font-bold text-gray-800">About Me</h1>
            <div class="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
            <p class="text-gray-600 max-w-2xl mx-auto">Get to know the person behind the application.</p>
          </div>
          
          <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 mb-8 md:mb-0">
              <div class="relative p-2 rounded-md bg-gray-500">
                <img src="images/foto-profil.jpg" alt="About Me" class="relative rounded-lg shadow-lg z-10">
              </div>
            </div>
            <div class="md:w-1/2 md:pl-12">
              <p class="text-gray-700 mb-4 leading-relaxed">${data.bio}</p>
              <div class="grid grid-cols-2 gap-4 mt-6">
                ${data.skills
                  .map(
                    (skill) => `
                      <div class="flex items-center">
                        <div class="bg-blue-100 p-3 rounded-full mr-3">
                          <i class="fas fa-code text-blue-600"></i>
                        </div>
                        <div>
                          <h4 class="font-medium text-gray-800">${skill.title}</h4>
                          <p class="text-sm text-gray-600">${skill.description}</p>
                        </div>
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getContainer() {
    return this.container;
  }
}

export default AboutView;
