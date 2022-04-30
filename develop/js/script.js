var forecastDays = 4;

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
    $("#city").empty();
    $("#forecast-cards").empty();
    fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            
            //Get current day
            var currentDay = $("<span>").text(" (" + dayjs().format("MM-DD-YY")+ ")");
            //Get City Name
            var locationName = data.name;

            //Get weather icon
            var iconCode = data.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var icon = $("<img>").attr("src", iconUrl);

            $("#city").append(locationName, currentDay, icon);

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

            //5-Day Forecast & UV Index API
            var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=5fe6d59403dd71cf4b6a5f04d6eead16";

            fetch(forecastUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    //UV Index for current weather
                    var uvIndex = data.current.uvi
                    $("#uv").append(uvIndex)
                    if (uvIndex <= 2) {
                        $("#uv").addClass("alert alert-success")         
                    }
                    else if (uvIndex >= 3 && uvIndex <= 5) {
                        $("#uv").addClass("alert alert-warning"); 
                    }
                    else {
                        $("#uv").addClass("alert alert-danger");
                    }
                    for (var i = 0; i <= forecastDays; i++) {
                        var divEl = $("<div>").addClass("three columns");
                        var cardDiv = $("<div>").addClass("card").css({"background-color": "#8cdf76"});
                        
                        var increaseDay = i + 1
                        var date = dayjs().add(increaseDay, 'day');
                        var dateForecast = dayjs(date).format("MM-DD-YY");

                        var iconCode = data.daily[i].weather[0].icon;
                        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                        var icon = $("<img>").attr("src", iconUrl);
                        var temp = data.daily[i].temp.day;
                        var wind = data.daily[i].wind_speed;
                        var humidity = data.daily[i].humidity;

                        var dateDisplay = $("<h5>").text(dateForecast);
                        var tempDisplay = $("<h6>").html("Temp: " + temp + "&#176;F");
                        var windDisplay = $("<h6>").html("Wind: " + wind + " MPH");
                        var humidtyDisplay = $("<h6>").html("Humidity: " + humidity + "%");

                        cardDiv.append(dateDisplay, icon, tempDisplay, windDisplay, humidtyDisplay);
                        divEl.append(cardDiv);
                        $("#forecast-cards").append(divEl);
                    }
                })
        });
}

$("#submit-city").on("click", start)