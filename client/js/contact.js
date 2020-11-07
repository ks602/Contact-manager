let map = null;
let service = null;
let directionService = null;
let directionsRenderer = null;
let contacts = null;
let markers = [];
let dropDown = null;

window.onload = () => {
  init();
  document.getElementById("greet").innerHTML = "<b>Welcome " + window.localStorage.getItem('user') + "!</b>";
}

async function init() {
  await initContacts();
  initMap();
  displayContactAddress();
  addListeners();
}

function addListeners() {
  //search google map with info provided
  let mapSearchFrom = document.getElementById("mapSearchForm");
  let routeSearchFrom = document.getElementById("routeSearchForm");
  dropDown = document.getElementById("mapDropDown");

  mapSearchFrom.addEventListener("submit", mapSearch);
  routeSearchFrom.addEventListener("submit", routeSearch);
  dropDown.onchange = () => {
    if (dropDown.selectedIndex == 4) document.getElementById("other").disabled = false
    else document.getElementById("other").disabled = true;
  };
}

async function initContacts() {
  const res = await fetch("../../contacts");
  contacts = await res.json();

  tbody = document.getElementById("contactTable").children[1];
  contacts.forEach(contact => {
    html = "<tr><td>" + contact["contact_name"] + "</td><td>" + contact[
        "contact_email"] + "</td><td>" + contact["contact_address"] +
      "</td><td>" + contact["contact_phone"] + "</td><td><a href='" + contact["contact_favoriteplaceurl"] + "'>" +
      contact["contact_favoriteplace"] + "</a></td></tr>";
    tbody.innerHTML += html;
  });

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

//fetch address from html
function fetchAddress() {
  let result = [];
  let table = document.getElementById("contactTable");
  let numTags = table.children[0].childElementCount;
  for (let i = 1; i < numTags; ++i) {
    result.push(table.children[0].children[i].children[2].textContent);
    console.log(table.children[0].children[i].children[2].textContent);
  }
  return result;
}

function displayContactAddress() {
  let addresses = [];
  contacts.forEach(contact => addresses.push(contact["contact_address"]));
  let icon = {
    url: "./../icons/home.png",
    scaledSize: new google.maps.Size(30, 30)
  };
  for (i = 0; i < addresses.length; ++i) {
    request = {
      query: addresses[i],
      fields: ["name", "geometry"]
    };
    service.findPlaceFromQuery(request, results => {
      if (results != null) {
        addMarker(results[0].geometry.location, results[0].name, icon);
      }
    })
  }
}

function attachInfoWindow(name) {
  google.maps.event.addListener(marker, 'click', function (e) {
    infowindow.setContent(name)
    infowindow.open(map, this);
  });
}

function addMarker(position, name, icon) {
  marker = new google.maps.Marker({
    map: map,
    position: position,
    icon: icon
  });
  markers.push(marker);
  attachInfoWindow(name);
}

function clearMarkers() {
  if (markers.length > 0)
    markers.forEach(element => {
      element.setMap(null);
    });
  markers = [];
}

function processLocations(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      addMarker(place.geometry.location, place.name, "");
    }
  }
}

function mapSearch(e) {
  e.preventDefault();
  clearMarkers();
  let type = dropDown.options[dropDown.selectedIndex].value;
  let radius = document.getElementById("radius").value;

  //get latitude and longitude from the user
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition((pos) => {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      currentLocation = new google.maps.LatLng(lat, lng);
      if (type != "Other") {
        let request = {
          location: currentLocation,
          radius: radius,
          type: [type]
        };
        service.nearbySearch(request, processLocations);
      } else {
        let request = {
          location: currentLocation,
          radius: parseInt(radius),
          query: document.getElementById("other").value
        }
        console.log(lat, lng);
        console.log(request);
        service.textSearch(request, processLocations);
      }
    });
}

function routeSearch(e) {
  clearMarkers();
  e.preventDefault();
  let startAddress = document.getElementById("startAddress");
  let start = startAddress.value;
  let destination = document.getElementById("destination");
  let end = destination.value;
  let travelMode = null;
  let buttons = document.getElementsByName("Go");
  for (i = 0; i < buttons.length; ++i) {
    if (buttons[i].checked) {
      travelMode = buttons[i].value
      break;
    }
  }

  directionService.route({
    origin: start,
    destination: end,
    travelMode: travelMode
  }, function (response, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(response);
      document.getElementById("panel").style.display = "block";
      document.getElementById("map").style.width = "500px";
      console.log(response);
    } else
      alert("Failed");
  });
}