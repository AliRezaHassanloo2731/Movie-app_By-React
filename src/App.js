import {
  useEffect,
  useState,
} from "react";
import logo from "./image/logo.png";
import WatchedMovieList from "./WatchedMovieList";
import Loader from "./Loader";
import MovieDetails from "./MovieDetails";
import WatchedSummary from "./WatchedSummary";
import { NavBar } from "./NavBar";
import { Search } from "./Search";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { Numresults } from "./Numresults";
import Main from "./Main";

const average = (arr) =>
  arr.reduce(
    (acc, cur, i, arr) =>
      acc + cur / arr.length,
    0
  );
const KEY = "15f06e9";

export default function App() {
  const [query, setQuery] =
    useState("");
  const [movies, setMovies] = useState(
    []
  );
  const [watched, setWatched] =
    useState(() => {
      return JSON.parse(
        localStorage.getItem("watched")
      );
    });
  // const [watched, setWatched] =
  //   useState([]);
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

  function handleAddWatched(movie) {
    setWatched((watched) => [
      ...watched,
      movie,
    ]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) =>
      watched.filter(
        (movie) => movie.imdbID !== id
      )
    );
  }

  useEffect(() => {
    localStorage.setItem(
      "watched",
      JSON.stringify(watched)
    );
  }, [watched]);

  useEffect(
    function () {
      const controller =
        new AbortController();

      async function fetchMovie() {
        try {
          setIsLoading(true);
          setErr("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            {
              signal: controller.signal,
            }
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
          setErr("");
        } catch (error) {
          if (err.name !== "AbortError")
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

      handleCloseMovie();
      fetchMovie();

      return () => controller.abort();
    },
    [query, err.name]
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
              onAddWatched={
                handleAddWatched
              }
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary
                watched={watched}
                average={average}
              />

              <WatchedMovieList
                watched={watched}
                onDeleteWatched={
                  handleDeleteWatched
                }
              />
            </>
          )}
        </Box>
      </Main>
    </>
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

export function Logo() {
  return (
    <div className="logo">
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
