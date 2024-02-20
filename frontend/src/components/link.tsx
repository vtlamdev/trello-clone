import {Link} from "react-router-dom"
export default function LinkRouter({RouterName, LinkName}:{RouterName:string,LinkName:string})
{
    return <Link to={RouterName} className="text-[#0052CC] md:text-sm text-xs">{LinkName}</Link>
}