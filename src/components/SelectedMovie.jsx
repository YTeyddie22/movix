import { useState, useEffect } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
import movieData from "../data";

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

export default SelectedMovie;
