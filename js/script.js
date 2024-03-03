import apiKeys from "./apiKey.js";
const openWeatherKey = apiKeys.openWeatherKey;
const unsplashKey = apiKeys.unsplashKey;

const apiFlags = "https://flagsapi.com/";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");

const errorDiv = document.querySelector("#error-message");

// Functions
const getWeatherData = async (city) => {
  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openWeatherKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  if (data.cod === "404") {
    throw new Error("Local não encontrado.");
  } else if (data.cod !== 200) {
    throw new Error("Informe um local.");
  }

  return data;
};

const getUnsplashImage = async (city) => {
  const url = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return data.urls.regular;
  } catch (error) {
    console.error("Erro ao buscar a imagem:", error);
    return null;
  }
};

const doSearch = async (city) => {
  try {
    const data = await getWeatherData(city);

    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    weatherIconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    );
    countryElement.setAttribute(
      "src",
      `${apiFlags}${data.sys.country}/flat/64.png`
    );
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed}Km/h`;

    weatherContainer.classList.remove("hide");
    errorDiv.classList.add("hide");

    const imageUrl = await getUnsplashImage(city);

    if (imageUrl) {
      document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url(${imageUrl})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  } catch (error) {
    weatherContainer.classList.add("hide");
    showError(error.message);
  }
};

const showError = (message) => {
  const errorDiv = document.querySelector("#error-message");
  errorDiv.innerText = message;
  errorDiv.classList.remove("hide");
};

const hideError = () => {
  const errorDiv = document.querySelector("#error-message");
  errorDiv.classList.add("hide");
};

// Events
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  doSearch(city);

  if (city) {
    hideError();
  } else {
    showError("Informe um local.");
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value.trim();
    doSearch(city);
  }
}); 
