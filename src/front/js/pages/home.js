import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import UserTaskList from "../component/task/user_tasks_list.jsx";
import AppliedToTaskList from "../component/task/applied_to_tasks.jsx";
import CompletedTasksList from "../component/task/completed_tasks_list.jsx";
import ProfileSetup from "../component/user/profile_setup.jsx";
import Hero from "../component/landing/hero.jsx";
import Features from "../component/landing/features.jsx";
import HowItWorks from "../component/landing/how_it_works.jsx";

export const Home = () => {
	const { store } = useContext(Context);

	return (
		<div>
			{ store.auth 
				? <div>
					{(store.user.role) == "none" && <ProfileSetup></ProfileSetup>}
					{(store.user.role == "requester" || store.user.role == "both") && 
						<>
							<UserTaskList></UserTaskList>
							<CompletedTasksList role={"requester"} />
						</>
					}
					{(store.user.role == "task_seeker" || store.user.role == "both") && 
						<>	
							<AppliedToTaskList></AppliedToTaskList>
							<CompletedTasksList role={"seeker"} />
						</>
					}
				</div>
				: <div>
					<Hero />
					<Features />
					<HowItWorks />
				</div>
			}
		</div>
	);
};
