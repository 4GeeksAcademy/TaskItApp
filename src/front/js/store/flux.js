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
					process.env.BACKEND_URL + "/api/tasks", // url como siempre
					{}, 									// la configuración del request, en este caso vacía porque es un GET
					(data) => setStore({ tasks: data })		// función a realizar despues de que una respuesta sea buena
				)
			},

			deleteTask: (id) => {
				const config = { 
					method: "DELETE",
					headers: { 'Accept': 'application/json' }
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/tasks/${id}`,
					config,
					() => getActions().getTasks(),
				)
			},
		}
	};
};

export default getState;
