import {
  useEffect,
  useRef,
  useState,
} from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "./useKey";

const KEY = "15f06e9";

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState(
    {}
  );
  const [isLoading, setIsLoading] =
    useState(false);
  const [userRating, setUserRating] =
    useState("");

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(
        runtime.split(" ").at(0)
      ),
      userRating: Number(userRating),
      countRatingDesition:
        countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      async function showMovieDetail() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      showMovieDetail();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `movie |${title}`;

      return () =>
        (document.title = "Movie App");
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button
              className="btn-back"
              onClick={onCloseMovie}
            >
              &larr;
            </button>
            <img
              src={poster}
              alt={`Poster of ${movie} movie`}
            />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull;{" "}
                {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
            ;
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    color={"#dbd2c6"}
                    onSetRating={
                      setUserRating
                    }
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={
                        handleAdd
                      }
                    >
                      +Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>
              Directed by {director}
            </p>
          </section>
          ;
        </>
      )}
    </div>
  );
}

export default MovieDetails;
