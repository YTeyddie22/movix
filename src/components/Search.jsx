import { useEffect, useRef } from "react";

function Search({ query, setQuery }) {
	const inputRef = useRef(null);

	useEffect(
		function () {
			function callback(e) {
				if (document.activeElement === inputRef.current) return;

				if (e.code === "Enter") {
					inputRef.current.focus();
					setQuery("");
				}
			}
			return () => document.addEventListener("keydown", callback);
		},
		[setQuery]
	);
	return (
		<input
			className='search'
			type='text'
			placeholder='Search movies...'
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputRef}
		/>
	);
}
export default Search;
