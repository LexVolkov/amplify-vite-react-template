import {FC} from "react";
import {ButtonGroup} from "@mui/material";
import Box from "@mui/material/Box";
import {ReactElement} from "react";
import Button from "@mui/material/Button/Button";

type TabElement = {
    index: number;
    label: string | null;
    icon: ReactElement | null;
}

interface TabSelectorProps {
    index: number | 0;
    tabs?: TabElement[];
    onChange?: (index: number) => void;
}

export const TabSelector: FC<TabSelectorProps> = ({index, tabs, onChange}) => {
    return (
        <Box sx={{display: "flex", flexDirection: "row", gap: 1}}>
            <ButtonGroup variant="outlined" aria-label="" sx={{ flexWrap: "wrap" }}>
                {tabs?.map((tab) => (
                    <Button key={tab.index}
                            startIcon={tab.icon?tab.icon:null}
                            onClick={() => onChange && onChange(tab.index)}
                            color={tab.index === index ? "inherit" : "primary"}>
                        {tab.label?tab.label:null}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
};