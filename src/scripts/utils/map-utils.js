export const MapUtils = {
  initMap({ mapContainerId, latInput, lonInput }) {
    const mapEl = document.getElementById(mapContainerId);
    const map = L.map(mapEl).setView([-6.2, 106.8], 13);
    let marker = null;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
      latInput.value = lat;
      lonInput.value = lng;
    });

    return map;
  },
};
