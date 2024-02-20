import { LogoButton } from "../../../components/Button"
import AccountMenu from "../../../components/AccountMenu";
import {
  WorkspaceDropdown,
  RecentDropdown,
  StarredDropdown,
} from "../../../components/dropdown";
import CreateBoardWorkspace from "../../../components/CreateBoardWorkspace";
import { useAllWorkspaceContext } from "../WorkspaceContex/WorkspaceContex";
import SearchModal from "../../../components/SearchModal";

export default function Nav() {
  const {allWorkspace}=useAllWorkspaceContext()
  return (
    
    <div>
      <div className="flex flex-row items-center justify-between p-2 gap-8 w-full border-b h-[70px]">
        <div className="flex flex-row gap-2">
          <LogoButton></LogoButton>
          <div className=" flex-row gap-2 hidden md:block">
            <WorkspaceDropdown workspaces={allWorkspace?.data??[]} />
            <RecentDropdown workspace={allWorkspace??undefined} />
            <StarredDropdown workspace={allWorkspace??undefined} />
            <CreateBoardWorkspace />
          </div>
          <div className="md:hidden block"></div>
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <SearchModal/>
          <AccountMenu></AccountMenu>
        </div>
      </div>
    </div>
  );
}
