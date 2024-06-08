import React from "react";
import "../../../styles/home.css"

const Feature = (props) => {
    return (
        <div className="col-11 col-lg-10 col-xl-4 flex-grow-1">
            <div className="card flex-grow-1 h-100 p-0">
                <div className="p-0 m-0 feature-img overflow-hidden d-flex align-items-center">
                    <img className="img-fluid" src={props.src}></img>
                </div>
                <div className="p-4">
                    <h4>{props.feature}</h4>
                    <p className="text-muted fs-4">{props.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Feature;