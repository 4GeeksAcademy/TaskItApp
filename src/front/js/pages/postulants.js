import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';

const Postulants = () => {
    const { store, actions } = useContext(Context);
    const [taskId, setTaskId] = useState('');
    const [seekerId, setSeekerId] = useState('');
    const [applicationDate, setApplicationDate] = useState('');
    const [status, setStatus] = useState('');
    const [price, setPrice] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Llama a la acción getPostulants al cargar el componente
    useEffect(() => {
        actions.getPostulants();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            actions.editPostulant(editId, taskId, seekerId, applicationDate, status, price);
        } else {
            actions.addPostulant(taskId, seekerId, applicationDate, status, price);
        }
        setTaskId('');
        setSeekerId('');
        setApplicationDate('');
        setStatus('');
        setPrice('');
        setEditMode(false);
        setEditId(null);
    };

    const handleDelete = (id) => {
        actions.deletePostulant(id);
    };

    const handleEdit = (postulant) => {
        setEditMode(true);
        setEditId(postulant.id);
        setTaskId(postulant.task_id);
        setSeekerId(postulant.seeker_id);
        setApplicationDate(postulant.application_date);
        setStatus(postulant.status);
        setPrice(postulant.price);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="taskId" className="form-label">Task ID:</label>
                    <input
                        type="text"
                        id="taskId"
                        value={taskId}
                        onChange={(e) => setTaskId(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="seekerId" className="form-label">Seeker ID:</label>
                    <input
                        type="text"
                        id="seekerId"
                        value={seekerId}
                        onChange={(e) => setSeekerId(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="applicationDate" className="form-label">Application Date:</label>
                    <input
                        type="text"
                        id="applicationDate"
                        value={applicationDate}
                        onChange={(e) => setApplicationDate(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <input
                        type="text"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price:</label>
                    <input
                        type="text"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editMode ? 'Save Changes' : 'Add Postulant'}
                </button>
                {editMode && (
                    <button
                        type="button"
                        className="btn btn-secondary mx-2"
                        onClick={() => {
                            setEditMode(false);
                            setEditId(null);
                            setTaskId('');
                            setSeekerId('');
                            setApplicationDate('');
                            setStatus('');
                            setPrice('');
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>
            {/* Mostrar los postulantes añadidos */}
            <div>
                <h2>Postulants:</h2>
                <ul className="list-group">
                    {store.postulants.map((postulant, index) => (
                        <li key={index} className="list-group-item">
                            <div><strong>Task ID:</strong> {postulant.task_id}</div>
                            <div><strong>Seeker ID:</strong> {postulant.seeker_id}</div>
                            <div><strong>Application Date:</strong> {postulant.application_date}</div>
                            <div><strong>Status:</strong> {postulant.status}</div>
                            <div><strong>Price:</strong> {postulant.price}</div>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(postulant.id)}
                            >
                                Delete
                            </button>
                            <button
                                className="btn btn-success mx-2"
                                onClick={() => handleEdit(postulant)}
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

export default Postulants;