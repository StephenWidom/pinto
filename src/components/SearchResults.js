import React from 'react';
import ProductView from './ProductView';

const SearchResults = (props) => {
    console.log(props.products.result);
    return (
        <div id="search-results">
            Search Results:
            {props.products.result.map((product) =>
                <ProductView key={product.id} product={product} />
            )}
        </div>
    )
}

export default SearchResults;
