import React, { useContext, useEffect } from 'react';
import { Context } from "../store/appContext";
import { Navbar, Nav, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import "../../styles/dropdown.css"
import ChatNotification from './notification/phone_chat_notification_badge.js';
import useScreenWidth from '../hooks/useScreenWidth.jsx';
import { useWebSocket } from '../store/webSocketContext.js';

export const BottomNavbar = () => {
    const { store, actions } = useContext(Context);
    const socket = useWebSocket();
    const smallDevice = useScreenWidth();

    useEffect(() => {
        actions.getCategories();
    }, [])

    useEffect(() => {
        if (smallDevice) actions.fetchChatsAndUnseenMessages();
    }, [smallDevice, store.user]);

    useEffect(() => {
        if (!socket || !smallDevice) return;

        socket.on('unseen_message', (data) => {
            actions.setUnseenMessages({ room: data.room, hasUnseenMessages: true }, true);
        });

        socket.on('new_chat', () => {
            actions.getChats();
        });

        socket.on('online_users', (data) => {
            actions.setOnlineUsers(data.users);
        });

        return () => {
            socket.off('unseen_message');
            socket.off('new_chat');
            socket.off('online_users');
        };
    }, [socket, smallDevice]);

    useEffect(() => {
        if (!socket || !store.chats.length) return;

        for (let chat of store.chats) {
            socket.emit('join', { username: store.user.username, room: chat.room_name });
        }
    }, [store.chats]);

    return (
        <Navbar bg="light" variant="light" fixed="bottom" className="fixed-bottom d-flex justify-content-around">
            <Nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', width: '100%' }}>
                <Nav.Item className='d-flex justify-content-center'>
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
                                <Dropdown.Item as={Link} to={`/users/${store.user.username}/active-requests`}>Active Requests</Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/users/${store.user.username}/completed-requests`}>My Completed Requests</Dropdown.Item>
                            </>
                        }
                        { (store.user?.role === "both" || store.user?.role === "task_seeker") &&
                            <>
                                <Dropdown.Item as={Link} to={`/users/${store.user.username}/applications`}>Applications</Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/users/${store.user.username}/completed-tasks`}>My Completed Tasks</Dropdown.Item>
                            </>
                        }
                    </DropdownButton>
                </Nav.Item>
                <Nav.Item className='d-flex justify-content-center'>
                    <Nav.Link as={Link} to="/tasks" className="nav-link d-flex flex-column align-items-center">
                        <Icon className='fs-2' icon="mingcute:task-2-fill" />
                        <span className="small">Tasks</span>
                    </Nav.Link>
                </Nav.Item>
                { (store.user.role === "both" || store.user.role === "task_seeker") && 
                    <Nav.Item className='d-flex justify-content-center'>
                        <DropdownButton
                            title={<div className="d-flex flex-column align-items-center nav-link">
                                    <Icon className='fs-2' icon="bxs:category" />
                                    <span className="small">Categories</span>
                                </div>}
                            drop="up" 
                            className="nav-link-dropdown"
                        >
                            { store.categories.map((category) => {
                                return <Dropdown.Item as={Link} to={`/categories/${category.name.replace(/\s+/g,"-")}`} key={category.id + "cat"} > {category.name}</Dropdown.Item>
                            })}
                        </DropdownButton>
                    </Nav.Item>
                }
                <Nav.Item className='d-flex justify-content-center'>
                    <Nav.Link as={Link} to="/chats" className="nav-link d-flex flex-column align-items-center position-relative">
                        <ChatNotification></ChatNotification>
                        <Icon className="fs-2" icon="mdi:message" />
                        <span className="small">Messages</span>
                    </Nav.Link>
                </Nav.Item>
                { (store.user.role === "both" || store.user.role === "task_seeker") && 
                    <Nav.Item className='d-flex justify-content-center'>
                        <Nav.Link as={Link} to="/seekers" className="nav-link d-flex flex-column align-items-center">
                            <Icon className='fs-2' icon="bi:people-fill" />
                            <span className="small">Seekers</span>
                        </Nav.Link>
                    </Nav.Item>
                }
            </Nav>
        </Navbar>
    );
};