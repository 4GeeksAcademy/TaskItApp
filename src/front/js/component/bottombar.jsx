import React, { useContext, useEffect } from 'react';
import { Context } from "../store/appContext";
import { Navbar, Nav, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import "../../styles/dropdown.css"

export const BottomNavbar = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getCategories();
    }, [])

    return (
        <Navbar bg="light" variant="light" fixed="bottom" className="fixed-bottom d-flex justify-content-around">
            <Nav>
                <Nav.Item>
                    <DropdownButton
                        title={<div className="d-flex flex-column align-items-center nav-link">
                                <Icon className='fs-2' icon="ant-design:home-filled" />
                                <span className="small">Home</span>
                            </div>}
                        drop="up" 
                        className="nav-link-dropdown"
                    >
                        { (store.user?.role === "both" || store.user?.role === "requester") &&
                            <>
                                <Dropdown.Item as={Link} to={`/users/${store.user.username}/my-tasks`}>My posted tasks</Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/users/${store.user.username}/requested-completed-tasks`}>Requested tasks completed</Dropdown.Item>
                            </>
                        }
                        { (store.user?.role === "both" || store.user?.role === "task_seeker") &&
                            <>
                                <Dropdown.Item as={Link} to={`/users/${store.user.username}/applied-to-tasks`}>Applied to tasks</Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/users/${store.user.username}/completed-tasks`}>Completed Tasks</Dropdown.Item>
                            </>
                        }
                    </DropdownButton>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/tasks" className="nav-link d-flex flex-column align-items-center">
                        <Icon className='fs-2' icon="mingcute:task-2-fill" />
                        <span className="small">Tasks</span>
                    </Nav.Link>
                </Nav.Item>
                { (store.user.role === "both" || store.user.role === "task_seeker") && 
                    <Nav.Item>
                        <DropdownButton
                            title={<div className="d-flex flex-column align-items-center nav-link">
                                    <Icon className='fs-2' icon="bxs:category" />
                                    <span className="small">Categories</span>
                                </div>}
                            drop="up" 
                            className="nav-link-dropdown"
                        >
                            { store.categories.map((category) => {
                                return <Dropdown.Item as={Link} to={`/categories/${category.name.replace(/\s+/g,"-")}`} key={category.id}> {category.name}</Dropdown.Item>
                            })}
                        </DropdownButton>
                    </Nav.Item>
                }
                <Nav.Item>
                    <Nav.Link as={Link} to="/messages" className="nav-link d-flex flex-column align-items-center">
                        <Icon className="fs-2" icon="mdi:message" />
                        <span className="small">Messages</span>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/seekers" className="nav-link d-flex flex-column align-items-center">
                        <Icon className='fs-2' icon="bi:people-fill" />
                        <span className="small">Seekers</span>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};