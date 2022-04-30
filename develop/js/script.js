var forecastDays = 5;

function start(e) {
    e.preventDefault();
    var cityName = $("#search-city").val();
    if (cityName) {
        console.log(cityName);
        getApi(cityName)
    }
    else {
        
    }
}
function getApi(city) {
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=5fe6d59403dd71cf4b6a5f04d6eead16";

    fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            //Get City Name
            var locationName = data.name;

            //Get weather icon
            var iconCode = data.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var icon = $("<img>").attr("src", iconUrl);

            $("#city").append(locationName, icon);

            //Get Temperature
            var temperature = data.main.temp;
            var temp = $("<span>").html(temperature + "&#176;F")
            $("#temp").append(temp);

            //Get wind speed
            var wind = data.wind.speed
            $("#wind").append(wind + " MPH");

            //Get Humidity
            var humid = data.main.humidity;
            $("#humidity").append(humid + "%");

            //5-Day Forecast 
            var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=5fe6d59403dd71cf4b6a5f04d6eead16";

            fetch(forecastUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    
                    for (var i = 1; i <= forecastDays; i++) {
                        var divEl = $("<div>").addClass("three columns");
                        var cardDiv = $("<div>").addClass("card");

                        
                        divEl.append(cardDiv);
                        $("#forecast-cards").append(divEl);
                    }
                })
        });
}

$("#submit-city").on("click", start)