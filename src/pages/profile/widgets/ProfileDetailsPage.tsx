import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState, setUser} from "../../../redux/store.ts";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../../amplify/data/resource.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from '@mui/material/Grid2';
import AssetIcon from "../../../components/AssetIcon.tsx";

const client = generateClient<Schema>();

function ProfileDetailsPage() {
    const user = useSelector((state: RootState) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileEdited, setProfileEdited] = useState<UserProfile>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const {data, errors} = await client.models.UserProfile.list({});
                if (errors) {
                    setError('Помилка завантаження данних профелю.')
                    console.error(errors);
                    return;
                }
                if (data.length > 0) {
                    setProfile(data[0]);
                } else {
                    setError('Помилка завантаження данних профелю.')
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
                setError('Помилка завантаження данних профелю.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile().then();
    }, []);

    const handleEdit = () => {
        setProfileEdited(profile);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (profileEdited === null) return;
        try {
            setIsLoading(true);
            const {errors} = await client.models.UserProfile.update({
                id: profileEdited.id,
                email: profileEdited.email,
                fullName: profileEdited.fullName,
                nickname: profileEdited.nickname,
                avatar: profileEdited.avatar,
                gender: profileEdited.gender,
            });
            if (errors) {
                setError('Помилка збереження данних профелю.');
            }
            setProfile(profileEdited);
            dispatch(setUser({
                ...user,
                email: profileEdited.email,
                fullName: profileEdited.fullName,
                nickname: profileEdited.nickname,
                avatar: profileEdited.avatar,
                gender: profileEdited.gender
            }));
            setIsEditing(false);
        } catch (error) {
            setError('Помилка збереження данних профелю.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileEdited(null);
    };
    return (
        <div>
            {error && (
                <Alert severity="error" sx={{mb: 2}} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {isEditing ? (
                <>
                    <TextField
                        label="@mail"
                        value={profileEdited.email}
                        onChange={(e) =>
                            setProfileEdited((prev: UserProfile) => ({
                                ...prev,
                                email: e.target.value
                            }))
                        }
                        fullWidth
                        margin="normal"
                        disabled={true}
                    />
                    <TextField
                        label="Повне ім'я"
                        value={profileEdited.fullName}
                        onChange={(e) =>
                            setProfileEdited((prev: UserProfile) => ({
                                ...prev,
                                fullName: e.target.value
                            }))
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Нікнейм"
                        value={profileEdited.nickname}
                        onChange={(e) =>
                            setProfileEdited((prev: UserProfile) => ({
                                ...prev,
                                nickname: e.target.value
                            }))
                        }
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Стать</InputLabel>
                        <Select
                            value={profileEdited.gender}
                            onChange={(e) =>
                                setProfileEdited((prev: UserProfile) => ({
                                    ...prev,
                                    gender: e.target.value
                                }))
                            }
                            label="Стать"
                        >
                            <MenuItem value="MALE">Чоловік</MenuItem>
                            <MenuItem value="FEMALE">Жінка</MenuItem>
                            <MenuItem value="OTHER">Інше</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Аватар"
                        value={profileEdited.avatar}
                        onChange={(e) =>
                            setProfileEdited((prev: UserProfile) => ({
                                ...prev,
                                avatar: e.target.value
                            }))
                        }
                        fullWidth
                        margin="normal"
                        disabled={true}
                    />

                    <Box sx={{mt: 2}}>
                        <LoadingButton
                            loading={isLoading}
                            variant="contained"
                            onClick={handleSave}
                            sx={{mr: 2}}>
                            Зберегти
                        </LoadingButton>
                        <Button variant="outlined" onClick={handleCancel}>
                            Скасувати
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Grid container direction={'row'} spacing={2}>
                        <Grid size={{xs: 12, md: 12}}>
                            <Typography variant="body1" style={{display: 'inline-block'}}>
                                @mail: {isLoading
                                ? TextSkeleton()
                                : profile?.email || ''}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 12, md: 12}}>
                            <Typography variant="body1" style={{display: 'inline-block'}}>
                                Повне ім'я: {isLoading
                                ? TextSkeleton()
                                : profile?.fullName || ''}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 12, md: 12}}>
                            <Typography variant="body1" style={{display: 'inline-block'}}>
                                Нікнейм: {isLoading
                                ? TextSkeleton()
                                : profile?.nickname || ''}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 12, md: 12}}>
                            <Typography variant="body1" style={{display: 'inline-block'}}>
                                Стать: {isLoading
                                ? TextSkeleton()
                                : getGender(profile?.gender || '')}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 12, md: 12}}>
                            <Typography variant="body1" style={{display: 'inline-block'}}>
                                Аватар: {isLoading
                                ? TextSkeleton()
                                :  <AssetIcon assetId={profile?.avatar} size={30}/>}
                            </Typography> 
                        </Grid>
                        <Grid size={{xs: 12, md: 12}}>
                            <Button variant="contained" onClick={handleEdit} sx={{mt: 2}}>
                                Редагувати
                            </Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </div>
    );
}
type Gender = 'MALE' | 'FEMALE' | 'OTHER' | '';
const getGender = (gender: Gender): string => {
    switch (gender) {
        case 'MALE':
            return 'Чоловік';
        case 'FEMALE':
            return 'Жінка';
        default:
            return 'Інше';
    }
}
const TextSkeleton = () => {
    return <Skeleton
        variant="text"
        sx={{fontSize: '1rem'}}
        animation="wave"
        style={{display: 'inline-block', verticalAlign: 'middle'}}
        width={200}/>;
}
export default ProfileDetailsPage;