import {
  useEffect,
  useState,
} from "react";
import logo from "./image/logo.png";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce(
    (acc, cur, i, arr) =>
      acc + cur / arr.length,
    0
  );

const KEY = "15f06e9";
export default function App() {
  const [query, setQuery] =
    useState("king");
  const [movies, setMovies] = useState(
    []
  );
  const [watched, setWatched] =
    useState([]);
  const [isLoading, setIsLoading] =
    useState(false);
  const [err, setErr] = useState("");
  const [selectedId, setSelectedId] =
    useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) =>
      id === selectedId ? null : id
    );
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setIsLoading(true);
          setErr("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching data"
            );

          const data = await res.json();
          if (data.Response === "False")
            throw new Error(
              "Movie Not Found"
            );

          setMovies(data.Search);
        } catch (error) {
          setErr(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setErr("");
        setMovies([]);
        return;
      }
      fetchMovie();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search
          query={query}
          setQuery={setQuery}
        />
        <Numresults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !err && (
            <MovieList
              movies={movies}
              onSelectMovie={
                handleSelectMovie
              }
            />
          )}
          {err && (
            <ErrorMessage
              message={err}
            />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={
                handleCloseMovie
              }
            />
          ) : (
            <>
              <WatchedSummary
                watched={watched}
              />
              {/* <StarRating
            color="#bfb8a4"
            size={2.8}
            /> */}
              <WatchedMovieList
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <p className="loader">Loading...</p>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) =>
        setQuery(e.target.value)
      }
    />
  );
}
function Logo() {
  return (
    <div className="logo">
      {/* <span role="img">🍿</span> */}
      <span role="img">
        <img
          src={logo}
          className="logo"
          alt="logo"
        />
      </span>
      <h1>findMovie</h1>
    </div>
  );
}
function Numresults({ movies }) {
  return (
    <p className="num-results">
      Found{" "}
      <strong>{movies.length}</strong>{" "}
      results
    </p>
  );
}

function Main({ children }) {
  const [isOpen, setIsOpen] =
    useState(true);

  function toggleBotton() {
    setIsOpen((open) => !open);
  }
  return (
    <div>
      <main className="main">
        {children}
      </main>
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] =
    useState(true);

  function toggleBotton() {
    setIsOpen((open) => !open);
  }
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={toggleBotton}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({
  movies,
  onSelectMovie,
}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movie({
  movie,
  onSelectMovie,
}) {
  return (
    <li
      onClick={() =>
        onSelectMovie(movie.imdbID)
      }
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
}) {
  return (
    <div className="details">
      <button
        className="btn-back"
        onClick={onCloseMovie}
      >
        &larr;{" "}
      </button>

      {selectedId}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map(
      (movie) => movie.imdbRating
    )
  );
  const avgUserRating = average(
    watched.map(
      (movie) => movie.userRating
    )
  );
  const avgRuntime = average(
    watched.map(
      (movie) => movie.runtime
    )
  );
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>
            {watched.length} movies
          </span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie }) {
  return (
    <li>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>
            {movie.imdbRating}
          </span>
        </p>
        <p>
          <span>🌟</span>
          <span>
            {movie.userRating}
          </span>
        </p>
        <p>
          <span>⏳</span>
          <span>
            {movie.runtime} min
          </span>
        </p>
      </div>
    </li>
  );
}
