import {
  useEffect,
  useState,
} from "react";

const KEY = "15f06e9";

export function useMovie(query) {
  const [movies, setMovies] = useState(
    []
  );
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);

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

      // handleCloseMovie();
      fetchMovie();

      return () => controller.abort();
    },
    [query, err.name]
  );

  return { movies, isLoading, err };
}
