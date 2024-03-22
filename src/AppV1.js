import { useState } from "react";
import Loader from "./components/Loader";
import Search from "./components/Search";
import ErrorMessage from "./components/ErrorMessage";
import MovieList from "./components/MovieList";
import SelectedMovie from "./components/SelectedMovie";
import { useMovies } from "./custom_hooks/useMovies";
import { useLocalStorage } from "./custom_hooks/useLocalStorage";

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	//Custom Hooks
	const { movies, isLoading, error } = useMovies(query);
	const [watched, setWatched] = useLocalStorage([], "watched");

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseSelectedMovie() {
		setSelectedId(null);
	}

	function handleAddWatchedMovies(movie) {
		setWatched(() => [...watched, movie]);
	}

	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
	}

	return (
		<>
			<NavBar>
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>

			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList
							movies={movies}
							onSelectMovie={handleSelectMovie}
						/>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>

				<Box>
					{selectedId ? (
						<SelectedMovie
							selectedId={selectedId}
							onCloseMovie={handleCloseSelectedMovie}
							onAddWatched={handleAddWatchedMovies}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatchedMovie={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function NavBar({ children }) {
	return (
		<nav className='nav-bar'>
			<Logo />
			{children}
		</nav>
	);
}

function Logo() {
	return (
		<div className='logo'>
			<span role='img'>🎥</span>
			<h1>Movix</h1>
		</div>
	);
}

function NumResults({ movies }) {
	return (
		<p className='num-results'>
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Main({ children }) {
	return <main className='main'>{children}</main>;
}

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className='box'>
			<button
				className='btn-toggle'
				onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? "–" : "+"}
			</button>

			{isOpen && children}
		</div>
	);
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));

	return (
		<div className='summary'>
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMoviesList({ watched, onDeleteWatchedMovie }) {
	return (
		<ul className='list'>
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteWatchedMovie={onDeleteWatchedMovie}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({ movie, onDeleteWatchedMovie }) {
	return (
		<li>
			<img src={movie.poster} alt={`${movie.pitle} poster`} />
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
				<button
					className='btn-delete'
					onClick={() => onDeleteWatchedMovie(movie.imdbId)}>
					X
				</button>
			</div>
		</li>
	);
}
