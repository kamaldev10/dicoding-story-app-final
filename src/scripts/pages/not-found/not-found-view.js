const notFoundView = {
  async render() {
    const imageUrl = '/images/notFound.jpg';

    return `
      <section class="container mx-auto px-4 py-16 text-center min-h-screen flex flex-col justify-center items-center">
        <img src="${imageUrl}" alt="Page Not Found" class="max-w-xs sm:max-w-xs md:max-w-xs mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Oops! Halaman Tidak Ditemukan</h1>
        <p class="text-gray-600 mb-8 max-w-md">
          Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
        </p>
        <a href="#/" 
           class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
          <i class="fas fa-home mr-2"></i>Kembali ke Homepage
        </a>
      </section>
    `;
  },

  async afterRender() {
    console.log('NotFoundView: afterRender executed.');
  },
};

export default notFoundView;
