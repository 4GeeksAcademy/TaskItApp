import React, { useContext, useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Context } from '../store/appContext';

export const SidebarComponent = () => {
    const [collapsed, setCollapsed] = useState(true);
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getCategories();
    }, [])

    return (
        <div style={{ display: 'flex', height: '100vh', minHeight: '100%'}}>
            <Sidebar collapsed={collapsed} rootStyles={{
                background: '#ffffff',
                border: 'none'
            }}>
                <Menu rootStyles={{ background: '#ffffff' }}>
                    <div className='py-5 d-flex justify-content-center'>
                        <button className="btn fs-2 d-flex align-items-center" onClick={() => setCollapsed(!collapsed)}>
                            <Icon icon="charm:menu-hamburger" />
                        </button>
                    </div>
                    <MenuItem icon={<Icon className='fs-2' icon="ant-design:home-filled" /> }> 
                        {!collapsed && <span className='ms-2'>Home</span>}
                    </MenuItem>
                    { (store.user.role == "both" || store.user.role == "requester") && 
                        <SubMenu defaultOpen label="Categories" icon={<Icon className='fs-2' icon="bxs:category" />}>
                            { store.categories.map((category) => {
                                return <MenuItem key={category.id}> {category.name}</MenuItem>
                            })}
                        </SubMenu>
                    }
                    { (store.user.role == "both" || store.user.role == "requester") && 
                        <MenuItem icon={<Icon className='fs-2' icon="bi:people-fill" /> }> 
                            {!collapsed && <span className='ms-2'>Seekers</span>}
                        </MenuItem>
                    }
                </Menu>
            </Sidebar>
        </div>
    );
}
