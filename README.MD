
# Cities & Points of Interest Web Application

---

## Overview

This project is a simple web-based application built using **HTML** , **CSS** , and **JavaScript**  (no libraries) to display **cities**  and their **points of interest (POI)** . It allows users to: 
1. **Select a city**  to view its embedded map and POIs.
 
2. **Add new POIs**  dynamically via a form.

3. Understand how JavaScript interacts with the DOM (Document Object Model) to update content dynamically.


---

## Application Structure

The application follows a **Model-View-Controller (MVC)**  pattern: 
1. **Model** : Represents the data (cities and their POIs).
 
2. **View** : Manages the DOM updates and layout.
 
3. **Controller** : Handles user interactions and updates the model and view accordingly.

You can read more about the MVC pattern [here](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) .

---

### Files and Folders
- **index.html** : The main HTML file for the app's structure.
 
- **styles.css** : Contains all styles for layout and design.
 
- **app.js** : The core JavaScript file handling logic and dynamic rendering.


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
   - Displays an **OpenStreetMap**  with a city-specific marker.
        ```javascript
        <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=20,43,30,49&layer=mapnik&marker=${gps}"
        title="Map of City"
        ></iframe>
        ```
 
3. **POI Rendering** :
   - Lists all points of interest under the selected city.
   - Includes the name, details, location, and image of each POI.
 
1. **Dynamic POI Form** : 
   - Users can add new POIs via a form:
    ```html
    <form>
    <label for="poi-name">Name:</label>
    <input type="text" id="poi-name" required />
    ...
    </form>
    ```
   - New POIs are dynamically added to the model and rendered without refreshing the page.

