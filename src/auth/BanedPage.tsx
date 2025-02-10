import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import HealingIcon from '@mui/icons-material/Healing';
import {useNavigate} from "react-router-dom";

const BanedPage: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                textAlign: "center",
                bgcolor: "#121212",
                color: "#ffffff",
                px: 3,
            }}
        >
            <Box
                component={motion.div}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                sx={{
                    background: "linear-gradient(135deg, #ff6a00, #ee0979)",
                    borderRadius: "50%",
                    width: 100,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(255, 105, 135, 0.3)",
                }}
            >
                <HealingIcon sx={{ fontSize: 50, color: "#fff" }} />
            </Box>

            <Typography
                variant="h3"
                component={motion.h1}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                sx={{ mt: 3, fontWeight: "bold" }}
            >
                Вас забанили!
            </Typography>

            <Typography
                variant="body1"
                component={motion.p}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                sx={{ mt: 2, color: "#bdbdbd" }}
            >
                На жаль, вас забанили на цьому сайті. Якщо це помилка, зверніться до адміністратора.
            </Typography>

            <Button
                component={motion.a}
                href="#"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                    mt: 4,
                    bgcolor: "#ff6a00",
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    '&:hover': {
                        bgcolor: "#ee0979",
                    },
                }}
            >
                На головну
            </Button>
        </Box>
    );
};

export default BanedPage;
