import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';

import 'globals.styl'
import styles from './App.styl';

import { apiGET, apiPOST } from './utils/fetch';

import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Lists from './components/Lists';
import ListView from './components/ListView';

class App extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            products: null,
            lists: null,
            newListName: null,
            newListProducts: [],
            isModalOpen: false,
            showLists: true,
            selectedList: null,
            selectedListProducts: []
        }
    }

    componentDidMount () {
        this.getLists();
    }

    backToLists = () => {
        this.setState(() => {
            return {
                showLists: true,
                selectedList: null,
                selectedListProducts: []
            }
        });
    }

    toggleModal = () => {
        this.setState((prevState) => {
            return {
                isModalOpen: !prevState.isModalOpen
            }
        }, () => console.log(this.state))
    }
                
    getLists = async () => {
        const lists = await apiGET('lists');
        this.setState(() => {
            return {
                lists
            }
        }, () => console.log(this.state))
    }

    selectList = async (listID) => {
        const selectedList = await apiGET(`list/${listID}`);
        this.setState(() => {
            return {
                selectedList
            }
        }, () => {
            this.getSelectedListProducts(selectedList.products);
        })
    }

    getSelectedListProducts = async (productArray) => {
        let selectedListProducts = [];
        await Promise.all(productArray.map(async (productID) => {
            const product = await this.getProductById(productID);
            selectedListProducts.push(product);
        }));
        this.setState(() => {
            return {
                selectedListProducts
            }
        }, () => console.log(this.state))
    }

    queryProducts = async (e) => {
        e.preventDefault();
        const searchTerm = e.target.query.value.trim();

        if (searchTerm == '') {
            alert("You must provide a value for item name");
            return;
        }

        let filters = {};
        filters.name = searchTerm;

        const brand = e.target.brand.value.trim();
        if (brand != '') {
            filters.brand = brand;
        }

        const searchResults = await apiGET('products', {
            limit: 10,
            filters: filters
        });
        this.setState(() => {
            return {
                products: searchResults
            }
        }, () => console.log(this.state));
    }

    createNewList = (e) => {
        e.preventDefault();
        const newListName = e.target.name.value.trim();
        if (newListName == '') {
            alert('You must enter a name for your new list');
            return
        }
        this.toggleModal();
        this.setState(() => {
            return {
                newListName,
                showLists: false
            }
        }, () => console.log(this.state))
    }

    addToList = (productID) => {
        this.setState((prevState) => {
            return {
                newListProducts: prevState.newListProducts.concat(productID)
            }
        }, () => console.log(this.state))
    }

    isInList = (productID) => {
        return this.state.newListProducts.includes(productID);
    }

    removeFromList = (productID) => {
        this.setState((prevState) => {
            return {
                newListProducts: prevState.newListProducts.filter(product => product !== productID)
            }
        }, () => console.log(this.state))
    }

    saveList = async () => {
        const newList = await apiPOST('list', {
            name: this.state.newListName,
            products: this.state.newListProducts
        });
        console.log('List added!');
        this.getLists();
        this.setState(() => {
            return {
                showLists: true
            }
        }, () => console.log(this.state))
    }

    getProductById = async (productID) => {
        const product = await apiGET(`product/${productID}`);
        return product;
    }

    render () {
        const { products, lists, newListName, isModalOpen, selectedList, showLists, selectedListProducts } = this.state;

        return (
            <div className={styles.root}>
                {selectedList !== null &&
                <ListView selectedList={selectedList} backToLists={this.backToLists} selectedListProducts={selectedListProducts} isInList={this.isInList} />
                || (showLists &&
                <div id="lists">
                    <Lists lists={lists} isModalOpen={isModalOpen} createNewList={this.createNewList} toggleModal={this.toggleModal} selectList={this.selectList} newListName={newListName} />
                </div>
                ||
                <div id="products">
                    <SearchForm queryProducts={this.queryProducts} newListName={newListName} saveList={this.saveList} />
                    {products !== null && "total" in products && products.total > 0 &&
                    <SearchResults products={products} removeFromList={this.removeFromList} addToList={this.addToList} isInList={this.isInList} />
                    }
                </div>
                )}
            </div>
        );
    }

}

export default hot(App);
