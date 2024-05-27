import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../store/appContext.js';
import Alert from '../alert.jsx';

const UserForm = (props) => {
    const { store, actions } = useContext(Context);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if(props.currentUser) {
            setUsername(props.currentUser.username);
            setEmail(props.currentUser.email);
            if (props.currentUser.description) setDescription(props.currentUser.description);
            setPassword(props.currentUser.password);
            setFullName(props.currentUser.full_name);
        }
    }, [])

    const handleSubmit = () => {
        event.preventDefault();
        if(props.currentUser) actions.editUser(props.currentUser.id, username, email, password, fullName, description) 
        else actions.addUser(username, email, password, fullName, description);
    };

    return (
        <div className={`card ${props.currentUser ? "" : 'col-6'}`}>
            {(store.message || store.error) && <Alert message={store.message} error={store.error} ></Alert>}
                <form id="user-form" onSubmit={handleSubmit}>
                    <label htmlFor='username'>Username</label>
                    <input type="text" className="form-control" placeholder="username" aria-label="username" id='username' aria-describedby="basic-addon1" value={username} onChange={(e) => setUsername(e.target.value)} />

                    <label htmlFor='email'>Email</label>
                    <input type="text" className="form-control" placeholder="janedoe@email.com" aria-label="email" id='email' aria-describedby="basic-addon1" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor='description'>Description</label>
                    <input type="text" className="form-control" placeholder="description" aria-label="description" id='description' aria-describedby="basic-addon1" value={description} onChange={(e) => setDescription(e.target.value)} />
                    
                    {!props.currentUser && 
                    <><label htmlFor='password'>password</label>
                    <input type="password" className="form-control" aria-label="password" id='password' aria-describedby="basic-addon1" value={password} onChange={(e) => setPassword(e.target.value)} /></>}

                    <label htmlFor='full-name'>Full Name</label>
                    <input type="text" className="form-control" placeholder="Jane Doe" aria-label="full name" id='full-name' aria-describedby="basic-addon1" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </form>
                {props.currentUser && <button type="button" className="btn btn-secondary" onClick={props.handleClose}>Close</button>}
                <button type="submit" form="user-form" className="btn btn-primary">Post</button>
        </div>
    );
}

export default UserForm;