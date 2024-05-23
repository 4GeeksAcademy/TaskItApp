import React from "react";
import TaskList from "../component/task_feed/tasks_list.jsx";
import PostTask from "../component/task_feed/post_task.jsx";

export const TaskFeed = () => {
	return (
		<div className="text-center mt-5">
			<PostTask></PostTask>
			<TaskList></TaskList>
		</div>
	);
};
