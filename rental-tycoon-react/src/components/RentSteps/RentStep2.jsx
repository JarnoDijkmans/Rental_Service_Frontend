import React from 'react';
import { useState, useEffect } from 'react';
import { useCart } from '../Cart/CartContext';
import checkMark from '../../assets/images/parts/blue-check.png';
import { useRef } from 'react';
import UserService from '../../services/UserService.js'

const RentStep2 = ({ setData, step2Next, productList, userId }) => {
    const [formData, setFormData] = useState({
        address: '',
        city: '',
    });
    const [selectedDiv, setSelectedDiv] = useState(1);
    const input1 = useRef(null);
    const [cartItems, setCartItems] = useState([]);
    const input2 = useRef(null);
    const { cart, removeFromCart } = useCart();
    const [input1Style, setInput1Style] = useState({});
    const [input2Style, setInput2Style] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (userId) {
            UserService.getUserById(userId).then((data) => {
                setUser(data);
                console.log("user", data);
            });
        } else {
            console.log("userId not found");
        }
    }, [userId]);

    // const calculateTotalCost = () => {
    //     let totalCost = 0;
    //     cart.forEach(cartitem => {
    //         const days = calculateDays(cartitem.startDate, cartitem.endDate);
    //         totalCost += days * cartitem.product.price;
    //     });
    //     return totalCost.toFixed(2);
    // };

    useEffect(() => {
        if (cart.length > 0) {
            setCartItems(cart);

        }
    }, [cart]);

    const calculateTotalPriceForOneItem = (product, cart) => {
        let totalCost = 0;
        cart.map((cartitem, index) => {
            if (product.id === cartitem.product.id){
                const days = calculateDays(cartitem.startDate, cartitem.endDate);
                totalCost += days * product.price;
            }
        })
        
        return totalCost.toFixed(2);
    };

    const getStartDate = () => {
        let startDate = ""; 
        cart.forEach(cartitem => {
            startDate = cartitem.startDate;
        });
        return startDate;
    }
    const getEndDate = () => {
        let endDate = ""; 
        cart.forEach(cartitem => {
            endDate = cartitem.endDate;
        });
        return endDate;
    }
    const calculateDays = (startDate, endDate) => {
        return (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    };

    const confirmData = () => {

        if (selectedDiv === 0) {
            formData.address = "Pick-up";
            formData.city = "Pick-up";
        }
        else if (selectedDiv === 1) {
            formData.address = user.address;
            formData.city = user.city;
        }
        else if (selectedDiv === 2) {
            formData.address = input1.current.value;
            formData.city = input2.current.value;
        }
        setData(formData);
        step2Next();
    }

    const handleDivClick = (index) => {
        setSelectedDiv(index);
    };

    const handleOnSubmitAdress = (e) => {
        e.preventDefault();
        setInput1Style({ background: 'rgb(227 255 228)' });
        setInput2Style({ background: 'rgb(227 255 228)' });
        const data = {
            address: input1.current.value,
            city: input2.current.value,
        };
        setFormData(data);
        console.log("data submit", data);

    };


    return (
        <>
            <div className='confirm-cart-container' >
                {productList.map((product, index) => {    
                    return (
                        <div className='confirm-cart-item' style={{ gridTemplateColumns: '1fr 1fr 1fr' }} key={index}>
                            <h3>{product.name}</h3>
                            <h3>€{calculateTotalPriceForOneItem(product, cart)}</h3>
                           
                            {product.files.map((file, fileIndex) => {
                                console.log("file", file);
                                return file.type.startsWith('image/') ? (
                                    <img src={file.url} alt={`Product File ${fileIndex}`} key={fileIndex} style={{ height: '110px', width: '140px' }} />
                                ) : file.type.startsWith('video/') ? (
                                    <video src={file.url} controls key={fileIndex} style={{ height: '110px', width: '140px' }} />
                                ) : null;
                            })}
                                <h4>Start Date: {getStartDate()}</h4> 
                                <h4>End Date: {getEndDate()}</h4> 
                            
                        </div>
                    );
                })}
            </div>
            <div className='confirm-cart-details-container'>
                <div className='confirm-cart-details-wrap'>
                    <div
                        className={`confirm-cart-details ${selectedDiv === 0 ? 'selectedCartDetail' : ''}`}
                        onClick={() => handleDivClick(0)}
                    >
                        <h3>Pick-up</h3>
                        {selectedDiv === 0 && <img src={checkMark} className="detailCheckmark" />}
                    </div>
                    <div
                        className={`confirm-cart-details ${selectedDiv === 1 ? 'selectedCartDetail' : ''}`}
                        onClick={() => handleDivClick(1)}
                    >
                        <h3>Deliver at my adress</h3>
                        {selectedDiv === 1 && <img src={checkMark} className="detailCheckmark" />}
                        <h4>{user?.address}, {user?.city}</h4>
                    </div>
                    <div
                        className={`confirm-cart-details ${selectedDiv === 2 ? 'selectedCartDetail' : ''}`}
                        onClick={() => handleDivClick(2)}
                    >
                        <h3>Deliver at specified adress</h3>
                        {selectedDiv === 2 && <img src={checkMark} className="detailCheckmark" />}
                        <form onSubmit={handleOnSubmitAdress} className='confirm-cart-details-inputs'>
                            <div>
                                <label>Adress</label>
                                <input ref={input1} type="text" name='adress' placeholder="Address" style={input1Style} onChange={() => setInput1Style({ background: '#ffdfdf' })} required />
                            </div>
                            <div>
                                <label>City</label>
                                <input ref={input2} type="text" name='city' placeholder="City" style={input2Style} onChange={() => setInput2Style({ background: '#ffdfdf' })} required />
                            </div>
                            <div>
                                <button type='submit'>Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='confirm-step2-button-container'>
                <button onClick={confirmData} className='confirm-cart-button'>Next step</button>
            </div>
        </>
    );
};

export default RentStep2;
