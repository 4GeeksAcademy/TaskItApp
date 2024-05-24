import React from "react";

const Alert = (props) => {
    return(
        <div className={`alert ${props.message ? 'alert-success' : 'alert-danger'}`} role="alert">
            {props.message || props.error}
        </div>
    );
}

export default Alert;