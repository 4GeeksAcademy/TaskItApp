import React from "react";
import TaskList from "../component/task/tasks_list.jsx";
import PostTask from "../component/task/post_task.jsx";

export const TaskFeed = () => {
	return (
		<div className="text-center mt-5">
			<PostTask></PostTask>
			<TaskList></TaskList>
		</div>
	);
};
