// import { LogoButton } from "./Button";
// import InputForm from "../components/input";
// import AccountMenu from "./AccountMenu";
// import {
//   WorkspaceDropdown,
//   RecentDropdown,
//   StarredDropdown,
//   NotiDropdown
// } from "./dropdown";


// export default function Menu({ children }: { children: React.ReactNode }) {
//   const dataTestWorkspaces = [
//     {
//       _id: "1",
//       name: "Workspace 1",
//       description: "My first workspace",
//       createAt: new Date("August 19, 1975 23:15:30"),
//     },
//     {
//       _id: "2",
//       name: "Workspace 2",
//       description: "My first workspace",
//       createAt: new Date("August 21, 1975 23:15:30"),
//     },
//     {
//       _id: "3",
//       name: "Workspace 3",
//       description: "My first workspace",
//       createAt: new Date("August 20, 1975 23:15:30"),
//     },
//     {
//       _id: "4",
//       name: "Workspace 4",
//       description: "My first workspace",
//       createAt: new Date("August 18, 1975 23:15:30"),
//     },
//   ];
//   const Databoard = [
//     {
//       _id: "1",
//       title: "Board 1",
//       description: "Board 1 here",
//       star: true,
//       createAt: new Date("August 11, 1975 23:15:30"),
//     },
//     {
//       _id: "2",
//       title: "Board 2",
//       description: "Board 2 here",
//       star: true,
//       createAt: new Date("August 29, 1975 23:15:30"),
//     },
//     {
//       _id: "3",
//       title: "Board 3",
//       description: "Board 3 here",
//       star: true,
//       createAt: new Date("August 1, 1975 23:15:30"),
//     },
//     {
//       _id: "4",
//       title: "Board 4",
//       description: "Board 4 here",
//       star: false,
//       createAt: new Date("August 20, 1975 23:15:30"),
//     },
//     {
//       _id: "5",
//       title: "Board 5",
//       description: "Board 5 here",
//       star: false,
//       createAt: new Date("August 18, 1975 23:15:30"),
//     },
//   ];
//   return (
//     <div>
//       <div className="flex flex-row items-center justify-between p-2 gap-8 w-full border-b">
//         <div className="flex flex-row gap-2">
//           <LogoButton></LogoButton>
//           <div className=" flex-row gap-2 hidden md:block">
//             <WorkspaceDropdown workspaces={dataTestWorkspaces } />
//             <RecentDropdown board={Databoard} />
//             <StarredDropdown board={Databoard} />

//           </div>
//           <div className="md:hidden block"></div>
//         </div>
//         <div className="flex flex-row justify-center items-center gap-4">
//           <InputForm
//             type="text"
//             placeholder="search "
//             onChange={() => {}}
//           ></InputForm>
//           <NotiDropdown />
//           <AccountMenu></AccountMenu>
//         </div>
//       </div>
//       <div className="overflow-y-auto">     
//          {children}
//       </div>

//     </div>
//   );
// }
