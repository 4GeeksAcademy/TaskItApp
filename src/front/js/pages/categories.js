import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, Link } from 'react-router-dom';

const CategoryList = () => {
    const [newCategoryName, setNewCategoryName] = useState("");
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        // Verificar autenticación y permisos de administrador al cargar el componente
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsAuthenticated(false);
        } else {
            actions.validateAdminToken(token).then(isValid => {
                if (!isValid) {
                    setIsAuthenticated(false);
                } else {
                    setIsAuthenticated(true);
                    actions.getCategories();
                }
            });
        }
    }, []);

    const handleLogout = () => {
        actions.logoutAdmin();
        navigate('/login-admin'); // Redirigir a la página de inicio de sesión de administrador después del logout
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Mostrar un indicador de carga mientras se verifica la autenticación
    }

    if (!isAuthenticated) {
        return (
            <div className="d-flex flex-column align-items-center mt-5">
                <h2>You are not logged in</h2>
                <p>Please log in to access this page.</p>
                <Link to="/login-admin">
                    <button className="btn btn-primary">Go to Admin Login</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Categories</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            <form className="mb-4">
                <div className="input-group">
                    <input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Add new category"
                        className="form-control"
                    />
                    <button className="btn btn-success" type="button" onClick={() => { actions.addCategory(newCategoryName);
                        setNewCategoryName("");
                    }}>Add Category</button>
                </div>
            </form>
            <ul className="list-group">
                {store.categories.map(category => (
                    <li key={category.id + "cats"} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{category.name}</span>
                        <div>
                            <button className="btn btn-warning me-2" onClick={() => actions.editCategory(category.id, prompt("New name:", category.name))}>Edit</button>
                            <button className="btn btn-danger" onClick={() => actions.deleteCategory(category.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
