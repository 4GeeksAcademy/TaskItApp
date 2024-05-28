import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext";

const AddressInput = (props) => {
    const { store, actions } = useContext(Context);
    const [suggestions, setSuggestions] = useState([]);

    function replaceSpacesWithPlus(text) {
        return text.replace(/\s+/g, '+');
    }

    useEffect(() => {
        actions.getAddresses();
    }, []);

    const getCoordinates = async (address) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${replaceSpacesWithPlus(address)}&key=AIzaSyAbDzpCV-I2_PaflkmFtXby6R0WelVOapw`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK') {
                const latitude = data.results[0].geometry.location.lat;
                const longitude = data.results[0].geometry.location.lng;
                return { latitude, longitude };
            } else {
                console.error('Geocoding failed:', data.status);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };

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
        const coordinates = await getCoordinates(props.value);
        console.log(coordinates)
        if (coordinates) {
            const { latitude, longitude } = coordinates;
            actions.addAddress(props.value, latitude, longitude, store.user[0].id);
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