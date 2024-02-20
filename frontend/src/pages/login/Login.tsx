import InputForm from "../../components/input"
import {ButtonUsage} from "../../components/Button"
import {useState} from "react"
import LinkRouter from "../../components/link"
import TrelloImageLogo from "../../components/TrelloImageLogo"
import APIClient from "../../base/networking/APIClient"
import {ResponseData} from "../../models/responseModel"
import { RequestData } from "../../models/requestModel"
import {z} from "zod"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { User } from "../../models/dataModel"
import { ButtonLoading } from "../../components/Button"
export default function Login()
{
    const [email,setEmail]=useState<string>('')
    const [password,setPassword]=useState<string>('')
    const [formError,setFormError]=useState<string>('')
    const [loading,setLoading]=useState<boolean>(false)
    const apiClient:APIClient =new APIClient()
    const { state } = useLocation();
    const navigate=useNavigate();

    
    const loginForm=z.object(
        {
            email:z.string().email(),
            password:z.string().min(6)
        }
    )
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>)
    {

        try {
            e.preventDefault();
            setLoading(true)
            const submit=await loginForm.safeParseAsync({email,password})
            if(submit.success)
            {
                const responseData:ResponseData=await apiClient.postData(`/authentication/login`,{} as RequestData,{email,password})
                if(responseData.success)
                {
                    const user:User=responseData.data as User
                    localStorage.setItem("AccessToken",user.token)
                    if(state===null)
                    {
                        
                        navigate("/page/home")
                    }
                    else
                    {
                        navigate(-1)
                    }
                }
                else
                {
                    if(responseData.status_code===404) 
                    {
                        setFormError("404")
                    }
                    else if(responseData.status_code===400)
                    {
                        setFormError("400")
                    }
                }
            }
          } catch (err: any) {         
            setFormError("500")
          }
          finally{
            setLoading(false)
          }
    }
    return (
        <div className="h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center h-screen gap-2 md:gap-4 w-[200px] md:w-[400px] ">
            <TrelloImageLogo></TrelloImageLogo>
            <h3 className="uppercase font-bold text-[12px] md:text-sm">Login</h3>
            <form className="flex flex-col justify-center items-center gap-4 md:gap-8 w-full" onSubmit={handleSubmit}>
                <InputForm type="text" placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}></InputForm>
                <InputForm type="password" placeholder="Enter your password" onChange={(e)=>{setPassword(e.target.value)}}></InputForm>
                {formError === "404" ? (
                <p className="text-red-300 text-sm">Your account not associated with any database(404 error)</p>
                ) : formError === "400" ? (
                <p className="text-red-300 text-sm">Username or password not match (400 error)</p>
                ) : formError==="500"?(
                    <p className="text-red-300 text-sm">Internal service error (500 error)</p>
                ):(<p></p>)}
                {loading?(
                   <ButtonLoading loading={loading}></ButtonLoading>
                ):(<ButtonUsage name="Login"></ButtonUsage>)}
                <LinkRouter LinkName="Create an account" RouterName="/register" />
                <LinkRouter LinkName="Forgot password" RouterName="/forgot-password"/>
            </form>          
        </div>
        </div>
        
    )
}