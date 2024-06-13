import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Context } from "../store/appContext";

const BackButton = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    const goBack = () => {
        actions.setFromApplicants(true);
        navigate(-1); 
    };
  
    return (
        <div>
            <button className="btn-clear-dark px-3 mb-4" onClick={goBack}><Icon icon="ion:arrow-back" /> Go Back</button>
        </div>
    );
}

export default BackButton;