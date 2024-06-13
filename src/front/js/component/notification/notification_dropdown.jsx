import React, { useContext, useEffect, useRef } from "react";
import "../../../styles/dropdown.css"; 
import { Context } from "../../store/appContext";

const NotificationDropdown = ({ dropdownVisible, setDropdownVisible }) => {
    const { store, actions } = useContext(Context);

    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if(store.notifications.length > 0) markAsSeen();
        if(!dropdownVisible) actions.emptyNotifications();
    }, [dropdownVisible]);

    function markAsSeen() {
        for(let notification of store.notifications) {
            if(notification.id) {
                fetch(process.env.BACKEND_URL+ `/api/notifications/${notification.id}`, { method: 'PUT' })
                .catch(error => console.error(error))
            }
        }
    }

    return (
        <div ref={ref} className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`} style={{ zIndex: 1, maxHeight: '60vh' }}>
            { store.notifications.map((notification, index) => {
                return (
                    <div key={index + notification.message[0]}>
                        <div className="dropdown-item disabled"><span>{notification.message}</span></div>
                        { (index + 1) < store.notifications.length && <div className="dropdown-divider"></div> }
                    </div>
                )
            })}
        </div>
    )
}

export default NotificationDropdown;