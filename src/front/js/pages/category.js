import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Task from "../component/task/task_card.jsx";
import SortBy from "../component/sort_by.jsx";

export const Category = () => {
	const { actions } = useContext(Context);
	const params = useParams();
    const [tasks, setTasks] = useState([]);
	const [categoryName, setCategoryName] = useState('');
    
	useEffect(() => {
		const loadInfo = async () => {
			const currentCategory = await actions.getCategoryByName(params.thecategory.replace(/-+/g, ' '));
			setTasks(currentCategory.category.tasks);
			setCategoryName(currentCategory.category.name);
		}

		loadInfo();
	}, [params.thecategory])

	const handleSort = (sortKey, sortOrder) => {
        const sortedTasks = [...tasks].sort((a, b) => {
            if (!a.hasOwnProperty(sortKey) || !b.hasOwnProperty(sortKey)) return 0; 
            if (sortKey === "budget") {
                const aValue = parseFloat(a[sortKey]) || 0;
                const bValue = parseFloat(b[sortKey]) || 0;
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
    
            if (typeof a[sortKey] === 'number' && typeof b[sortKey] === 'number') {
                return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
            } else {
                const aValue = a[sortKey].toString();
                const bValue = b[sortKey].toString();
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
        });
    
        setTasks(sortedTasks);
    };

	return (
		<div className="container-fluid px-5">            
			<SortBy onSort={handleSort} />
            <div className="text-center"><h1>{categoryName}</h1></div>
            <div className="row">
                {tasks?.map((task) => {
                    return (
                        <React.Fragment key={task.id + 'tcat'}>
                            <Task taskInfo={task}></Task>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
	);
};

Category.propTypes = {
	match: PropTypes.object
};
