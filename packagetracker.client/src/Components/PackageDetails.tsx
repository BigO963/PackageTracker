import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusHistory from './StatusHistory';

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

function PackageDetails() {
    const { id } = useParams<{ id: string }>();
    const [pkg, setPkg] = useState<Package | null>(null);

    useEffect(() => {
        async function fetchPackage() {
            const response = await fetch(`/api/packages/${id}`);
            if (response.ok) {
                const data = await response.json();
                setPkg(data);
            }
        }
        fetchPackage();
    }, [id]);

    if (!pkg) return <p>Loading package details...</p>;

    return (
        <div className="packageDetails">
            <Link to="/">← Back to list</Link>
            <h2>Package Details</h2>
            <p><strong>Tracking Number:</strong> {pkg.trackingNumber}</p>
            <p><strong>Status:</strong> {pkg.status}</p>
            <p><strong>Created At:</strong> {new Date(pkg.createdAt).toLocaleDateString()}</p>

            <h3>Sender</h3>
            <p>{pkg.sender.senderName}, {pkg.sender.senderAddress}, {pkg.sender.senderPhone}</p>

            <h3>Recipient</h3>
            <p>{pkg.recipient.recipientName}, {pkg.recipient.recipientAddress}, {pkg.recipient.recipientPhone}</p>

            <StatusHistory packageId={pkg.packageId} />

        </div>
    );
}

export default PackageDetails;