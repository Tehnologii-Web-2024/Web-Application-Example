// We are using a service called https://mockapi.io/ for all data.
// It allows to work as a "simple database". Feel free to "clone" the porject at: https://mockapi.io/clone/6760a8686be7889dc35e8fec
const API_URL = "https://6760a8686be7889dc35e8feb.mockapi.io/cities";

// ---- Data Model ----
// This represents the data for cities and their points of interest.
const model = {
  cities: [],
  currentCity: null, // Tracks the currently selected city
};

// ---- Controller ----
// This manages user interaction and updates the view/model.
const controller = {
  async init() {
    await this.loadCities(); // Fetch cities from the API
    view.renderCities();
    view.bindCityClick();
    view.bindAddPoi();
  },

  async loadCities() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch cities");

      const cities = await response.json();
      model.cities = cities; // Store the fetched cities in the model
    } catch (error) {
      console.error("Error loading cities:", error.message);
      alert("Unable to load cities. Please try again later.");
    }
  },

  async setCity(cityName) {
    model.currentCity = model.cities.find((city) => city.name === cityName);

    if (model.currentCity) {
      await this.loadCityPOIs(model.currentCity.id);

      const [latitude, longitude] = model.currentCity.gps;
      const temperature = await controller.fetchCurrentTemperature(
        latitude,
        longitude
      );
      view.renderCityMap(); // Show the selected city's map
      view.renderPoi(); // Show points of interest

      view.renderCityDetails({ ...model.currentCity, temperature });
    }
  },

  addPoi(newPoi) {
    if (model.currentCity) {
      model.currentCity.poi.push(newPoi);
      view.renderPoi();
    }
  },

  async loadCityPOIs(cityId) {
    try {
      const response = await fetch(`${API_URL}/${cityId}/poi`);
      if (!response.ok) throw new Error("Failed to fetch POIs");

      const pois = await response.json();
      model.currentCity.poi = pois; // Store POIs for the selected city
    } catch (error) {
      console.error("Error loading POIs:", error.message);
      alert("Unable to load POIs for this city.");
    }
  },

  async fetchCurrentTemperature(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data = await response.json();
      return data.current_weather.temperature;
    } catch (error) {
      console.error("Error fetching temperature:", error.message);
      return null;
    }
  },

  async addPoi(newPoi) {
    if (model.currentCity) {
      const cityId = model.currentCity.id;
      try {
        const response = await fetch(`${API_URL}/${cityId}/poi`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPoi),
        });
        if (!response.ok) throw new Error("Failed to add POI");

        const createdPoi = await response.json();
        model.currentCity.poi.push(createdPoi); // Update the model
        view.renderPoi(); // Update the view
      } catch (error) {
        console.error("Error adding POI:", error.message);
        alert("Unable to add the POI. Please try again.");
      }
    }
  },

  async deletePoi(poiId) {
    if (model.currentCity) {
      const cityId = model.currentCity.id;
      try {
        const response = await fetch(`${API_URL}/${cityId}/poi/${poiId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete POI");

        // Remove POI from the model
        model.currentCity.poi = model.currentCity.poi.filter(
          (poi) => poi.id !== poiId
        );
        view.renderPoi(); // Update the view
      } catch (error) {
        console.error("Error deleting POI:", error.message);
        alert("Unable to delete the POI. Please try again.");
      }
    }
  },
};

// ---- View ----
// This manages the DOM and updates it based on the controller's commands.
const view = {
  renderCities() {
    const citiesList = document.getElementById("cities");
    citiesList.innerHTML = ""; // Clear existing cities
    model.cities.forEach((city) => {
      const cityItem = document.createElement("li");
      cityItem.textContent = city.name; // Display city name only
      cityItem.dataset.cityName = city.name; // Store city name
      citiesList.appendChild(cityItem);
    });
  },

  renderCityMap() {
    const mapContainer = document.getElementById("map-container");

    if (!mapContainer) {
      // Create the map container if it doesn't exist
      const newMapContainer = document.createElement("div");
      newMapContainer.id = "map-container";
      document.getElementById("content").prepend(newMapContainer);
    }

    const { gps, name } = model.currentCity || {};
    if (gps) {
      document.getElementById("map-container").innerHTML = `
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=20,43,30,49&layer=mapnik&marker=${gps}"
        title="Map of ${name}"
        style="border: none;"
        allowfullscreen>
      </iframe>
    `;
    }
  },

  renderPoi() {
    const poiList = document.getElementById("poi-list");
    poiList.innerHTML = ""; // Clear previous list

    if (model.currentCity) {
      model.currentCity.poi.forEach((poi) => {
        const poiItem = document.createElement("li");
        poiItem.innerHTML = `
          <strong>${poi.name}</strong><br>
          Details: ${poi.details}<br>
          Location: ${poi.location}<br>
          <img src="${poi.image}" alt="${poi.name}">
          <button class="delete-poi-btn" data-poi-id="${poi.id}">Delete</button>
        `;
        poiList.appendChild(poiItem);
      });
      // Bind delete buttons
      document.querySelectorAll(".delete-poi-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const poiId = e.target.dataset.poiId;
          controller.deletePoi(poiId);
        });
      });
    }
  },

  bindCityClick() {
    const citiesList = document.getElementById("cities");
    citiesList.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        controller.setCity(e.target.dataset.cityName);
      }
    });
  },

  renderCityDetails(cityData) {
    const cityHeader = document.getElementById("city-header");
    cityHeader.innerHTML = `
      <h2>${cityData.name}</h2>
      <p>Current Temperature: ${
        cityData.temperature !== undefined
          ? cityData.temperature + "°C"
          : "Unavailable"
      }</p>
    `;
  },

  bindAddPoi() {
    const form = document.querySelector("#add-poi-form form");
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent form submission
      const name = document.getElementById("poi-name").value;
      const details = document.getElementById("poi-details").value;
      const location = document.getElementById("poi-location").value;
      const image = document.getElementById("poi-image").value;

      const newPoi = {
        name,
        details,
        location,
        image: image || "https://via.placeholder.com/300", // Placeholder image
      }; // Placeholder image
      controller.addPoi(newPoi);

      // Clear form inputs
      form.reset();
    });
  },
};

// ---- Initialize Application ----
controller.init();
