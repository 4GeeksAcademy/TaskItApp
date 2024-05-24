const getState = ({ getStore, getActions, setStore }) => {
	const fetchHelper = async (url, config = {}, successCallback) => {
		try {
			const response = await fetch(url, config);
			const data = await response.json();
			if (response.ok) {
				if (successCallback) successCallback(data);
				const prevMessage = getStore().message;
				setStore({ message: data.message || prevMessage, error: "" });
			} else setStore({ message: "", error: data.error || "An error occurred" });
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

			addTask: (title, description, deliveryLocation, pickupLocation, dueDate) => {
				const newTask = {
					"title": title,
					"description": description,
					"delivery_location": deliveryLocation,
					"pickup_location": pickupLocation,
					"due_date": dueDate,
				}

				const config = { 
					method: "POST",
					body: JSON.stringify(newTask),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/tasks`,
					config,
					() => getActions().getTasks()
				);
			},

			editTask: (id, title, description, deliveryLocation, pickupLocation, dueDate) => {
				const task = {
					"title": title,
					"description": description,
					"delivery_location": deliveryLocation,
					"pickup_location": pickupLocation,
					"due_date": dueDate,
				}

				const config = { 
					method: "PUT",
					body: JSON.stringify(task),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/tasks/${id}`,
					config,
					() => getActions().getTasks()
				);
			},
		}
	};
};

export default getState;
