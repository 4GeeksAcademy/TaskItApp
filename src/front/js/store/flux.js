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
			tasks: [],
            addresses: []
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
            getAddresses: () => {
                fetchHelper(
                    process.env.BACKEND_URL + "/api/addresses",
                    {},
                    (data) => setStore({ addresses: data })
                );
            },

            deleteAddresses: (id) => {
                const config = {
                    method: "DELETE",
                    headers: { 'Accept': 'application/json' }
                };

                fetchHelper(
                    process.env.BACKEND_URL + `/api/addresses/${id}`,
                    config,
                    () => getActions().getAddresses()
                );
            },

            addAddress: (address, latitude, longitude) => {
                const newAddress = {
                    address,
                    latitude,
                    longitude,
                };

                const config = {
                    method: "POST",
                    body: JSON.stringify(newAddress),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                };

                fetchHelper(
                    process.env.BACKEND_URL + `/api/addresses`,
                    config,
                    () => getActions().getAddresses()
                );
            },

            editAddress: (id, address, latitude, longitude) => {
                const addressObj = {
                    address,
                    latitude,
                    longitude,
                };

                const config = {
                    method: "PUT",
                    body: JSON.stringify(addressObj),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                };

                fetchHelper(
                    process.env.BACKEND_URL + `/api/addresses/${id}`,
                    config,
                    () => getActions().getAddresses()
                );
            }
		}
	};
};

export default getState;