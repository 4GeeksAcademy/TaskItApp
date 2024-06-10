import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Task from "../component/task/task_card.jsx";

export const Category = () => {
	const { actions } = useContext(Context);
	const params = useParams();
    const [category, setCategory] = useState({});
    
	useEffect(() => {
		const loadInfo = async () => {
			const currentCategory = await actions.getCategoryByName(params.thecategory.replace(/-+/g, ' '));
			setCategory(currentCategory.category);
		}

		loadInfo();
	}, [params.thecategory])

	return (
		<div className="container-fluid px-5">
            <div className="text-center"><h1>{category.name}</h1></div>
            <div className="row">
                {category?.tasks?.map((task) => {
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
