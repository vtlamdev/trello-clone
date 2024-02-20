
import SideBarHeader from "./components/SideBarHeader";
import SideBarDetail from "./components/SideBarDetail";

export default function SideBar() {
    return <div className="w-[23%] flex flex-col border-r-[1px] border-solid h-full">
        <SideBarHeader />
        <SideBarDetail />
    </div>;
}