import React, { useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import useScreenWidth from "../hooks/useScreenWidth.jsx";

const SortBy = (props) => {
    const KEY = { id: "ID", budget: "Budget", creation_date: "Creation Date", due_date: "Due Date" }
    const [key, setKey] = useState('ID')
    const [sortKey, setSortKey] = useState('id');
    const [sortOrder, setSortOrder] = useState("asc"); 
    const smallDevice = useScreenWidth();

    const handleSortKeySelect = (eventKey) => {
        setSortKey(eventKey);
        if (props.onSort) {
            props.onSort(eventKey, sortOrder);
            setKey(KEY[eventKey]);
        }
    };

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        if (props.onSort) {
            props.onSort(sortKey, newSortOrder);
        }
    };

    return (
        <div className={`d-flex mb-4 gap-2 w-100 ${smallDevice ? "justify-content-between" : ""}`}>
            <DropdownButton variant="clear-dark px-2" id="dropdown-basic-button" title={`Sort By: ${key}`} onSelect={handleSortKeySelect}>
                <Dropdown.Item eventKey="id">ID</Dropdown.Item>
                <Dropdown.Item eventKey="budget">Budget</Dropdown.Item>
                <Dropdown.Item eventKey="creation_date">Creation Date</Dropdown.Item>
                <Dropdown.Item eventKey="due_date">Due Date</Dropdown.Item>
            </DropdownButton>
            <div className="flex-grow-1">
                <button className={`h-100 px-2 ${sortOrder == "asc" ? 'btn-dark' : 'btn-clear-dark'} ${smallDevice ? "float-end" : ""}`} onClick={toggleSortOrder}>
                    {sortOrder === "asc" ? (<span><Icon icon="octicon:sort-asc-24" /> Ascending</span>) :  (<span><Icon icon="octicon:sort-desc-24" /> Descending</span>)}
                </button>
            </div>
        </div>
    );
}

export default SortBy;