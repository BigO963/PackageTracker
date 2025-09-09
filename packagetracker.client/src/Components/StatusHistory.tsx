import { useEffect, useState } from 'react';

interface StatusHistory {
    id: string,
    prevStatus: string,
    newStatus: string,
    dateModified: string
}

interface StatusHistoryProps {
    packageId: string;
}

function StatusHistory({ packageId }: StatusHistoryProps) {

    const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);

    useEffect(() => {
        populateStatusData(packageId);
    }, [packageId]);

    const history = statusHistory === undefined
        ? <p>Loading status change history...</p>
        :<div>
        <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Previous Status</th>
                    <th>New Status</th>
                    <th>Date Modified</th>
                </tr>
            </thead>
            <tbody>
                    {statusHistory.map(history =>
                        <tr key={history.id}>
                        <td>{history.id}</td>
                        <td className={history.prevStatus}>{history.prevStatus}</td>
                        <td className={history.newStatus}>{history.newStatus}</td>
                        <td>{history.dateModified}</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>

    return (
        <div>
            <h1 id="tableLabel">Status History</h1>
            {history}
        </div>
    )

    async function populateStatusData(packageId: string) {
        const response = await fetch(`/api/packages/statusHistory/${packageId}`);
        if (response.ok) {
            const data = await response.json();
            setStatusHistory(data);
        }
    }
}

export default StatusHistory;