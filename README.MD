# Cities & Points of Interest Web Application

---

## Overview

This project is a simple web-based application built using **HTML** , **CSS** , and **JavaScript** (no libraries) to display **cities** and their **points of interest (POI)** . It allows users to:

1. **Select a city** to view its embedded map and POIs.

2. **Add new POIs** dynamically via a form.

3. Understand how JavaScript interacts with the DOM (Document Object Model) to update content dynamically.

---

## Application Structure

The application follows a **Model-View-Controller (MVC)** pattern:

1. **Model** : Represents the data (cities and their POIs).

2. **View** : Manages the DOM updates and layout.

3. **Controller** : Handles user interactions and updates the model and view accordingly.

You can read more about the MVC pattern [here](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) .

---

## How It Works

#### 1. Data Model

The model contains a list of cities, their GPS coordinates (used for map rendering), and an array of points of interest (POI).

Example city structure:

```javascript
{
  name: "Bucharest",
  gps: "44.439663, 26.096306",
  poi: [
    {
      name: "Parliament Palace",
      details: "The heaviest building in the world.",
      location: "Sector 5",
      image: "IMAGE_URL"
    }
  ]
}
```

- The `gps` field is used to generate a centered map with a marker.

- The `poi` array contains details of various points of interest within that city.

---

#### 2. Controller

The controller initializes the app and handles user interactions:

- **`controller.init()`** : Renders the list of cities and binds events.

- **`controller.setCity(cityName)`** : Updates the current city and triggers the map and POI list rendering.

- **`controller.addPoi(newPoi)`** : Adds a new point of interest to the selected city.

---

#### 3. View

The view handles DOM updates:

1. **City List Rendering** :

   - Populates the list of cities in the sidebar (`<ul id="cities">`).
   - Clicking a city triggers its map and POI details.

2. **Map Rendering** :

   - Displays an **OpenStreetMap** with a city-specific marker.
     ```javascript
     <iframe
       src="https://www.openstreetmap.org/export/embed.html?bbox=20,43,30,49&layer=mapnik&marker=${gps}"
       title="Map of City"
     ></iframe>
     ```

3. **POI Rendering** :

   - Lists all points of interest under the selected city.
   - Includes the name, details, location, and image of each POI.

4. **Dynamic POI Form** :
   - Users can add new POIs via a form:
   ```html
   <form>
     <label for="poi-name">Name:</label>
     <input type="text" id="poi-name" required />
     ...
   </form>
   ```
   - New POIs are dynamically added to the model and rendered without refreshing the page.

---

## Section 1: Doing Simple REST Calls

Modern applications often retrieve data from external sources via REST APIs. REST (Representational State Transfer) is a protocol that allows applications to interact with servers to fetch or manipulate data.

In this project:

1. **Weather API** :
   - We use the **Open-Meteo API** to fetch the current temperature of a city based on its GPS coordinates.
   - Example code for fetching the weather data:
   ```javascript
   const fetchCurrentTemperature = async (latitude, longitude) => {
     const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
     const response = await fetch(url);
     const data = await response.json();
     return data.current_weather.temperature;
   };
   ```

- **Key Points** :
  - Using [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) .
  - `async/await` [ `async/await`](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises),

---

## Section 2: Loading Data on Demand

In addition to fetching external data like weather, you can dynamically load content for your application. For example, we load the list of cities and their POIs from a REST API instead of storing them locally.

**Cities and POIs API**:
We use a **MockAPI endpoint** to load cities and their points of interest dynamically. Endpoints include:

- **`GET /cities`** : Fetches all cities.
- **`GET /cities/:id/poi`** : Fetches POIs for a specific city.

Example for loading cities dynamically:

```javascript
const API_URL = "https://6760a8686be7889dc35e8feb.mockapi.io/cities";

const loadCities = async () => {
  const response = await fetch(API_URL);
  const cities = await response.json();
  model.cities = cities;
};
```

### Key Points:

1. **Cities are loaded on application startup** :

- Data is fetched from the `/cities` endpoint using the `fetch` API.

- Once fetched, the data is stored in the `model.cities` array and rendered dynamically.

2. **POIs are loaded on demand** :

- When a city is selected, the app fetches POIs for that city using the `/cities/:id/poi` endpoint.

## Section 3: Changing data in the API

The application integrates with a **REST API** to manage cities and their points of interest (POIs). REST (Representational State Transfer) is a widely used architectural style for building APIs, allowing clients to interact with server-side data using standard HTTP methods such as `GET`, `POST`, `PUT`, and `DELETE`.

### Key HTTP Methods Used

1. **`GET`** :

- Used to fetch cities and POIs from the server.

- Example: Retrieving a list of cities or points of interest for a selected city.

2. **`POST`** :

- Used to add new data to the server.

- In our app:

  - Adding a new POI to a city.

  - Example Code:

```javascript
const response = await fetch(`${API_URL}/${cityId}/poi`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newPoi),
});
```

3. **`DELETE`** :

- Used to delete data from the server.

- In our app:

  - Removing a specific POI from a city.

  - Example Code:

```javascript
const response = await fetch(`${API_URL}/${cityId}/poi/${poiId}`, {
  method: "DELETE",
});
```

4. **`PUT`** :

- Used to update existing data on the server.

- In our app:

  - Updating the details of a specific POI.

  - Example Code:

```javascript
const response = await fetch(`${API_URL}/${cityId}/poi/${poiId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(updatedPoi),
});
```

---

### HTTP Status Codes

The server responds to HTTP requests with **status codes** that indicate the result of the operation. Here are some commonly used status codes relevant to this app:

- **`200 OK`** : The request was successful.

- **`201 Created`** : A new resource (e.g., a POI) was successfully created.

- **`400 Bad Request`** : The request was malformed or invalid.

- **`404 Not Found`** : The requested resource (e.g., a city or POI) was not found.

- **`500 Internal Server Error`** : The server encountered an error while processing the request.
  Learn more about status codes with visual examples at [https://http.cat/](https://http.cat/) .
