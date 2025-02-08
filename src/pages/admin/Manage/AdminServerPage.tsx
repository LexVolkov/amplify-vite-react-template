import UniversalCard from '../../../widgets/UniversalCard.tsx';
import {Button, TextField, Typography} from '@mui/material';
import type { Schema } from "../../../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";

const client = generateClient<Schema>();

type Nullable<T> = T | null;

interface ServerData {
    id: string;
    name: string;
    startDate?: Nullable<string>;
    endDate?: Nullable<string>;
    createdAt: string;
    updatedAt: string;
}

interface CreateServerData {
    name: string;
    startDate?: Nullable<string>;
    endDate?: Nullable<string>;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const defaultServerData: CreateServerData = {
    name: '',
    startDate: null,
    endDate: null
};



function AdminServerPage() {
    const [servers, setServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);


    useEffect(() => {
        const subscription = client.models.Server.observeQuery().subscribe({
            next: (data) => {
                setServers([...data.items]);
                setIsLoading(false);
            },
            error: (error) => {
                console.error('Error fetching servers:', error);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    const createServer = async (serverData: CreateServerData) => {
        setIsLoading(true);
        try {
            const { data, errors } = await client.models.Server.create({
                name: serverData.name,
                startDate: serverData.startDate || null,
                endDate: serverData.endDate || null,
            });
            console.log(data);
            if (errors) {
                console.log(errors);
            }
        } finally {
            setIsLoading(false);
            setShowCreateDialog(false)
        }
    };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    const updateServer = async (serverData: ServerData) => {
        setIsLoading(true);
        try {
            const { data, errors } = await client.models.Server.update({
                id: serverData.id,
                name: serverData.name,
                startDate: serverData.startDate || null,
                endDate: serverData.endDate || null,
            });
            console.log(data);
            if (errors) {
                console.log(errors);
            }
        } finally {
            setIsLoading(false);
        }
    };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    const deleteServer = async (serverData: ServerData) => {
        setIsLoading(true);
        try {
            await client.models.Server.delete({ id: serverData.id });
        } finally {
            setIsLoading(false);
        }
    };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    const renderServerPreview = (server: ServerData) => (
        <>
            <Typography variant="body2">
                Start Date: {server.startDate ? new Date(server.startDate).toLocaleDateString() : 'Not set'}
            </Typography>
            <Typography variant="body2">
                End Date: {server.endDate ? new Date(server.endDate).toLocaleDateString() : 'Not set'}
            </Typography>
        </>
    );
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    const renderServerForm = (
        serverData: ServerData | CreateServerData,
        onChange: (data: ServerData | CreateServerData) => void
    ) => (
        <>
            <TextField
                autoFocus
                margin="dense"
                label="Server Name"
                type="text"
                fullWidth
                variant="standard"
                value={serverData.name}
                onChange={(e) => onChange({ ...serverData, name: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Start Date"
                type="date"
                fullWidth
                variant="standard"
                value={serverData.startDate || ''}
                onChange={(e) => onChange({ ...serverData, startDate: e.target.value || null })}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
            />
            <TextField
                margin="dense"
                label="End Date"
                type="date"
                fullWidth
                variant="standard"
                value={serverData.endDate || ''}
                onChange={(e) => onChange({ ...serverData, endDate: e.target.value || null })}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
            />
        </>
    );

    return (
        <div>
            <Button sx={{margin: '10px 0'}}
                variant="contained"
                onClick={() => setShowCreateDialog(true)}
            >
                + додати
            </Button>

            {showCreateDialog && (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                <UniversalCard<CreateServerData>
                    title="Server"
                    defaultData={defaultServerData}
                    isLoading={isLoading}
                    onCreate={createServer}
                    renderEditForm={renderServerForm}
                    mode="create"
                />
            )}
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {isLoading?
                    <Skeleton variant="rounded" width={210} height={60} sx={{ margin: '10px', width: '200px', cursor: 'pointer' }}/>
                    :// eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    servers.map((server) => (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    <UniversalCard<ServerData>
                        key={server.id}
                        title={server.name}
                        data={server}
                        defaultData={server}
                        isLoading={isLoading}
                        onDelete={deleteServer}
                        onUpdate={updateServer}
                        renderPreview={renderServerPreview}
                        renderEditForm={renderServerForm}
                    />
                ))}
            </div>
        </div>
    );
}

export default AdminServerPage;