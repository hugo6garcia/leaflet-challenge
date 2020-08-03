// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3
    //layers: [streetmap, earthquakes]
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/light-v10",
      accessToken: ""
    }).addTo(myMap);


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
    //createFeatures(data.features);
  //console.log(data.features);

  for (var i = 0; i < data.features.length; i++) {

    // Determinate lat lng for each event
    var location = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]];
    console.log(location);

    // Determine magnitude, type, place, and time of each event
    var mag = data.features[i].properties.mag;
    var eventType = data.features[i].properties.type;
    var eventPlace = data.features[i].properties.place;
    var eventTime = data.features[i].properties.time;

    // Determine the color of the circle
    if (mag < 1) {
        color = "#B7F34D";
    }
    else if (mag < 2) {
        color = "#E1F34D";
    }
    else if (mag < 3) {
        color = "#F3DC4D";
    }
    else if (mag < 4) {
        color = "#F3BA4C";
    }
    else if (mag < 5) {
        color = "#F1A76A";
    }
    else {
        color = "#F06A6A";
    };
  
    // Add circles to map
    L.circleMarker(location, {
      fillOpacity: 0.75,
      color: "black",
      fillColor: color,
      // Adjust radius
      radius: mag * 5,
      weight: 1
    }).bindPopup("<h2>" + mag + " magnitude "+ eventType + "</h2><h3>" + eventPlace +
    "</h3><hr><p>" + new Date(eventTime) + "</p>").addTo(myMap);
  };

});

function getColor(m) {
    return m > 5 ? '#F06A6A' :
           m > 4 ? '#F1A76A' :
           m > 3 ? '#F3BA4C' :
           m > 2 ? '#F3DC4D' :
           m > 1 ? '#E1F34D' :
                    '#B7F34D';
};

// Create a legend
var legend = L.control({position: 'bottomright'});

// Populate the legend
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);