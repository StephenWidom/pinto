import React from 'react';

const SearchForm = (props) => {


    return (
        <form id="search-form" onSubmit={(e) => props.queryProducts(e)}>
            <input type="text" name="query" />
            <input type="submit" />
        </form>
    )
}

export default SearchForm;
