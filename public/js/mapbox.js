/* eslint-disable */

const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
  "pk.eyJ1Ijoib3Vzc2FtYWVubmFkYWZ5IiwiYSI6ImNta3M4ZHJleTE3NmUzZXNlbWdxbjRvajIifQ.i6hH-ZmA2ERMuZunQXhFqw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/oussamaennadafy/cmks9etop001q01shbj1cers9",
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // create marker
  const el = document.createElement("div");
  el.className = "marker";

  // add marker
  new mapboxgl.Marker({
    lement: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // add popup
  new mapboxgl.Popup({ offset: 40 })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // extend the map bounds to include the current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
