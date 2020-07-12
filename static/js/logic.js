// Store our API endpoint inside queryUrl
var earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(earthquakesUrl, function(quakesData) {
  createFeatures(quakesData.features);
})

function createFeatures(earthquakesData){
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>Location: " + feature.properties.place + "</h2><hr><h3>Magnitude: " + feature.properties.mag + "</h3><hr><p>Date: " + new Date(feature.properties.time) + "</p>")
  }
  var earthquakes = L.geoJSON(earthquakesData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker (latlng, {
        radius: feature.properties.mag * 10,
        fillColor: colorQuake(feature.properties.mag),
        weight: 0.5,
        color: "#000000",
        fillOpacity: 0.75
      });
    }
  });
  d3.json(platesUrl, function(platesData){
    var plates = L.geoJSON(platesData.features,{
      style:{
        color: "#ff0000"
      }
    });
    createMap(earthquakes, plates);
  });
};

function createMap(earthquakes, plates) {
  var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
  });
  var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
  });
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-v9",
  accessToken: API_KEY
  });
  var baseLayers = {
    "Dark": darkMap,
    "Street": streetMap,
    "Satellite": satelliteMap
  };

  var overlays = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": plates
  };

  var map = L.map('map', {
    center: [40, -99],
    zoom: 4.3,
    layers: [darkMap, earthquakes, plates]
  });

  L.control.layers(baseLayers, overlays, {
    collapsed: true
  }).addTo(map);

  var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      labels = ['0-1','1-2','2-3','3-4','4-5','5+'],
      categories = ["#00cc00","#99ff33","#ffff00","#ff9933","#ff6600","#cc0000"];
      for (var i = 0; i < categories.length; i++) {
        div.innerHTML += 
          '<i class="circle" style="background:' + categories[i] + '"></i>' +
          (labels[i] ? labels[i] + "<br>": '+');
      }
    return div;
  };

legend.addTo(map);
};

function colorQuake(magnitude){
  if (magnitude <= 1) {
    return("#00cc00")
  }
  else if (magnitude > 1 && magnitude <= 2) {
    return("#99ff33")
  }
  else if (magnitude > 2 && magnitude <= 3) {
    return("#ffff00")
  }
  else if (magnitude > 3 && magnitude <= 4) {
    return("#ff9933")
  }
  else if (magnitude > 4 && magnitude <= 5) {
    return("#ff6600")
  }
  else if (magnitude > 5) {
    return("#cc0000")
  }
}
