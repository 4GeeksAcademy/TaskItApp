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
			postulants: [],
			editing: false,
			ratings: [],
			auth: false,
			access_token: "",
			login_error: "",
			signup_error: "",
			valid_token: false,
		},
		actions: {
			setEditing: (bool) => { setStore({ editing: bool })},
			setAuth: (bool) => { setStore({ auth: bool })},
			setUser: (username) => { 
				const user = getStore().users.filter((userInfo) => userInfo.username == username);
				setStore({ user: user, auth: true })
			},
			resetMessages: () => { setStore({ message: "", error: "" }) },
			setError: (error) => { setStore({ message: "", error: error }) },
			timeAgo: (isoTime) => {
				const now = new Date();
				const time = new Date(isoTime);
				const diff = now - time;
		
				const seconds = Math.floor(diff / 1000);
			
				const intervals = {
					year: 31536000,
					month: 2592000,
					week: 604800,
					day: 86400,
					hour: 3600,
					minute: 60
				};
			
				for (const [unit, secondsInterval] of Object.entries(intervals)) {
					const intervalCount = Math.floor(seconds / secondsInterval);
					if (intervalCount >= 1) {
						return `${intervalCount} ${unit}${intervalCount === 1 ? '' : 's'} ago`;
					}
				}
			
				return 'Just now';
			},

			getCoordinates: async (address) => {
				const formattedAddress = address.replace(/\s+/g, '+');
				const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=AIzaSyAbDzpCV-I2_PaflkmFtXby6R0WelVOapw`;
		
				try {
					const response = await fetch(url);
					const data = await response.json();
		
					if (data.status === 'OK') {
						const lat = data.results[0].geometry.location.lat;
						const lgt = data.results[0].geometry.location.lng;
						return { lat, lgt };
					} else {
						console.error('Geocoding failed:', data.status);
						return null;
					}
				} catch (error) {
					console.error('Error:', error);
					return null;
				}
			},

			// TASKS
            getTasks: () => {
				fetchHelper(
					process.env.BACKEND_URL + "/api/tasks", // url como siempre
					{}, 									// la configuración del request, en este caso vacía porque es un GET
					(data) => setStore({ tasks: data })		// función a realizar despues de que una respuesta sea buena
				)
			},

			getTask: (id) => {
				return new Promise((resolve, reject) => {
					fetchHelper(
						process.env.BACKEND_URL + `/api/tasks/${id}`, 
						{}, 
						(data) => resolve(data),
						(error) => {
							console.error(error);
							reject(error);
						}
					);
				});
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

            addTask: (title, description, deliveryLocation, pickupLocation, dueDate, category, budget, deliveryLat, deliveryLgt, pickupLat, pickupLgt) => {
				const newTask = {
					"title": title,
					"description": description,
					"delivery_location": deliveryLocation,
					"delivery_lat": deliveryLat,
					"delivery_lgt": deliveryLgt,
					"pickup_location": pickupLocation,
					"pickup_lat": pickupLat,
					"pickup_lgt": pickupLgt,
					"due_date": dueDate,
					"category_id": category,
					"requester_id": getStore().user.id,
					"budget": budget
				}

				const config = { 
					method: "POST",
					body: JSON.stringify(newTask),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					mode: 'cors'
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/tasks`,
					config,
					() => getActions().getTasks()
				);
			},

			editTask: (id, title, description, deliveryLocation, pickupLocation, dueDate, category, seekerID, budget, deliveryLat, deliveryLgt, pickupLat, pickupLgt) => {
				const task = {
					"title": title,
					"description": description,
					"delivery_location": deliveryLocation,
					"delivery_lat": deliveryLat,
					"delivery_lgt": deliveryLgt,
					"pickup_location": pickupLocation,
					"pickup_lat": pickupLat,
					"pickup_lgt": pickupLgt,
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

            editAddress: (id, address, lat, lgt, userID) => {
                const addressObj = {
                    address,
                    lat,
                    lgt,
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
		

			addRating: (stars, seeker_id, requester_id, task_id, review) => {
				const config = { 
					method: "POST",
					body: JSON.stringify({ stars, seeker_id, requester_id, task_id, review }),
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

			editRating: (id, stars, review) => {
				const config = { 
					method: "PUT",
					body: JSON.stringify({ stars, review }),
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


			//POSTULANT
			getPostulants: () => {
				fetchHelper(
					process.env.BACKEND_URL + "/api/postulants", // url como siempre
					{}, 									// la configuración del request, en este caso vacía porque es un GET
					(data) => setStore({ postulants: data })		// función a realizar despues de que una respuesta sea buena
				)
			},

			deletePostulant: (id) => {
				const config = { 
					method: "DELETE",
					headers: { 'Accept': 'application/json' }
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/postulants/${id}`,
					config,
					() => getActions().getPostulants(),
				)
			},

            addPostulant: (taskId, seekerId, applicationDate, status, price) => {
				const newPostulant = {
					"task_id": taskId,
					"seeker_id": seekerId,
					"application_date": applicationDate,
					"status": status,
					"price": price,
					
				}

				const config = { 
					method: "POST",
					body: JSON.stringify(newPostulant),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}

				fetchHelper(
					process.env.BACKEND_URL + `/api/postulants`,
					config,
					() => getActions().getPostulants()
				);
			},

			editPostulant: (id, taskId, seekerId, applicationDate, status, price) => {
				const postulant = {
					"task_id": taskId,
					"seeker_id": seekerId,
					"application_date": applicationDate,
					"status": status,
					"price": price
				}
			
				const config = { 
					method: "PUT",
					body: JSON.stringify(postulant),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}
			
				fetchHelper(
					process.env.BACKEND_URL + `/api/postulants/${id}`,
					config,
					() => getActions().getPostulants()
				);
			},
			signup: (email, password, username, fullName, description) => {
				const newUser = { username, email, password, full_name: fullName, description };
				const config = { 
					method: "POST",
					body: JSON.stringify(newUser),
					headers: { 'Content-Type': 'application/json' }
				};
			
				return fetch(process.env.BACKEND_URL + "/api/signup", config)
					.then((response) => {
						if (!response.ok) {
							return response.json().then((error) => {
								setStore({ signup_error: error.error });
								throw new Error(error.error);
							});
						}
					})
					.catch((error) => console.log(error));
			},
			
			login: (username, password) => {
				const credentials = { username, password };
				const config = { 
					method: "POST",
					body: JSON.stringify(credentials),
					headers: { 'Content-Type': 'application/json' }
				};
			
				return fetch(process.env.BACKEND_URL + "/api/login", config)
					.then((response) => {
						if (!response.ok) {
							return response.json().then((error) => {
								setStore({ login_error: error.error });
								throw new Error(error.error);
							});
						} else {
							return response.json();
						}
					})
					.then((data) => {
						// Almacenar el token en localStorage
						localStorage.setItem('access_token', data.access_token);
						setStore({ access_token: data.access_token, user: data.user, auth: true, login_error: "", signup_error: "" });
						console.log(data.user)
					})
					.catch((error) => console.log(error));
			},
			
			logout: () => {
				localStorage.removeItem('access_token');
				setStore({ access_token: "", user: null, auth: false });
			},
			
			validateToken: () => {
				const token = localStorage.getItem('access_token');
				if (!token) {
					setStore({ valid_token: false, auth: false });
					return Promise.resolve(false);
				}
			
				const config = {
					method: 'GET',
					headers: { 'Authorization': `Bearer ${token}` }
				};
			
				return fetch(process.env.BACKEND_URL + "/api/validate-token", config)
					.then((response) => {
						if (!response.ok) {
							setStore({ valid_token: false });
							return false;
						} else {
							return response.json();
						}
					})
					.then((data) => {
						if (data.valid) {
							setStore({ valid_token: true, user: data.user, auth: true });
						} else {
							setStore({ valid_token: false, auth: false });
						}
						return data.valid;
					})
					.catch((error) => {
						console.error(error);
						setStore({ valid_token: false, auth: false });
						return false;
					});
			},
			

		}
	};
};

export default getState;