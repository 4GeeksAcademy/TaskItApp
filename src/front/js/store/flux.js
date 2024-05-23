const getState = ({ getStore, getActions, setStore }) => {
	const fetchHelper = async (url, config = {}, successCallback) => {
		try {
			const response = await fetch(url, config);
			if (response.ok) {
				const data = await response.json();
				if (successCallback) successCallback(data);
				setStore({ message: response.message || "", error: "" });
			} else setStore({ message: "", error: response.error || "An error occurred" });
			console.log(getStore())
		} catch (error) {
			console.error(error);
		}
	};

	return {
		store: {
			message: "",
			error: "",
			tasks: []
		},
		actions: {

			getTasks: () => {
				fetchHelper(
					process.env.BACKEND_URL + "/api/tasks",
					{},
					(data) => setStore({ tasks: data })
				)
			},
		}
	};
};

export default getState;
