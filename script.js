// ==================== ELEMENTS ====================

const cityInput =
    document.getElementById("city-input");

const searchButton =
    document.getElementById("search-button");

const locationButton =
    document.getElementById("location-button");

const message =
    document.getElementById("message");

const loading =
    document.getElementById("loading");

const weatherCard =
    document.getElementById("weather-card");

const cityName =
    document.getElementById("city-name");

const countryName =
    document.getElementById("country-name");

const temperature =
    document.getElementById("temperature");

const weatherCondition =
    document.getElementById("weather-condition");

const weatherIcon =
    document.getElementById("weather-icon");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("wind-speed");

const feelsLike =
    document.getElementById("feels-like");


// ==================== API URLs ====================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";

const REVERSE_GEOCODING_API =
    "https://api.bigdatacloud.net/data/reverse-geocode-client";


// ==================== SEARCH WEATHER ====================

async function searchWeather() {

    const city =
        cityInput.value.trim();


    // Check empty input

    if (city === "") {

        message.textContent =
            "Please enter a city name.";

        weatherCard.classList.add("hidden");

        return;
    }


    // Clear previous message

    message.textContent = "";


    // Show loading

    loading.classList.remove("hidden");

    weatherCard.classList.add("hidden");


    try {

        // ==================== FIND CITY ====================

        const locationResponse =
            await fetch(
                `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );


        if (!locationResponse.ok) {

            throw new Error(
                "Unable to find the location."
            );

        }


        // Convert response to JSON

        const locationData =
            await locationResponse.json();


        // Check city

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please check the city name."
            );

        }


        // Get location

        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // ==================== GET WEATHER ====================

        const weatherData =
            await getWeatherData(
                latitude,
                longitude
            );


        // ==================== DISPLAY WEATHER ====================

        displayWeather(
            location,
            weatherData.current
        );

    }


    catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        message.textContent =
            error.message ||
            "Something went wrong. Please try again.";

        weatherCard.classList.add(
            "hidden"
        );

    }


    finally {

        loading.classList.add(
            "hidden"
        );

    }

}


// ==================== GET WEATHER DATA ====================

async function getWeatherData(
    latitude,
    longitude
) {

    const response =
        await fetch(
            `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
        );


    if (!response.ok) {

        throw new Error(
            "Unable to fetch weather data."
        );

    }


    return await response.json();

}


// ==================== DISPLAY WEATHER ====================

function displayWeather(
    location,
    currentWeather
) {

    // ==================== CITY ====================

    cityName.textContent =
        location.name ||
        "Unknown Location";


    // ==================== COUNTRY ====================

    if (location.admin1) {

        countryName.textContent =
            `${location.admin1}, ${location.country}`;

    }

    else if (location.country) {

        countryName.textContent =
            location.country;

    }

    else {

        countryName.textContent =
            "";

    }


    // ==================== TEMPERATURE ====================

    temperature.textContent =
        `${Math.round(
            currentWeather.temperature_2m
        )}°C`;


    // ==================== WEATHER CONDITION ====================

    weatherCondition.textContent =
        getWeatherDescription(
            currentWeather.weather_code
        );


    // ==================== WEATHER ICON ====================

    weatherIcon.textContent =
        getWeatherIcon(
            currentWeather.weather_code
        );


    // ==================== HUMIDITY ====================

    humidity.textContent =
        `${currentWeather.relative_humidity_2m}%`;


    // ==================== WIND ====================

    windSpeed.textContent =
        `${currentWeather.wind_speed_10m} km/h`;


    // ==================== FEELS LIKE ====================

    feelsLike.textContent =
        `${Math.round(
            currentWeather.apparent_temperature
        )}°C`;


    // ==================== SHOW WEATHER CARD ====================

    weatherCard.classList.remove(
        "hidden"
    );

}


// ==================== WEATHER DESCRIPTION ====================

function getWeatherDescription(
    weatherCode
) {

    const weatherDescriptions = {

        0: "Clear sky",

        1: "Mainly clear",

        2: "Partly cloudy",

        3: "Overcast",

        45: "Fog",

        48: "Depositing rime fog",

        51: "Light drizzle",

        53: "Moderate drizzle",

        55: "Dense drizzle",

        56: "Light freezing drizzle",

        57: "Dense freezing drizzle",

        61: "Slight rain",

        63: "Moderate rain",

        65: "Heavy rain",

        66: "Light freezing rain",

        67: "Heavy freezing rain",

        71: "Slight snow fall",

        73: "Moderate snow fall",

        75: "Heavy snow fall",

        77: "Snow grains",

        80: "Slight rain showers",

        81: "Moderate rain showers",

        82: "Violent rain showers",

        85: "Slight snow showers",

        86: "Heavy snow showers",

        95: "Thunderstorm",

        96: "Thunderstorm with slight hail",

        99: "Thunderstorm with heavy hail"

    };


    return (
        weatherDescriptions[weatherCode] ||
        "Unknown weather"
    );

}


// ==================== WEATHER ICON ====================

function getWeatherIcon(
    weatherCode
) {

    if (weatherCode === 0) {

        return "☀️";

    }


    if (
        weatherCode === 1 ||
        weatherCode === 2
    ) {

        return "🌤️";

    }


    if (weatherCode === 3) {

        return "☁️";

    }


    if (
        weatherCode === 45 ||
        weatherCode === 48
    ) {

        return "🌫️";

    }


    if (
        weatherCode >= 51 &&
        weatherCode <= 57
    ) {

        return "🌦️";

    }


    if (
        weatherCode >= 61 &&
        weatherCode <= 67
    ) {

        return "🌧️";

    }


    if (
        weatherCode >= 71 &&
        weatherCode <= 77
    ) {

        return "❄️";

    }


    if (
        weatherCode >= 80 &&
        weatherCode <= 82
    ) {

        return "🌦️";

    }


    if (
        weatherCode >= 85 &&
        weatherCode <= 86
    ) {

        return "🌨️";

    }


    if (
        weatherCode >= 95 &&
        weatherCode <= 99
    ) {

        return "⛈️";

    }


    return "🌤️";

}


// ==================== USE MY LOCATION ====================

function useMyLocation() {

    // Check browser support

    if (!navigator.geolocation) {

        message.textContent =
            "Geolocation is not supported by your browser.";

        return;

    }


    // Clear previous message

    message.textContent = "";


    // Show loading

    loading.classList.remove(
        "hidden"
    );

    weatherCard.classList.add(
        "hidden"
    );


    // Change button text

    locationButton.textContent =
        "📍 Detecting Location...";

    locationButton.disabled = true;


    // Get current position

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            getLocationWeather(
                latitude,
                longitude
            );

        },

        function (error) {

            loading.classList.add(
                "hidden"
            );

            locationButton.textContent =
                "📍 Use My Location";

            locationButton.disabled =
                false;


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                message.textContent =
                    "Location permission was denied.";

            }

            else if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                message.textContent =
                    "Location information is unavailable.";

            }

            else if (
                error.code ===
                error.TIMEOUT
            ) {

                message.textContent =
                    "Location request timed out.";

            }

            else {

                message.textContent =
                    "Unable to get your location.";

            }

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 300000

        }

    );

}


