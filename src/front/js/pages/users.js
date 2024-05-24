import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import UserList from "../component/user/user_list.jsx";
import UserForm from "../component/user/user_form.jsx";

export const Users = () => {
	const { store } = useContext(Context);
	return (
		<div className="text-center mt-5">
            {!store.editing && <UserForm></UserForm>}
			<UserList></UserList>
		</div>
	);
};
