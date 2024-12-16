// ---- Data Model ----
// This represents the data for cities and their points of interest.
const model = {
  cities: [
    {
      name: "Bucharest",
      gps: "44.439663, 26.096306", // GPS coordinates for the city center
      poi: [
        {
          name: "Parliament Palace",
          details: "The heaviest building in the world.",
          location: "Sector 5",
          image:
            "https://cdn-imgix.headout.com/media/images/a6a72403763139d887e1e684bb5375d4-14364-0000s-0004-AdobeStock-221553573.jpg?auto=format&w=1222.3999999999999&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces",
        },
        {
          name: "Herăstrău Park",
          details: "A beautiful park with a large lake.",
          location: "Sector 1",
          image:
            "https://s.inyourpocket.com/img/text/romania/bucharest/1-herastrau-park.jpg",
        },
      ],
    },
    {
      name: "Cluj-Napoca",
      gps: "46.7712, 23.6236", // GPS coordinates for the city center
      poi: [
        {
          name: "Union Square",
          details: "A central square surrounded by landmarks.",
          location: "City Center",
          image:
            "https://visitcluj.ro/wp-content/uploads/2021/02/20210521_141222-scaled.jpg",
        },
        {
          name: "Botanical Garden",
          details: "A lush green area perfect for relaxation.",
          location: "Gheorgheni",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/4/4c/Cluj-Napoca_Botanical_Garden_-_Japanese_Garden.jpg",
        },
      ],
    },
    {
      name: "Brașov",
      gps: "45.657974, 25.601198", // GPS coordinates for the city center
      poi: [
        {
          name: "Black Church",
          details: "A Gothic church and one of Brașov's main landmarks.",
          location: "City Center",
          image:
            "https://www.romaniajournal.ro/wp-content/uploads/2015/07/Biserica-Neagra-Brasov4.jpg",
        },
        {
          name: "Tampa Mountain",
          details: "A small mountain with great views of the city.",
          location: "City Center",
          image:
            "https://bags-always-packed.com/wp-content/uploads/2023/06/Walking-and-Hiking-route-for-Tampa-Mountain-Peak.jpg",
        },
      ],
    },
  ],
  currentCity: null, // Tracks the currently selected city
};

// ---- Controller ----
// This manages user interaction and updates the view/model.
const controller = {
  init() {
    view.renderCities();
    view.bindCityClick();
    view.bindAddPoi();
  },

  async setCity(cityName) {
    model.currentCity = model.cities.find((city) => city.name === cityName);
    view.renderCityMap(); // Show the selected city's map
    view.renderPoi(); // Show points of interest
    if (model.currentCity) {
      const [latitude, longitude] = model.currentCity.gps
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      const temperature = await controller.fetchCurrentTemperature(
        latitude,
        longitude
      );
      view.renderCityDetails({ ...model.currentCity, temperature });
    }
  },

  addPoi(newPoi) {
    if (model.currentCity) {
      model.currentCity.poi.push(newPoi);
      view.renderPoi();
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
        `;
        poiList.appendChild(poiItem);
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
