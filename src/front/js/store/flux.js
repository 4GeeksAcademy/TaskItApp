const getState = ({ getStore, getActions, setStore }) => {
    const fetchHelper = async (url, config = {}, successCallback) => {
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (response.ok) {
                if (successCallback) successCallback(data);
                const prevMessage = getStore().message;
                setStore({ message: data.message || prevMessage, error: "" });
            } else {
                setStore({ message: "", error: data.error || "An error occurred" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return {
        store: {
            message: "",
            error: "",
            addresses: [],
        },
        actions: {
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

            editTask: (id, address, latitude, longitude) => {
                const task = {
                    address,
                    latitude,
                    longitude,
                };

                const config = {
                    method: "PUT",
                    body: JSON.stringify(task),
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

            getMessage: () => {
                fetchHelper(
                    process.env.BACKEND_URL + "/api/message",
                    {},
                    (data) => setStore({ message: data.message })
                );
            }
        }
    };
};

export default getState;



// const getState = ({ getStore, getActions, setStore }) => {
// 	return {
// 		store: {
// 			message: null,
// 			demo: [
// 				{
// 					title: "FIRST",
// 					background: "white",
// 					initial: "white"
// 				},
// 				{
// 					title: "SECOND",
// 					background: "white",
// 					initial: "white"
// 				}
// 			]
// 		},
// 		actions: {
// 			// Use getActions to call a function within a fuction
// 			exampleFunction: () => {
// 				getActions().changeColor(0, "green");
// 			},

// 			getMessage: async () => {
// 				try{
// 					// fetching data from the backend
// 					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
// 					const data = await resp.json()
// 					setStore({ message: data.message })
// 					// don't forget to return something, that is how the async resolves
// 					return data;
// 				}catch(error){
// 					console.log("Error loading message from backend", error)
// 				}
// 			},
// 			changeColor: (index, color) => {
// 				//get the store
// 				const store = getStore();

// 				//we have to loop the entire demo array to look for the respective index
// 				//and change its color
// 				const demo = store.demo.map((elm, i) => {
// 					if (i === index) elm.background = color;
// 					return elm;
// 				});

// 				//reset the global store
// 				setStore({ demo: demo });
// 			}
// 		}
// 	};
// };

// export default getState;
