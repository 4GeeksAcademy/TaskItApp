import React from "react";
import SeekerList from "../component/seeker/seeker_list.jsx";
import SeekerForm from "../component/seeker/seeker_form.jsx";

export const Seekers = () => {
	return (
		<div className="text-center mt-5">
            <SeekerForm></SeekerForm>
			<SeekerList></SeekerList>
		</div>
	);
};
