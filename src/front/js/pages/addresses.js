import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta de importación sea correcta

const Addresses = () => {
    const { store, actions } = useContext(Context);

    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.addAddress(address, latitude, longitude);
        setAddress('');
        setLatitude('');
        setLongitude('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-2"
                    required
                />
            </div>
            <div>
                <label htmlFor="latitude">Latitude:</label>
                <input
                    type="text"
                    id="latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="mt-2"
                    required
                />
            </div>
            <div>
                <label htmlFor="longitude">Longitude:</label>
                <input
                    type="text"
                    id="longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="mt-2"
                    required
                />
            </div>
            <button type="submit" className="mt-2">Add Address</button>
        </form>
    );
};

export default Addresses;
