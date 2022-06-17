import { debounce } from "./utils.js";

const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "e54eb44",
      s: searchTerm,
    },
  });

  if (response.data.Error) return [];

  return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";

  dropdown.classList.add("is-active");

  for (let movie of movies) {
    const option = document.createElement("a");
    option.classList.add("dropdown-item");
    option.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" />
        <h1>${movie.Title}</h1>
    `;

    resultsWrapper.appendChild(option);

    option.addEventListener("click", () => {
      input.value = movie.Title;
      dropdown.classList.remove("is-active");
    });
  }
};

input.addEventListener("input", debounce(onInput, 500));

document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) dropdown.classList.remove("is-active");
});
