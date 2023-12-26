import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import Search from "./components/Search";
import ErrorMessage from "./components/ErrorMessage";
import MovieList from "./components/MovieList";
import StarRating from "./components/StarRating";

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [movies, setMovies] = useState([]);
	const [query, setQuery] = useState("");
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState(null);

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
	useEffect(
		function () {
			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError("");
					const res = await fetch(
						` http://www.omdbapi.com/?apikey=${movieData}&s=${query}`
					);

					if (!res.ok)
						throw new Error(
							"Something went wrong with fetching movies"
						);
					const data = await res.json();

					if (data.Response === "False")
						throw new Error("Movie not Found!");
					setMovies(data.Search);
				} catch (error) {
					console.error(error.message);
					setError(error.message);
				} finally {
					setIsLoading(false);
				}
			}

			if (query.length < 3) {
				setMovies([]);
				setError("");
				return;
			}
			fetchMovies();
		},
		[query]
	);

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

function SelectedMovie({ selectedId, onCloseMovie, onAddWatched, watched }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState("");
	const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);
	const watchedUserRating = watched.find(
		(movie) => movie.imdbId === selectedId
	)?.userRating;
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
			imdbId: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ").at(0)),
			userRating,
		};

		onAddWatched(newWatchedMovie);
		onCloseMovie();
	}

	useEffect(
		function () {
			async function fetchSelectedMovie() {
				setIsLoading(true);
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${movieData}&i=${selectedId}`
				);

				const data = await res.json();
				setMovie(data);
				setIsLoading(false);
			}
			fetchSelectedMovie();
		},
		[selectedId]
	);
	return (
		<div className='details'>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className='btn-back' onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie}`} />
						<div className='details-overview'>
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>

					<section>
						<div className='rating'>
							{!isWatched ? (
								<>
									<StarRating
										maxrating={10}
										size={24}
										onSetRating={setUserRating}
									/>

									{userRating > 0 && (
										<button
											className='btn-add'
											onClick={handleAdd}>
											+ Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You Already rated this movie{" "}
									{watchedUserRating} ⭐
								</p>
							)}
						</div>

						<p>
							<em>{plot}</em>
						</p>

						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}

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
