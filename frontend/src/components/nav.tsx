// import Menu from "./menu"
export default function Nav({children}:{children:React.ReactNode})
{
    return (
    <div className="flex flex-col h-screen md:overflow-hidden relative w-full">
        <div className="fixed w-full top-0 bg-white z-10">
            {/* <Menu></Menu> */}
        </div>
        <div className="flex flex-col justify-center items-center h-screen">
        {children} 
        </div>
            
    </div>)
}