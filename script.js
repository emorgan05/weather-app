$(document).ready(function() {
  var url = "https://api.darksky.net/forecast/e7522759282f3ef892f854a38a7ef757/";
  var latitude = null;
  var longitude = null;
  $icon = $("#icon");
  $currentTemp = $("#currentTemp");
  $currentCond = $("#currentCond");
  $currentWind = $("#currentWind");
  $forecast = $("#forecast");
  
  
  // use geolocation to get the current position
  function getLocation() {
    var geolocation = navigator.geolocation;
    geolocation.getCurrentPosition(showLocation);
  }
  
  function showLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    darkSky(latitude, longitude);
  }
  
  getLocation();
  
  // make the Dark Sky function 
  function darkSky(latitude, longitude) {
    url = url + latitude + "," + longitude + "?exclude=minutely,hourly,alerts";
    
    // make the ajax call to Dark Sky for weather info
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'jsonp',
      success: function(response) {
        // include Skycons
        var skycons = new Skycons({"color": "black"});
        var icon = response.currently.icon;
        skycons.add("iconBig", icon);
        skycons.play();
        
        // get current conditions
        var farenheit = Math.round(response.currently.temperature);
        $currentTemp.append(farenheit + " F");
        $currentCond.append(response.currently.summary);
        $currentWind.append(Math.round(response.currently.windSpeed) + " mph");
        
        // get weekly forecast
        var result = response.daily.data;
        
        for(var i = 0; i < 5; i++) {
          var uniqueid = 'iconForecast' + i;
          $forecast.append(
            "<div class='box'><canvas id=" + uniqueid + " width='28' height='28'></canvas><br>" + Math.round(result[i].temperatureMax) 
            + "<br>" + Math.round(result[i].temperatureMin) 
            + "</div>"
          );
          skycons.add(uniqueid, result[i].icon);
          skycons.play();
        }
      
        //change F and C
        var units = response.flags.units;
        
        $(document).on("click", ".btn", function() {
          if (units === "us") {
            $currentTemp.html("");
            var celsius = Math.round((farenheit - 32)/1.8);
            $currentTemp.append(celsius + " C");
            units = "si";
          } else {
            $currentTemp.html("");
            $currentTemp.append(farenheit + " F");
            units = "us";
          }
        });
      }
    });
  }
});

