"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
  }

  calcPace() {
    this.pace = this.distance / this.duration;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}

class App {
  workouts = [];
  #mapEvent;
  #map;

  constructor() {
    this._getPosition();

    inputType.addEventListener("change", this._toggleElevationField);
    form.addEventListener("submit", this._newWorkout.bind(this));
  }

  _getPosition() {
    // console.log("======= ", this);
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("failed to get location........");
        }
      );
  }

  _loadMap(position) {
    // console.log("==== 2", this);
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 17);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    // console.log("clicking.........");
    this.#mapEvent = mapE;

    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();
    // console.log("submitting..........");

    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];

    L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          minWidth: 200,
          maxHeight: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${inputType.value}-popup`,
        })
      )
      .openPopup()
      .setPopupContent(inputType.value);

    if (inputType.value === "running") {
      const running = new Running(
        coords,
        inputDistance.value,
        inputDuration.value,
        inputCadence.value
      );
      console.log(running);
    } else {
      const cycle = new Cycling(
        coords,
        inputDistance.value,
        inputDuration.value,
        inputElevation.value
      );
      console.log(cycle);
    }

    inputElevation.value =
      inputDuration.value =
      inputCadence.value =
      inputDistance.value =
        "";

    form.classList.add("hidden");
  }
}

const app = new App();
