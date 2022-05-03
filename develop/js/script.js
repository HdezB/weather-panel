var forecastDays = 4;
var savedCities = JSON.parse(localStorage.getItem("citiesArray")) || []

// Start() displays all the previous city searches when the page loads.
function start() {
    if (savedCities) {
        if (savedCities.length <= 5) {
            for (var i = 0; i < savedCities.length; i++) {
                var listEl = $("<li>").addClass("searched-cities-list-item").text(savedCities[i]);
                $("#searched-cities-list").prepend(listEl);
            }
        }
        else {
            for (var i = savedCities.length - 5; i < savedCities.length; i++) {
                var listEl = $("<li>").addClass("searched-cities-list-item").text(savedCities[i]);
                $("#searched-cities-list").prepend(listEl);
            }
        }
    }
    getApi(savedCities[savedCities.length - 1]);
}

//SubmitCity() gets the value of the user input when the search button is clicked, it stores that value in the local storage and calls getApi() with a paramater
// that has the value of the user Input. 
function submitCity(e) {
    e.preventDefault();
    var cityName = $("#search-city").val();

    if (cityName) {

        newCities = cityName;

        savedCities.push(newCities);
        localStorage.setItem("citiesArray", JSON.stringify(savedCities));
        var listEl = $("<li>").addClass("searched-cities-list-item").text(cityName);
        $("#searched-cities-list").prepend(listEl);
        getApi(cityName)
    }
    else {
        alert("Please search a city.")
    }
}

//getApi() has three server apis, one for the 5 days forecast, another for the current weather and day.js for the current and future days. With the latitude and longitude we can pass does parameters to the forecast api and get the same city.
//We get all the information including temperature, wind, city name, humidity, UV index, and then display this info on the Html. Using an if statement we can check for the uv index an see if the index is favorabe,
//moderate or severe.

function getApi(city) {

    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=5fe6d59403dd71cf4b6a5f04d6eead16";
    $("#search-city").val("");
    $("#uv").empty();
    $("#city").empty();
    $("#temp").empty();
    $("#wind").empty();
    $("#humidity").empty();
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
            var currentDay = $("<span>").text(" (" + dayjs().format("MM-DD-YY") + ")");
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
                    $("#uv").removeClass();
                    console.log(uvIndex);
                    $("#uv").append(uvIndex)
                    if (uvIndex < 3) {
                        
                        $("#uv").addClass("alert alert-success")
                    }
                    else if (uvIndex >= 3 && uvIndex <= 5) {
                        $("#uv").addClass("alert alert-warning");
                    }
                    else if (uvIndex > 5) {
                        $("#uv").addClass("alert alert-danger");
                    }
                    for (var i = 0; i <= forecastDays; i++) {
                        var divEl = $("<div>").addClass("three columns");
                        var cardDiv = $("<div>").addClass("card").css({ "background-color": "#8cdf76" });

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


start()
$("#search-form").on("submit", submitCity)

// On click each recent search can display that city information once again.
$("#searched-cities-list").on("click", function (e) {
    e.preventDefault();
    var getText = e.target.innerText;
    getApi(getText);
    console.log(e);
})