import React from 'react';

const ProductView = (props) => {
    const { product } = props;
    return (
        <div className="single-product">
            <img src={product.image} />
            <h3>{product.name}</h3>
            <button>Add to List</button>
        </div>
    )
}

export default ProductView;
