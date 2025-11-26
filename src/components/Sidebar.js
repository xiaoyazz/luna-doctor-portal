import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, Link } from 'react-router-dom';

const drawerWidth = 240;
const BRAND_PURPLE = '#C1C1E4';
const BRAND_TEXT = '#7E7EB5';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        // { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    borderRight: `1px solid ${BRAND_PURPLE}`,
                },
            }}
        >
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: BRAND_PURPLE }}>LC</Avatar>
                <Typography variant="h6" sx={{ color: BRAND_TEXT, fontWeight: 'bold' }}>
                    LunaCare
                </Typography>
            </Box>

            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        component={Link}
                        to={item.path}
                        sx={{
                            backgroundColor: location.pathname === item.path ? '#F4F4FC' : 'transparent',
                            borderRight: location.pathname === item.path ? `4px solid ${BRAND_PURPLE}` : 'none',
                            mb: 1
                        }}
                    >
                        <ListItemIcon sx={{ color: BRAND_TEXT }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} sx={{ color: '#555' }} />
                    </ListItem>
                ))}
            </List>

            <Box sx={{ marginTop: 'auto', p: 2 }}>
                <ListItem button>
                    <ListItemIcon sx={{ color: '#ff7043' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: '#ff7043' }} />
                </ListItem>
            </Box>
        </Drawer>
    );
};

export default Sidebar;