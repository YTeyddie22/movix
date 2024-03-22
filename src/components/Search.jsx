import { useRef } from "react";
import { useEventListener } from "../custom_hooks/useEventListener";

function Search({ query, setQuery }) {
	const inputRef = useRef(null);
	useEventListener("Enter", function () {
		if (document.activeElement === inputRef.current) return;
		inputRef.current.focus();
		setQuery("");
	});

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
