const getState = ({ getStore, getActions, setStore }) => {
	const fetchHelper = async (url, config = {}, successCallback) => {
		try {
			const response = await fetch(url, config);
			const data = await response.json();
			if (response.ok) {
				if (successCallback) successCallback(data);
				setStore({ message: data.message || "", error: "" });
			} else setStore({ message: "", error: data.error || "An error occurred" });
		} catch (error) {
			console.error(error);
		}
		
	};

	return {
		store: {
			message: null,
			error: "",
			categories: [],
		},
		actions: {
			getCategories: () => {
				fetchHelper(
					process.env.BACKEND_URL + "/api/categories", // url como siempre
					{}, 									// la configuración del request, en este caso vacía porque es un GET
					(data) => setStore({ categories: data.categories })		// función a realizar despues de que una respuesta sea buena
				)
			},

			deleteCategory: (id) => {
				const config = { 
					method: "DELETE",
					headers: { 'Accept': 'application/json' }
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/categories/${id}`,
					config,
					() => getActions().getCategories(),
				)
			},
			editCategory: (id, name) => {
				const config = { 
					method: "PUT",
					body: JSON.stringify({"name":name}),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}
				fetchHelper(
					process.env.BACKEND_URL + `/api/categories/${id}`,
					config,
					() => getActions().getCategories(),
				)
			},addCategory: (name) => {
				const config = { 
					method: "POST",
					body: JSON.stringify({"name":name}),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}
				fetchHelper(
					process.env.BACKEND_URL + `/api/categories`,
					config,
					() => getActions().getCategories(),
				)
			},
		}
	};
};

export default getState;
