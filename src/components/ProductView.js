import React from 'react';

const ProductView = (props) => {
    const { product, addToList, isInList, removeFromList, isLocked } = props;
    return (
        <div className="single-product">
            <img src={product.image} />
            <h3>{product.name}</h3>
            {!isLocked && (
                isInList(product.id) &&
                <button onClick={() => removeFromList(product.id)}>Remove from List</button>
                ||
                <button onClick={() => addToList(product.id)}>Add to List</button>
            )} 
        </div>
    )
}

export default ProductView;
