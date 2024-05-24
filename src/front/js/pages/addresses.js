import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { Link } from "react-router-dom";

const Addresses = () => {
    const { store, actions } = useContext(Context);
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Llama a la acción getAddresses al cargar el componente
    useEffect(() => {
        actions.getAddresses();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            actions.editAddress(editId, address, latitude, longitude);
        } else {
            actions.addAddress(address, latitude, longitude);
        }
        setAddress('');
        setLatitude('');
        setLongitude('');
        setEditMode(false);
        setEditId(null);
    };

    const handleDelete = (id) => {
        actions.deleteAddresses(id);
    };

    const handleEdit = (addr) => {
        setEditMode(true);
        setEditId(addr.id);
        setAddress(addr.address);
        setLatitude(addr.latitude);
        setLongitude(addr.longitude);
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
                <button type="submit" className="btn btn-primary">
                    {editMode ? 'Save Changes' : 'Add Address'}
                </button>
                {editMode && (
                    <button
                        type="button"
                        className="btn btn-secondary mx-2"
                        onClick={() => {
                            setEditMode(false);
                            setEditId(null);
                            setAddress('');
                            setLatitude('');
                            setLongitude('');
                        }}
                    >
                        Cancel
                    </button>
                )}
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
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(addr.id)}
                            >
                                Delete
                            </button>
                            <button
                                className="btn btn-success mx-2"
                                onClick={() => handleEdit(addr)}
                            >
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Addresses;
