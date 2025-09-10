import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PackageDetails from './Components/PackageDetails';
import AddPackage from './Components/AddPackage';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Package {
    packageId: string,
    trackingNumber: string,
    sender: {
        senderAddress: string,
        senderName: string,
        senderPhone: string
    },
    recipient: {
        recipientAddress: string,
        recipientName: string,
        recipientPhone: string
    },
    status: string,
    createdAt: string
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


function PackageList() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [trackingFilter, setTrackingFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [addOpen, setAddOpen] = useState(false);

    const statusTransition: Record<string, string[]> = {
        Created: ["Sent", "Canceled"],
        Sent: ["Accepted", "Returned", "Canceled"],
        Returned: ["Sent", "Canceled"],
        Accepted: [],
        Canceled: []
    };

    const filteredPackages = packages?.filter(p =>
        p.trackingNumber.toLowerCase().includes(trackingFilter.toLowerCase()) &&
        (statusFilter === '' || p.status === statusFilter)
    );

    useEffect(() => {
        populatePackageData();
    }, []);

    async function populatePackageData() {
        const response = await fetch('/api/packages');
        if (response.ok) {
            const data = await response.json();
            console.log("Data: ", data);
            setPackages(data);
        }
    }

    async function addStatusHistory(packageId: string, prevStatus: string, newStatus: string) {

        const response = await fetch(`/api/packages/addStatusHistory/${packageId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "prevStatus": prevStatus,
                "newStatus": newStatus,
                "dateModified": new Date().toLocaleDateString()
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log(errorText);
            alert("Failed to add to status history")
        }
    }

    async function changeStatus(packageId: string, newStatus: string) {

        const currentPackage = packages.find(p => p.packageId === packageId);
        const prevStatus = currentPackage?.status.toString();


        const response = await fetch(`/api/packages/${packageId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newStatus })
        });

        if (response.ok) {
            setPackages(prev =>
                prev?.map(p =>
                    p.packageId === packageId ? { ...p, status: newStatus } : p
                )
            );
            alert("Succesfully changed package status");
            if (prevStatus) {
                await addStatusHistory(packageId, prevStatus, newStatus);
            }
        } else {
            const errorText = await response.text();
            console.error(`Failed with ${response.status} ${response.statusText}:`, errorText);
            alert(`Failed to update status: ${errorText}`);
        }
    }

    if (!filteredPackages) {
        return <p><em>Loading... Please refresh once the ASP.NET backend has started.</em></p>;
    }

    return (
        <div>
           

            <h1 id="tableLabel">Package Information</h1>

            <div className="package-wrapper">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <AddPackage
                        open={addOpen}
                        onClose={() => setAddOpen(false)}
                        onPackageAdded={populatePackageData}
                    />
                </div>
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Filter by tracking number"
                        value={trackingFilter}
                        onChange={e => setTrackingFilter(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />

                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="Created">Created</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Returned">Returned</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                </div>
            </div>
            <TableContainer component={Paper }>
                <Table className="table table-striped" aria-labelledby="tableLabel">
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Tracking Number</TableCell>
                            <TableCell>Sender</TableCell>
                            <TableCell>Recipient</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Change Status</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPackages.map(pckg =>
                            <TableRow key={pckg.packageId}>
                                <TableCell className={pckg.status}>{pckg.status}</TableCell>
                                <TableCell>{pckg.trackingNumber}</TableCell>
                                <TableCell>{pckg.sender.senderName}</TableCell>
                                <TableCell>{pckg.recipient.recipientName}</TableCell>
                                <TableCell>{new Date(pckg.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {statusTransition[pckg.status]?.map(nextStatus => (
                                        <button
                                            key={nextStatus}
                                            onClick={() => changeStatus(pckg.packageId, nextStatus)}
                                        >
                                            {nextStatus}
                                        </button>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <nav><Link to={`/packages/${pckg.packageId}`}>Details</Link></nav>

                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
           
        </div>
    );
}




function App() {
    return (
        <ThemeProvider theme={darkTheme }>
            <Routes>
                <Route path="/" element={<PackageList />} />
                <Route path="/packages/:id" element={<PackageDetails />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;