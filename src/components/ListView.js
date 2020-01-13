import React from 'react';
import ProductView from './ProductView';

const ListView = (props) => {

    const { selectedList, selectedListProducts, isInList, backToLists } = props;

    return (
        <div id="list-view">
            <h1>Shopping List: {selectedList.name} <span onClick={backToLists} className="span-button">Back to Lists</span></h1>
            {selectedListProducts.map((product) => {
                return (
                    <ProductView product={product} isLocked={true} key={product.id} isInList={isInList} />
                )
            })}
        </div>
    )
}

export default ListView;
