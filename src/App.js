import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';

import 'globals.styl'
import styles from './App.styl';

import { apiGET, apiPOST } from './utils/fetch';

import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Lists from './components/Lists.js';

class App extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            products: null,
            lists: null,
            selectedList: null
        }
    }

    componentDidMount () {
        this.getLists();
    }

    getLists = async () => {
        const lists = await apiGET('lists');
        this.setState(() => {
            return {
                lists
            }
        }, () => console.log(this.state))
    }

    selectList = (e, list) => {
        this.setState(() => {
            return {
                selectedList: list
            }
        }, () => console.log(this.state))
    }

    queryProducts = async (e) => {
        e.preventDefault();
        const searchTerm = e.target.query.value.trim();
        const searchResults = await apiGET('products', {
            limit: 10,
            filters: {
                name: searchTerm
            }
        });
        this.setState(() => {
            return {
                products: searchResults
            }
        }, () => console.log(this.state));
    }

    createNewList = async (e) => {
        e.preventDefault();
        const listName = e.target.name.value.trim();
        const newList = await apiPOST('list', {
            name: listName,
            products: []
        }); 
        console.log('Added!', newList);
        this.getLists();
    }

    addToList = async (id) => {
        // Test to see if we can update lists with POST
    }

    render () {
        const { products, lists, selectedList } = this.state;

        return (
            <div className={styles.root}>
                <Lists lists={lists} createNewList={this.createNewList} selectList={this.selectList} selectedList={selectedList} />
                <SearchForm queryProducts={this.queryProducts} />
                {products !== null && "total" in products && products.total > 0 &&
                <SearchResults products={products} addToList={this.addToList} />
                }
            </div>
        );
    }

}

export default hot(App);
