// script.js
import "./styles.css";

const API_KEY = "186d60fa";
const searchBox = document.getElementById("movie-search-box");
const searchListContainer = document.getElementById("search-list");
const resultContainer = document.getElementById("result-grid");
const favouritesBtn = document.querySelector(".favourites-btn");

let favouriteMovies = [];

// Function to show favourite movies page
function showFavouriteMovies() {
  resultContainer.innerHTML = "";
  for (let movie of favouriteMovies) {
    const movieCard = createMovieCard(movie);
    resultContainer.appendChild(movieCard);
  }
}

// Load movies from API
async function loadMoviesFromAPI(searchTerm) {
  const API_URL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`;
  const response = await fetch(API_URL);
  const data = await response.json();
  if (data.Response === "True") displayMovieList(data.Search);
}

// Function to display search results as the user types
searchBox.addEventListener("input", () => {
  let searchTerm = searchBox.value.trim();
  if (searchTerm.length > 0) {
    searchListContainer.classList.remove("hide-search-list");
    loadMoviesFromAPI(searchTerm);
  } else {
    searchListContainer.classList.add("hide-search-list");
  }
});

function displayMovieList(movies) {
  searchListContainer.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add("search-list-item");
    let moviePoster;
    if (movies[idx].Poster !== "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
            <button class="add-to-favourites-btn">Add to Favourites</button>
        </div>
    `;
    searchListContainer.appendChild(movieListItem);

    // Add event listener to the "Add to Favourites" button
    const addToFavouritesBtn = movieListItem.querySelector(
      ".add-to-favourites-btn"
    );
    addToFavouritesBtn.addEventListener("click", () => {
      addToFavourites(movies[idx]);
    });

    // Add event listener to the movie item to display movie details
    movieListItem.addEventListener("click", () => {
      loadMovieDetails(movies[idx].imdbID);
    });
  }
}

// Function to create a movie card
function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");
  const moviePoster =
    movie.Poster !== "N/A" ? movie.Poster : "image_not_found.png";

  movieCard.innerHTML = `
    <div class="movie-card-thumbnail">
      <img src="${moviePoster}" alt="${movie.Title}">
    </div>
    <div class="movie-card-info">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="remove-from-favourites-btn">Remove from Favourites</button>
    </div>
  `;

  // Add event listener to the "Remove from Favourites" button
  const removeFromFavouritesBtn = movieCard.querySelector(
    ".remove-from-favourites-btn"
  );
  removeFromFavouritesBtn.addEventListener("click", () => {
    removeMovieFromFavourites(movie.imdbID);
  });

  return movieCard;
}

// Function to add movie to favourites
function addToFavourites(movie) {
  if (!favouriteMovies.some((favMovie) => favMovie.imdbID === movie.imdbID)) {
    favouriteMovies.push(movie);
    showFavouriteMovies(); // Update the favourites page after adding a movie
  }
}

// Function to remove movie from favourites
function removeMovieFromFavourites(imdbID) {
  favouriteMovies = favouriteMovies.filter(
    (favMovie) => favMovie.imdbID !== imdbID
  );
  showFavouriteMovies(); // Update the favourites page after removing a movie
}

// Function to load movie details
async function loadMovieDetails(imdbID) {
  const API_URL = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
  const response = await fetch(API_URL);
  const data = await response.json();
  displayMovieDetails(data);
}

// Function to display movie details
function displayMovieDetails(details) {
  // Get the movie details from the API response
  const title = details.Title;
  const year = details.Year;
  const rated = details.Rated;
  const plot = details.Plot;
  const poster = details.Poster;

  // Create a modal or overlay to display the movie details
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <div class="movie-details">
        <img src="${poster}" alt="${title}" class="modal-poster">
        <div class="movie-info">
          <h2>${title}</h2>
          <p>Year: ${year}</p>
          <p>Rated: ${rated}</p>
          <p>Plot: ${plot}</p>
        </div>
      </div>
    </div>
  `;

  // Add event listener to close the modal when the close button is clicked
  const closeBtn = modal.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Add the modal to the body to display it
  document.body.appendChild(modal);
}

// Function to initialize the app
function init() {
  favouritesBtn.addEventListener("click", showFavouriteMovies);
}

// Load favourite movies from local storage (if any) on page load
window.addEventListener("DOMContentLoaded", () => {
  const storedFavourites = localStorage.getItem("favouriteMovies");
  if (storedFavourites) {
    favouriteMovies = JSON.parse(storedFavourites);
    showFavouriteMovies(); // Display favourite movies on page load
  }
  init();
});

// Save favourite movies to local storage when the page is unloaded
window.addEventListener("beforeunload", () => {
  localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovies));
});

// Run init() to set up the event listeners when the page loads
init();
