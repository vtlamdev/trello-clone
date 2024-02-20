import ListMenuHomeSideBar from "../../../../../components/HomePage/ListMenuHomeSideBar";
import IconTabHomePage from "../../../../../components/HomePage/IconTabHomePage";
import Divider from "@mui/material/Divider";
import { useAllWorkspaceContext } from "../../../WorkspaceContex/WorkspaceContex";
export default function SidrBar() {
  const {allWorkspace}=useAllWorkspaceContext()
  return (
    <div className="min-w-[250px] flex flex-col  overflow-y-auto ">
      <IconTabHomePage />
      <Divider />
      <p className="pl-4 text-[14px] font-bold">Workspace</p>
      {
        allWorkspace?.data.map((value)=>(
          <ListMenuHomeSideBar data={value} key={value.workspace_id}></ListMenuHomeSideBar>
        ))
      }
    </div>
  );
}
