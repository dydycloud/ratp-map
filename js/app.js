$(document).ready(function() {

	// Array of markers actually draw
	var markersArray = [];

	// Displays the Google Map
	var mapOptions = {
	    center: new google.maps.LatLng(48.85772, 2.33947),
	    zoom: 12
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),  mapOptions);


	// Gets all the lines.
	var lines = [];
	$.get('data/ratp.json', function(data) {
		lines = data;
		drawStopsOfAllLines();
	});


	// Handles the click on a menu item
	$("#menu a").click(function() {
		clearMarkers();

		var line = $(this).attr('data-line');

		if (line !== undefined && line != "all-stops") {
			drawStopsOfLine(line);
		}
		else {
			drawStopsOfAllLines();
		}
	});

	// Draws all lines
	function drawStopsOfAllLines() {
		for (var lineKey in lines) {
			drawStopsOfLine(lines[lineKey].line);
		}
	}

	// Draws a line
	function drawStopsOfLine(line) {
		var stops = [];
		var color;
		for (var lineKey in lines) {
			if (lines[lineKey].line == line) {
				stops = lines[lineKey].stops;
				color = lines[lineKey].color;
				break;
			}
		}

		for (var stopKey in stops) {
			drawStop(stops[stopKey], color);
		}
	}

	// Draws one marker based on the lat,lng and color line of the stop
	function drawStop(stopInfo, color) {
		var pinLatlng = new google.maps.LatLng(stopInfo.stop_lat,stopInfo.stop_lon);

	    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
	        new google.maps.Size(21, 34),
	        new google.maps.Point(0,0),
	        new google.maps.Point(10, 34));

		var marker = new google.maps.Marker({
		    position: pinLatlng,
		    map: map,
		    icon: pinImage,
		    title: stopInfo.stop_name
		});

		marker['infowindow'] = new google.maps.InfoWindow({
            content: stopInfo.stop_name + " - " + stopInfo.stop_desc
        });

	    google.maps.event.addListener(marker, 'click', function() {
	    	closeAllWindowMarkers();
	        this['infowindow'].open(map, this);
	    });

		markersArray.push(marker);
	}

	// Removes the markers from the map, empty the array
	function clearMarkers() {
		for (var i = 0; i < markersArray.length; i++) {
			markersArray[i].setMap(null);
		}
		markersArray = [];
	}

	// Closes all window markers actually open
	function closeAllWindowMarkers() {
		for (var i = 0; i < markersArray.length; i++) {
			markersArray[i].infowindow.close();
		}
	}
	
});
