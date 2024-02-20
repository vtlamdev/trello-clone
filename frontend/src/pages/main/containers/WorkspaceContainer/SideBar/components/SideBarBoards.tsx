import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";

import ListItemText from "@mui/material/ListItemText";
import { MoreHorizRounded, StarOutlineRounded, Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Board } from "../../../../../../models/boardModel";
import { useNavigate } from "react-router-dom";

export interface BoardItem {
    board: Board,
    isHover: boolean
}

const mockBoardItems: Array<BoardItem> = [
    {
        board: {
            board_id: "1",
            title: "place"
        },
        isHover: false
    },
    {
        board: {
            board_id: "2",
            title: "place"
        },
        isHover: false
    },
    {
        board: {
            board_id: "3",
            title: "place"
        },
        isHover: false
    }
];

export default function SideBarBoards() {
    const [boardItems, setBoardItems] = useState<Array<BoardItem>>([]);
    const [headerMoreIcon, setHeaderMoreIcon] = useState<boolean>(false)
    const navigate = useNavigate();
    
    const onBoardItemHovered = (index: number) => {
        const boardItem: BoardItem = boardItems[index];
        boardItem.isHover = true;
        const newBoardItems = [...boardItems];
        newBoardItems[index] = boardItem;
        setBoardItems(newBoardItems);
    };

    const onBoardItemUnhovered = (index: number) => {
        const boardItem: BoardItem = boardItems[index];
        boardItem.isHover = false;
        const newBoardItems = [...boardItems];
        newBoardItems[index] = boardItem;
        setBoardItems(newBoardItems);
    };

    const onBoardItemClicked = (boardId: string) => {
        navigate("/page/workspace/board/" + boardId);
    };
    
    useEffect(() => {
        setBoardItems(mockBoardItems);
    }, [boardItems.length]);
    
    return <div className="flex flex-col h-full">
        <div className="flex justify-between px-2 h-[10%] items-center" onMouseOver={() => {setHeaderMoreIcon(true);}} onMouseOut={() => {setHeaderMoreIcon(false);}}>
            <div className="font-bold">Your boards</div>
            <div>
                {headerMoreIcon && <IconButton size="small" sx={{padding: "6px", borderRadius: "6px"}}><MoreHorizRounded sx={{fontSize: "17px"}} /></IconButton>}
                {headerMoreIcon && <IconButton size="small" sx={{padding: "6px", borderRadius: "6px"}}><Add sx={{fontSize: "17px"}} /></IconButton>}
            </div>
        </div>
        <List sx={{height: "90%", overflowY: "auto"}}>
            {boardItems.map((boardItem: BoardItem, index: number) => {
                return <ListItemButton sx={{py: "0px"}} onMouseOver={() => {onBoardItemHovered(index);}} onMouseOut={() => {onBoardItemUnhovered(index);}} key={index} onClick={() => {onBoardItemClicked(boardItem.board.board_id);}}>
                    <ListItemText primary={boardItem.board.title} />
                    {boardItem.isHover && <IconButton size="small" sx={{padding: "6px", borderRadius: "6px"}}><MoreHorizRounded sx={{fontSize: "17px"}} /></IconButton>}
                    {boardItem.isHover && <IconButton size="small" sx={{padding: "6px", borderRadius: "6px"}}><StarOutlineRounded sx={{fontSize: "17px"}} /></IconButton>}
                </ListItemButton>;
            })}
        </List>
    </div>;
}