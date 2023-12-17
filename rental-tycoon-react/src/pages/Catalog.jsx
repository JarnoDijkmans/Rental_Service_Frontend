import React from 'react';
import { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(0); 
    const [maxPriceFilter, setMaxPriceFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        ProductService.getAllProducts()
            .then(response => setProducts(response))
            .catch(error => {
                console.error('Error setting products:', error);
            });
    }, []);

    function onChangeName(event) {
        setNameFilter(event.target.value);
    }

    function onChangeCategory(event) {
        setCategoryFilter(event.target.value);
    }
    function onChangeMaxPrice(event) {
        setMaxPriceFilter(event.target.value);
    }

    function applyFilters() {
        const selectedCategory = categoryFilter === '0' ? 0 : parseInt(categoryFilter);
        const maxPrice = maxPriceFilter ? parseFloat(maxPriceFilter) : undefined;

        ProductService.filterMachine(nameFilter, maxPrice, parseInt(selectedCategory))
            .then(response => {
                setProducts(response);
            })
            .catch(error => {
                console.error('Error filtering products:', error);
            });
    }

    return (
        <>
            <div>
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={nameFilter}
                    onChange={onChangeName}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPriceFilter}
                    onChange={onChangeMaxPrice}
                />
                <select value={categoryFilter} onChange={onChangeCategory}>
                    <option value="0">All</option>
                    <option value="1">Earth moving</option>
                    <option value="2">Lifting</option>
                    <option value="3">Road machine</option>
                    <option value="4">Argricultural vehicles</option>
                    <option value="5">Trucks</option>
                    <option value="6">Crushing</option>
                    <option value="7">Platforms</option>
                    <option value="8">Cranes</option>
                    <option value="9">Compressors</option>
                    <option value="10">Trailers</option>
                    <option value="11">Various</option>
                    <option value="12">Lawn Mowers</option>
                </select>
                <button onClick={applyFilters}>Apply Filters</button>
            </div>

            <div className="profile-user">
                {products && products.length > 0 ? (
                    products.map((product, productIndex) => (
                        <div className="product-container" key={productIndex}>
                            <div className="product-details">
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">€{product.price},-</div>
                            </div>
                            <div className="product-files">
                                {product.files.map((file, index) => (
                                    <div className="post-content" key={index}>
                                        <div className='rent-container'>
                                            <button onClick={() => navigate(`/rentpage`, { state: { products: [product.id] } })} className='rent-button'>Rent</button>
                                        </div>
                                        {file.type.startsWith('image/') ? (
                                            <img src={file.url} alt={`Product File ${index}`} />
                                        ) : file.type.startsWith('video/') ? (
                                            <video src={file.url} controls />
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No products found</div>
                )}
            </div>
        </>
    );
};

export default Catalog;