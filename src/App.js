import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';

import 'globals.styl'
import styles from './App.styl';

import { apiGET } from './utils/fetch';

import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

class App extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            products: null
        }
    }

    async componentDidMount () {
        console.log(
            'apiGET example:',
            await apiGET('products', {
                limit: 5,
                filters: {
                    name: 'apple',
                    'nutrition.calories': '> 100',
                },
            })
        );
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

    render () {
        const { products } = this.state;

        return (
            <div className={styles.root}>
                <SearchForm queryProducts={this.queryProducts} />
                {products !== null && "total" in products && products.total > 0 &&
                <SearchResults products={products} />
                }
            </div>
        );
    }

}

export default hot(App);
