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
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from '@mui/material/Grid2';
import useRequest from "../../../api/useRequest.ts";
import {m_getUserProfileData, m_updateUsersProfileData} from "../../../api/models/UserProfileModels.ts";

function ProfileDetailsPage() {
    const user = useSelector((state: RootState) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileEdited, setProfileEdited] = useState<UserProfile>(null);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();

    const usersData = useRequest({model: m_getUserProfileData, errorCode: '#006:01'});
    const usersDataUpdate = useRequest({model: m_updateUsersProfileData, errorCode: '#006:02'});



    useEffect(() => {
        if(user && user.userId){
            usersData.makeRequest({userId: user.userId}).then()
        }
    }, [user]);

    useEffect(() => {
        if(usersData.result){
            setProfile(usersData.result);
        }
    }, [usersData.result]);
    const handleEdit = () => {
        setProfileEdited(profile);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (profileEdited === null) return;

        const updateProfile = {
            id: profileEdited.id,
            fullName: profileEdited.fullName,
            nickname: profileEdited.nickname,
            avatar: profileEdited.avatar,
            gender: profileEdited.gender,
        }

        usersDataUpdate.makeRequest({user:updateProfile}).then()

    };
    useEffect(() => {
        if(usersDataUpdate.result){
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
        }
    }, [usersDataUpdate.result]);
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
                            value={profileEdited.gender || ''}
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

                    <Box sx={{mt: 2}}>
                        <LoadingButton
                            loading={usersDataUpdate.isLoading}
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
                                Повне ім'я: {usersData.isLoading || usersDataUpdate.isLoading
                                ? TextSkeleton()
                                : profile?.fullName || ''}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 12, md: 12}}>
                            <Typography variant="body1" style={{display: 'inline-block'}}>
                                Нікнейм: {usersData.isLoading || usersDataUpdate.isLoading
                                ? TextSkeleton()
                                : profile?.nickname || ''}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 12, md: 12}}>
                            <Typography variant="body1" style={{display: 'inline-block'}}>
                                Стать: {usersData.isLoading || usersDataUpdate.isLoading
                                ? TextSkeleton()
                                : getGender(profile?.gender || '')}
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