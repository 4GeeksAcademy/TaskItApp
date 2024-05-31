import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext";

const AddressInput = (props) => {
    const { store, actions } = useContext(Context);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        actions.getAddresses();
    }, []);

    const getSuggestions = async (address) => {
        if (address.length > 7) {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAbDzpCV-I2_PaflkmFtXby6R0WelVOapw`);
                const data = await response.json();
                if (data.status === 'OK') {
                    const suggestions = data.results.map(result => result.formatted_address);
                    setSuggestions(suggestions);
                } else setSuggestions([]); 
            } catch (error) {
                console.error('Error:', error);
                setSuggestions([]);
            }
        } else setSuggestions([]);
    };

           
    const handleChange = (event) => {
        getSuggestions(event.target.value);
        if (props.handleChange) props.handleChange(event.target.value);
    };

    
    const handleSuggestionClick = (suggestion) => {
        if (props.handleChange) props.handleChange(suggestion);
        setSuggestions([]); 
    };

    const saveAddress = async (event) => {
        event.preventDefault();
        const coordinates = await actions.getCoordinates(props.value);
        if (coordinates) {
            const { lat, lgt } = coordinates;
            actions.addAddress(props.value, lat, lgt, store.user.id);
        }
    };
    
    return (
        <>
            <label htmlFor='addresses'>{props.label || "Address"}</label>
            <div id="addresses">
                { store.addresses.length > 0 &&
                    <select 
                        className="form-select select-options" 
                        aria-label="addresses list" 
                        id="address-select"
                        value={props.value}
                        onChange={(event) => props.handleChange(event.target.value)}
                    >
                        <option value="" disabled>Choose address</option>
                            {store.addresses.map((address) => (
                                <option key={address.id} value={address.address}>{address.address}</option>
                            ))}
                    </select>
                }
                
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Enter your address" aria-label="address" id='address' aria-describedby="basic-addon1" value={props.value} onChange={handleChange} />
                    <button className="btn btn-secondary" onClick={saveAddress}>Save</button>
                </div>
            </div>

            <ul className="list-group">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        className="list-group-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </li>
                ))}
            </ul>
            
        </>
    )
}

export default AddressInput;