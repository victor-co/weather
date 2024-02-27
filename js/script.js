import apiKey from "./apiKey.js";

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
  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  if (data.cod === "404") {
    throw new Error("Local não encontrado.");
  } else if (data.cod !== 200) {
    throw new Error("Informe um local.");
  }

  return data;
};

const showWeatherData = async (city) => {
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
  showWeatherData(city);

  if (city) {
    hideError();
    showWeatherData(city);
  } else {
    showError("Informe um local.");
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;
    showWeatherData(city);
  }
});