// ==================== CURRENT LOCATION WEATHER ====================

async function getLocationWeather(
    latitude,
    longitude
) {

    try {

        // ==================== GET WEATHER ====================

        const weatherData =
            await getWeatherData(
                latitude,
                longitude
            );


        // ==================== REVERSE GEOCODING ====================

        const locationResponse =
            await fetch(
                `${REVERSE_GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );


        if (!locationResponse.ok) {

            throw new Error(
                "Unable to identify your location."
            );

        }


        const locationData =
            await locationResponse.json();


        // ==================== CREATE LOCATION OBJECT ====================

        const city =
            locationData.city ||
            locationData.locality ||
            locationData.principalSubdivision ||
            "Your Location";


        const state =
            locationData.principalSubdivision ||
            "";


        const country =
            locationData.countryName ||
            "";


        let displayState = state;


        // Don't repeat city if state is same

        if (
            displayState.toLowerCase() ===
            city.toLowerCase()
        ) {

            displayState = "";

        }


        const location = {

            name: city,

            admin1: displayState,

            country: country

        };


        // ==================== DISPLAY ====================

        displayWeather(
            location,
            weatherData.current
        );

    }


    catch (error) {

        console.error(
            "Location Weather Error:",
            error
        );


        message.textContent =
            error.message ||
            "Unable to get weather for your location.";

        weatherCard.classList.add(
            "hidden"
        );

    }


    finally {

        loading.classList.add(
            "hidden"
        );

        locationButton.textContent =
            "📍 Use My Location";

        locationButton.disabled =
            false;

    }

}


// ==================== SEARCH BUTTON ====================

searchButton.addEventListener(
    "click",
    searchWeather
);


// ==================== LOCATION BUTTON ====================

locationButton.addEventListener(
    "click",
    useMyLocation
);


// ==================== ENTER KEY ====================

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchWeather();

        }

    }
);