import { IconButton } from "@mui/material";
import { ChevronLeftRounded } from "@mui/icons-material";

export default function SideBarHeader() {
    return <div className="flex items-center p-2 border-b-[1px] border-solid h-[15%]">
        <img className="w-8 h-8 rounded-md mr-4" src="" alt="" />
        <div className="text-sm max-w-[143px] mr-8">
            <p className="text-[17px] font-bold leading-none">Scrum team one workspace</p>
            <p className="text-gray">free</p>
        </div>
        <IconButton sx={{borderRadius: "11px"}}>
            <ChevronLeftRounded></ChevronLeftRounded>
        </IconButton>
    </div>;
}