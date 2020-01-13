import React from 'react';

const SearchForm = (props) => {
    const { newListName, saveList } = props;
    return (
        <div>
            <h1>Add products to {newListName} <span className="span-button" onClick={saveList}>Done</span></h1>
            <form id="search-form" onSubmit={(e) => props.queryProducts(e)}>
                <input type="text" placeholder="Item name" name="query" />
                <input type="text" placeholder="brand" name="brand" />
                <input type="submit" />
            </form>
        </div>
    )
}

export default SearchForm;
