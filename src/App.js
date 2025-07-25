import { useState } from "react";
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
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";

const average = (arr) =>
  arr.reduce(
    (acc, cur, i, arr) =>
      acc + cur / arr.length,
    0
  );

export default function App() {
  const [query, setQuery] =
    useState("");

  const [watched, setWatched] =
    useLocalStorageState([], "watched");

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

  const { movies, isLoading, err } =
    useMovie(query);

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
