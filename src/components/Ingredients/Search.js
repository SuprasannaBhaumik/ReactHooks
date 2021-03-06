import React, {useState, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

	const searchInputRef = useRef();

	const [searchTerm, setSearchTerm] = useState('');

	const performSearch = (event) => {
		const searchTerm = event.target.value;
		setSearchTerm(searchTerm);
		props.performSearch(searchTerm);
    }

	return (
		<section className="search">
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					<input type="text" ref={searchInputRef} value={searchTerm} onChange={performSearch}/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
