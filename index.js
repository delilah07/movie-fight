import { createAutoComplete } from "./autocomplete.js";
const autoCompleteConfig = {
  renderOption(movie) {
    return `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" />
        <h1>${movie.Title} (${movie.Year})</h1> 
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "e54eb44",
        s: searchTerm,
      },
    });

    if (response.data.Error) return [];

    return response.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");

    onMovieSelect(movie, "#left-summary", "left");
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");

    onMovieSelect(movie, "#right-summary", "right");
  },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, div, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "e54eb44",
      i: movie.imdbID,
    },
  });

  document.querySelector(`${div}`).innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStat = document.querySelectorAll("#left-summary .notification");
  const rightSideStat = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStat.forEach((leftStat, i) => {
    const rightStat = rightSideStat[i];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

const movieTemplate = (movieDetail) => {
  const awards = movieDetail.Awards.split(" ").reduce((acc, el) => {
    const num = parseInt(el);
    if (!isNaN(num)) return acc + num;
    return acc;
  }, 0);

  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metaScore =
    movieDetail.Metascore === "N/A" ? 0 : parseInt(movieDetail.Metascore);
  const imdbRating =
    movieDetail.imdbRating === "N/A" ? 0 : parseInt(movieDetail.imdbRating);
  const imdbVotes =
    movieDetail.imdbVotes === "N/A"
      ? 0
      : parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
