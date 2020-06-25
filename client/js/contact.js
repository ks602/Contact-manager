let map = null;
let service = null;
let directionService = null;
let directionsRenderer = null;

init();

async function init() {
  initContacts();
  initMap();
  displayContactAddress();
}

function initContacts() {
  fetch("../../contacts")
    .then(response => {
      return response.json();
    })
    .then(contacts => {
      tbody = document.getElementById("contactTable").children[1];
      contacts.forEach(contact => {
        html = "<tr><td>" + contact["contact_name"] + "</td><td>" + contact[
            "contact_email"] + "</td><td>" + contact["contact_address"] +
          "</td><td>" + contact["contact_phone"] + "</td><td><a href='" + contact["contact_favoriteplaceurl"] + "'>" +
          contact["contact_favoriteplace"] + "</a></td></tr>";
        tbody.innerHTML += html;
      });
    })
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 22.3545999,
      lng: 113.9951743
    },
    zoom: 10
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      currentLocation = new google.maps.LatLng(lat, lng);
      map.setCenter(currentLocation);
      map.setZoom(14);
    });
  }
  infowindow = new google.maps.InfoWindow();
  initAutoComplete();
  service = new google.maps.places.PlacesService(map);
  directionService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("panel"));
}

function initAutoComplete() {
  let startInput = document.getElementById("startAddress");
  let autoCompleteStart = new google.maps.places.Autocomplete(startInput);
  let endInput = document.getElementById("destination");
  let autoCompleteend = new google.maps.places.Autocomplete(endInput);
}

function displayContactAddress() {

}

document.getElementById("greet").innerHTML = "<b>Welcome " + window.localStorage.getItem('user') + "!</b>";