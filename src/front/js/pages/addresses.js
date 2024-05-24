import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';

const Addresses = () => {
    const { store, actions } = useContext(Context);
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // Llama a la acción getAddresses al cargar el componente
    useEffect(() => {
        actions.getAddresses();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.addAddress(address, latitude, longitude);
        setAddress('');
        setLatitude('');
        setLongitude('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="latitude" className="form-label">Latitude:</label>
                    <input
                        type="text"
                        id="latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="longitude" className="form-label">Longitude:</label>
                    <input
                        type="text"
                        id="longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Address</button>
            </form>
            {/* Mostrar las direcciones añadidas */}
            <div>
                <h2>Addresses:</h2>
                <ul className="list-group">
                    {store.addresses.map((addr, index) => (
                        <li key={index} className="list-group-item">
                            <div><strong>Address:</strong> {addr.address}</div>
                            <div><strong>Latitude:</strong> {addr.latitude}</div>
                            <div><strong>Longitude:</strong> {addr.longitude}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Addresses;
