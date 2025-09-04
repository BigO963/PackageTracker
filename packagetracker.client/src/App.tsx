import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom'
import './App.css';

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
    }
    status: string
    createdAt: string
}

function App() {

    const [packages, setPackages] = useState<Package[]>();

    const [trackingFilter, setTrackingFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    
    const filteredPackages = packages?.filter(p =>
        p.trackingNumber.toLowerCase().includes(trackingFilter.toLowerCase()) &&
        (statusFilter === '' || p.status === statusFilter)
    );

    const statusTransition: Record<string, string[]> = {
        Created: ["Sent", "Canceled"],
        Sent: ["Accepted", "Returned", "Canceled"],
        Returned: ["Sent", "Canceled"],
        Accepted: [],
        Canceled: []
    };

        useEffect(() => {
                populatePackageData();
        }, []);
   
        const contents = filteredPackages === undefined
            ? <p><em>Loading... Please refresh once the ASP.NET backend has started.</em></p>
                :<div>
                    <div style={{ marginBottom: '10px' }}>
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
                    <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Tracking Number</th>
                            <th>Sender</th>
                            <th>Recipient</th>
                            <th>Created</th>
                            <th>Change Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPackages.map(pckg =>
                            <tr key={pckg.packageId}>
                                <td className={pckg.status}>{pckg.status}</td>
                                <td>{pckg.trackingNumber}</td>
                                <td>{pckg.sender.senderName}</td>   
                                <td>{pckg.recipient.recipientName}</td>
                                <td>{new Date(pckg.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {statusTransition[pckg.status]?.map(nextStatus => (
                                        <button
                                            key={nextStatus}
                                            onClick={() => changeStatus(pckg.packageId, nextStatus)}
                                        >
                                            {nextStatus }
                                        </button>
                                    ))}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div> 

        return (
                <div>
                    <h1 id="tableLabel">Package Information</h1>
                    {contents}
                </div>
                );

    async function populatePackageData() {
        const response = await fetch('packages');
        if (response.ok) {
            const data = await response.json();
            setPackages(data);
        }
    }

    async function changeStatus(packageId: string, newStatus: string) {
        console.log("Sending status update...", { packageId, newStatus });
        const response = await fetch(`packages/${packageId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newStatus })
        });

        console.log(response)

        if (response.ok) {
            setPackages(prev =>
                prev?.map(p =>
                    p.packageId === packageId ? { ...p, status: newStatus } : p
                )
            );
        } else {
            alert("Failed to updated status");
            const errorText = response.text();
            console.error(`❌ Failed with ${response.status} ${response.statusText}:`, errorText);
        }
    }
}

export default App;