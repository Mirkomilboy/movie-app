import Search from "~/components/Search";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import MovieCard from "~/components/MovieCard";
interface MovieTypes {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  original_language: string;
}

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Get Movie Info" },
    { name: "description", content: "Find any movie you like" },
  ];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState<MovieTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // debouncing search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json();

      if(data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.error("Error while fetching movies: ", error);
      setErrorMessage('Error fetching movies, please, try again later.')
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero image" />
          <h1><span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-10">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  vote_average={movie.vote_average}
                  poster_path={movie.poster_path}
                  original_language={movie.original_language}
                  release_date={movie.release_date}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
