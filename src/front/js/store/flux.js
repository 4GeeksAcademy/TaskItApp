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
            addresses: [],
			categories: [],
			users: [],								
			user: { role: "both" }, 
			requesters: [],
			seekers: [],
			editing: false,
			ratings: [],
			auth: false,
		},
		actions: {
			setEditing: (bool) => { setStore({ editing: bool })},
			setAuth: (bool) => { setStore({ auth: bool })},
			setUser: (username) => { 
				const user = getStore().users.filter((userInfo) => userInfo.username == username);
				setStore({ user: user, auth: true })
			},

			// TASKS
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

            addTask: (title, description, deliveryLocation, pickupLocation, dueDate, category, budget) => {
				const newTask = {
					"title": title,
					"description": description,
					"delivery_location": deliveryLocation,
					"pickup_location": pickupLocation,
					"due_date": dueDate,
					"category_id": category,
					"requester_id": getStore().user[0].id,
					"budget": budget
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

			editTask: (id, title, description, deliveryLocation, pickupLocation, dueDate, category, seekerID, budget) => {
				const task = {
					"title": title,
					"description": description,
					"delivery_location": deliveryLocation,
					"pickup_location": pickupLocation,
					"due_date": dueDate,
					"category": category,
					"seeker_id": seekerID,
					"budget": budget
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

			// ADDRESSES
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

            addAddress: (address, latitude, longitude, userID) => {
                const newAddress = {
                    address,
                    latitude,
                    longitude,
					user_id: userID,
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

            editAddress: (id, address, latitude, longitude, userID) => {
                const addressObj = {
                    address,
                    latitude,
                    longitude,
					user_id: userID
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
            },

			// CATEGORIES
			getCategories: () => {
				fetchHelper(
					process.env.BACKEND_URL + "/api/categories", 
					{}, 									
					(data) => setStore({ categories: data.categories })		
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
			},
			
			addCategory: (name) => {
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

			// USERS
			getUsers: () => {
				fetchHelper(
					process.env.BACKEND_URL + "/api/users", // url como siempre
					{}, 									// la configuración del request, en este caso vacía porque es un GET
					(data) => setStore({ users: data })		// función a realizar despues de que una respuesta sea buena
				)
			},

			getUserByUsername: (username) => {
				return new Promise((resolve, reject) => {
					fetchHelper(
						`${process.env.BACKEND_URL}/api/users/${username}`, 
						{}, 
						(data) => resolve(data),
						(error) => {
							console.error(error);
							reject(error);
						}
					);
				});
			},


			deleteUser: (id) => {
				const config = { 
					method: "DELETE",
					headers: { 'Accept': 'application/json' }
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/users/${id}`,
					config,
					() => getActions().getUsers(),
				)
			},

            addUser: (username, email, password, fullName, description) => {
				const newUser = {
					"username": username,
					"email": email,
					"password": password,
					"full_name": fullName,
					"description": description,
				}

				const config = { 
					method: "POST",
					body: JSON.stringify(newUser),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/users`,
					config,
					() => getActions().getUsers()
				);
			},

			editUser: (id, username, email, password, fullName, description) => {
				const user = {
					"username": username,
					"email": email,
					"password": password,
					"full_name": fullName,
					"description": description,
				}

				const config = { 
					method: "PUT",
					body: JSON.stringify(user),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/users/${id}`,
					config,
					() => getActions().getUsers()
				);
			},
			

			// REQUESTERS
			getRequesters: () => {
				fetchHelper(
					process.env.BACKEND_URL + "/api/requesters", 
					{}, 									
					(data) => setStore({ requesters: data })		
				)
			},

			getRequester: (id) => {
				return new Promise((resolve, reject) => {
					fetchHelper(
						`${process.env.BACKEND_URL}/api/requesters/user_id/${id}`, 
						{}, 
						(data) => resolve(data),
						(error) => {
							console.error(error);
							reject(error);
						}
					);
				});
			},

			deleteRequester: (id) => {
				const config = { 
					method: "DELETE",
					headers: { 'Accept': 'application/json' }
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/requesters/${id}`,
					config,
					() => getActions().getRequesters(),
				)
			},

            addRequester: (userID) => {
				const newRequester = {
					"user_id": userID
				}

				const config = { 
					method: "POST",
					body: JSON.stringify(newRequester),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/requesters`,
					config,
					() => getActions().getRequesters()
				);
			},

			editRequester: (id, overallRating, totalRequestedTasks, totalReviews, averageBudget) => {
				const requester = {
					"overall_rating": overallRating,
					"total_requested_tasks": totalRequestedTasks,
					"total_reviews": totalReviews,
					"average_budget": averageBudget,
				}

				const config = { 
					method: "PUT",
					body: JSON.stringify(requester),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/requesters/${id}`,
					config,
					() => getActions().getRequesters()
				);
			},

			// SEEKERS
			getSeekers: () => {
				fetchHelper(
					process.env.BACKEND_URL + "/api/task-seekers", 
					{}, 									
					(data) => setStore({ seekers: data })		
				)
			},

			getSeeker: (id) => {
				return new Promise((resolve, reject) => {
					fetchHelper(
						`${process.env.BACKEND_URL}/api/task-seekers/user_id/${id}`, 
						{}, 
						(data) => resolve(data),
						(error) => {
							console.error(error);
							reject(error);
						}
					);
				});
			},

			deleteSeeker: (id) => {
				const config = { 
					method: "DELETE",
					headers: { 'Accept': 'application/json' }
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/task-seekers/${id}`,
					config,
					() => getActions().getSeekers(),
				)
			},

            addSeeker: (userID) => {
				const newSeeker = {
					"user_id": userID
				}

				const config = { 
					method: "POST",
					body: JSON.stringify(newSeeker),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/task-seekers`,
					config,
					() => getActions().getSeekers()
				);
			},

			editSeeker: (id, overallRating, totalCompletedTasks, totalReviews) => {
				const seeker = {
					"overall_rating": overallRating,
					"total_completed_tasks": totalCompletedTasks,
					"total_reviews": totalReviews,
				}

				const config = { 
					method: "PUT",
					body: JSON.stringify(seeker),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/task-seekers/${id}`,
					config,
					() => getActions().getSeekers()
				);
			},
			
		//Rating
		getRatings: () => {
			fetchHelper(
				process.env.BACKEND_URL + "/api/ratings", 
				{}, 
				(data) => setStore({ ratings: data })
			);
		},

		addRating: (stars, seeker_id, requester_id, task_id) => {
			const config = { 
				method: "POST",
				body: JSON.stringify({ stars, seeker_id, requester_id, task_id }),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			};
			fetchHelper(
				process.env.BACKEND_URL + `/api/ratings`,
				config,
				() => getActions().getRatings()
			);
		},

		editRating: (id, stars) => {
			const config = { 
				method: "PUT",
				body: JSON.stringify({ stars }),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			};
			fetchHelper(
				process.env.BACKEND_URL + `/api/ratings/${id}`,
				config,
				() => getActions().getRatings()
			);
		},

		deleteRating: (id) => {
			const config = { 
				method: "DELETE",
				headers: { 'Accept': 'application/json' }
			};
			fetchHelper(
				process.env.BACKEND_URL + `/api/ratings/${id}`,
				config,
				() => getActions().getRatings()
			);
		},

		checkSeekerExists: async (seeker_id) => {
			const response = await fetch(`${process.env.BACKEND_URL}/api/users/${seeker_id}`);
			return response.ok;
		},

		checkRequesterExists: async (requester_id) => {
			const response = await fetch(`${process.env.BACKEND_URL}/api/users/${requester_id}`);
			return response.ok;
		},
		}
	};
};

export default getState;