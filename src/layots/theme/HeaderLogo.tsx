import { useNavigate  } from 'react-router-dom';
import Button from "@mui/material/Button/Button";

const HeaderLogo = () => {
    const navigate = useNavigate();
    return (
        <main>
            <Button onClick={() => navigate('/')}>
                <img src="/android-chrome-512x512.png"
                     alt="logo"
                     style={{
                         maxWidth: '45px',
                         maxHeight: '45px',
                         verticalAlign: 'middle'
                }} />
            </Button>
        </main>
    );
};

export default HeaderLogo;