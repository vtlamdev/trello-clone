import Divider from "@mui/material/Divider";
import WorkspaceTitle from "../../../../../../components/HomePage/WorkspaceTitle";
import WorkspaceBoardModal from "../../../../../../components/WorkspacePage/WorkspaceBoardModal";
import InputForm from "../../../../../../components/input";
import { YourBoard } from "../../../../../../components/HomePage/Board";
import { useAllWorkspaceContext } from "../../../../WorkspaceContex/WorkspaceContex";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BoardModel } from "../../../../WorkspaceContex/WorkspaceModel";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
export default function WorkspaceBoards() {
  const { allWorkspace, fetchData } = useAllWorkspaceContext();
  const [board, setBoard] = useState<BoardModel[] | undefined>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortByValue, setSortByValue] = useState<string>("");
  const { workspaceId } = useParams();
  useEffect(() => {
    if(allWorkspace)
    {
      setBoard(
        allWorkspace.data.find(
          (workspace) => workspace.workspace_id === workspaceId
        )?.boards.map(board=>({...board,workspaceId:workspaceId as string}))
      );
    }
   
  }, [allWorkspace, workspaceId]);
  const handleChange = (event: SelectChangeEvent) => {
    setSortByValue(event.target.value as string);
  };

  const reFetchData = ()=>{
    fetchData()
  }

  useEffect(() => {
    const workspaceData = allWorkspace?.data.find(
      (workspace) => workspace.workspace_id === workspaceId
    );
  
    if (sortByValue === 'alphabetically-a-z') {
      // Sort boards A-Z
      const sortedBoards = [...(workspaceData?.boards || [])]
      .map(board => ({
        ...board,
        workspaceId: workspaceId as string
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
    
      setBoard(sortedBoards);
    } else if (sortByValue === 'alphabetically-z-a') {
      const sortedBoards = [...(workspaceData?.boards || [])]
      .map(board => ({
        ...board,
        workspaceId: workspaceId as string
      }))
      .sort((a, b) => b.title.localeCompare(a.title));
    
      setBoard(sortedBoards);
    }
  }, [sortByValue, allWorkspace, workspaceId]);
  useEffect(()=>{
    setBoard(
      allWorkspace?.data.find(
        (workspace) => workspace.workspace_id === workspaceId
      )?.boards.map(board=>({...board,workspaceId:workspaceId as string})).filter(board=>board.title.toUpperCase().includes(searchValue.toUpperCase()))
    );
  },[searchValue])
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-row justify-between items-center md:mx-32">
        <WorkspaceTitle
          workspace={allWorkspace?.data.find(
            (workspace) => workspace.workspace_id === workspaceId
          )}
        />
        <WorkspaceBoardModal reFetchData={reFetchData}/>
      </div>

      <div className="md:mx-10 mx-1">
        <Divider />
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-xl font-bold">Boards</h3>
          </div>
          <div className="flex flex-row justify-between items-center ">
            <div>
              <FormControl sx={{width:'300px'}}>
                <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sortByValue}
                  label="Sort by"
                  onChange={handleChange}
                >
                  <MenuItem value={'alphabetically-a-z'}>Alphabetically A-Z</MenuItem>
                  <MenuItem value={'alphabetically-z-a'}>Alphabetically Z-A</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <p>Search</p>
              <InputForm
                placeholder="Search board"
                type="text"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            {/* <YourBoard board={ allWorkspace?.data.find(
          (workspace) => workspace.workspace_id === workspaceId
        )?.boards.map(board=>({...board,workspaceId:workspaceId as string}))||[]} /> */}
          <YourBoard board={board ||[]} />
          </div>
        </div>
      </div>
    </div>
  );
}
