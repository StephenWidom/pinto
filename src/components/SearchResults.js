import React from 'react';
import ProductView from './ProductView';

const SearchResults = (props) => {
    return (
        <div id="search-results">
            Search Results:
            {props.products.result.map((product) =>
                <ProductView key={product.id} product={product} addToList={props.addToList} />
            )}
        </div>
    )
}

export default SearchResults;
