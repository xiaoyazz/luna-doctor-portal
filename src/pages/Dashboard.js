// import React from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Box, Typography, Chip, Button, Paper } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { Link } from 'react-router-dom';

// // THEME COLORS
// const BRAND_PURPLE = '#C1C1E4';
// const BRAND_TEXT = '#7E7EB5';

// // DUMMY DATA
// const rows = [
//     { id: '1', name: 'Alice Johnson', status: 'Postpartum +12 Days', riskScore: 0.85, lastLog: '2 hours ago' },
//     { id: '2', name: 'Bethany Smith', status: 'Postpartum +45 Days', riskScore: 0.20, lastLog: '1 day ago' },
//     { id: '3', name: 'Catherine Wu', status: 'Pregnant (38 weeks)', riskScore: 0.45, lastLog: '5 mins ago' },
//     { id: '4', name: 'Diana Prince', status: 'Postpartum +3 Days', riskScore: 0.92, lastLog: '10 mins ago' },
// ];

// const getRiskChip = (score) => {
//     if (score > 0.7) return <Chip label="HIGH RISK" color="error" size="small" sx={{ fontWeight: 'bold' }} />;
//     if (score > 0.4) return <Chip label="MEDIUM" color="warning" size="small" />;
//     return <Chip label="STABLE" color="success" size="small" />;
// };

// const Dashboard = () => {
//     const columns = [
//         { field: 'name', headerName: 'Patient Name', width: 200 },
//         { field: 'status', headerName: 'Status', width: 180 },
//         {
//             field: 'riskScore',
//             headerName: 'AI Risk Assessment',
//             width: 200,
//             renderCell: (params) => getRiskChip(params.value)
//         },
//         { field: 'lastLog', headerName: 'Last Active', width: 150 },
//         {
//             field: 'action',
//             headerName: 'Action',
//             width: 150,
//             renderCell: (params) => (
//                 <Link to={`/patient/${params.row.id}`}>
//                     <Button variant="outlined" startIcon={<VisibilityIcon />} size="small" sx={{ color: BRAND_TEXT, borderColor: BRAND_PURPLE }}>
//                         View
//                     </Button>
//                 </Link>
//             ),
//         },
//     ];

//     return (
//         <Box sx={{ height: '100%', width: '100%' }}>
//             <Typography variant="h4" gutterBottom sx={{ color: BRAND_TEXT, fontWeight: 'bold', mb: 3 }}>
//                 Doctor Dashboard
//             </Typography>

//             <Paper elevation={0} sx={{ height: 500, width: '100%', borderRadius: 3, p: 2, border: `1px solid ${BRAND_PURPLE}` }}>
//                 <DataGrid
//                     rows={rows}
//                     columns={columns}
//                     pageSize={5}
//                     disableSelectionOnClick
//                     sx={{
//                         border: 0,
//                         '& .MuiDataGrid-columnHeaders': {
//                             backgroundColor: '#F4F4FC',
//                             color: BRAND_TEXT,
//                             fontWeight: 'bold',
//                         },
//                     }}
//                 />
//             </Paper>
//         </Box>
//     );
// };

// export default Dashboard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Chip, CircularProgress } from "@mui/material";
import { fetchUsers } from "../api";

const getRiskChipStyles = (riskLabel) => {
    const label = (riskLabel || "").toUpperCase();

    switch (label) {
        case "HIGH RISK":
            return { bg: "#FDECEA", color: "#C62828" }; // red
        case "MEDIUM":
            return { bg: "#FFF4E5", color: "#EF6C00" }; // orange
        case "STABLE":
            return { bg: "#E8F5E9", color: "#2E7D32" }; // green
        case "UNKNOWN":
        default:
            return { bg: "#ECEFF1", color: "#546E7A" }; // grey
    }
};

function Dashboard() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const users = await fetchUsers();
                setPatients(users);
            } catch (err) {
                console.error(err);
                setError("Failed to load patients");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    mt: 4,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                Patients
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {patients.map((p) => {
                    const { bg, color } = getRiskChipStyles(p.riskLabel);

                    return (
                        <Paper
                            key={p.id}
                            elevation={0}
                            onClick={() => navigate(`/patient/${p.id}`)}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid #E0E0F4",
                                cursor: "pointer",
                                transition: "box-shadow 0.2s, transform 0.1s, background-color 0.2s",
                                "&:hover": {
                                    boxShadow: 3,
                                    backgroundColor: "#F7F7FF",
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {p.displayName}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#757575", mt: 0.5 }}
                                >
                                    Risk score: {p.riskPercent ?? 0}%
                                </Typography>
                            </Box>

                            <Chip
                                label={p.riskLabel || "UNKNOWN"}
                                sx={{
                                    backgroundColor: bg,
                                    color,
                                    fontWeight: 600,
                                }}
                            />
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
}

export default Dashboard;
