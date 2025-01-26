import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Skeleton,
} from '@mui/material';
import {generateClient} from "aws-amplify/data";
import {useEffect, useState} from "react";
import type {Schema} from "../../../../amplify/data/resource.ts";
import {ServerSelector} from "../../../components/ServerSelector.tsx";

const client = generateClient<Schema>();

interface TransactionLog {
    id: string;
    amount: number;
    timestamp: string;
    characterId: string;
    characterName: string;
    serverId: string;
    serverName: string;
    from: string;
    reason: string | null;
    createdAt: string;
}

function AdminLogPage() {
    const [selectedServerId, setSelectedServerId] = useState<string>('');
    const [logs, setLogs] = useState<TransactionLog[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (selectedServerId) fetchLogs().then();
    }, [selectedServerId]);

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const {data, errors} = await client.models.Server.get({
                    id: selectedServerId
                },
                {selectionSet: ['name', 'characters.*', 'characters.transactions.*']});
            console.log(data)
            if (errors) {
                console.error(errors);
                setError('Failed to load logs. Please refresh the page.');
            }
            if (!data) {
                setError('No data found.');
                return;
            }
            const allTransactions = data.characters.flatMap(character =>
                character.transactions.map(transaction => ({
                    ...transaction,
                    characterName: character.nickname,
                }))
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setLogs(allTransactions);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setError('Failed to load logs. Please refresh the page.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Typography variant="h4" sx={{marginBottom: 2}}>
                Transaction Logs
            </Typography>
            {error && (
                <Typography color="error" sx={{mb: 2}}>
                    {error}
                </Typography>
            )}
            <ServerSelector
                value={selectedServerId}
                onChange={(serverId) => setSelectedServerId(serverId)}
            />
            {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={118}/>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Character Name</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Timestamp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.characterName || 'N/A'}</TableCell>
                                    <TableCell>{log.from || 'N/A'}</TableCell>
                                    <TableCell>{log.amount}</TableCell>
                                    <TableCell>{log.reason}</TableCell>
                                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}

export default AdminLogPage;