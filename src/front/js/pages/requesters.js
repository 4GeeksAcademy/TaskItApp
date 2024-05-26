import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import RequesterList from "../component/requester/requester_list.jsx";
import RequesterForm from "../component/requester/requester_form.jsx";

export const Requesters = () => {
	const { store } = useContext(Context);
	return (
		<div className="text-center mt-5">
            <RequesterForm></RequesterForm>
			<RequesterList></RequesterList>
		</div>
	);
};
