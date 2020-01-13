import React from 'react';
import ProductView from './ProductView';

const SearchResults = (props) => {
    const { products, isInList, removeFromList, addToList } = props;
    return (
        <div id="search-results">
            Search Results:
            {products.result.map((product) =>
                <ProductView isLocked={false} key={product.id} product={product} addToList={addToList} removeFromList={removeFromList} isInList={isInList} />
            )}
        </div>
    )
}

export default SearchResults;
