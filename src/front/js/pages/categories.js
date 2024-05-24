// src/front/js/component/CategoryList.js

import React, { useState, useEffect, useContext,  } from 'react' ;
import { Context } from '../store/appContext';

const CategoryList = () => {
    const [newCategoryName, setNewCategoryName] = useState("");
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getCategories();
    }, []);

    return (
        <div>
            <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Add new category"
                />
            <button onClick={() => actions.addCategory (newCategoryName)}>Add Category</button>
            <ul>
                {store.categories.map(category => (   
                    <li key={category.id}>
                        <span>{category.name}</span>
                        <button onClick={() => actions.deleteCategory(category.id)}>Delete</button>
                        <button onClick={() => actions.editCategory(category.id, prompt("New name:", category.name))}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
