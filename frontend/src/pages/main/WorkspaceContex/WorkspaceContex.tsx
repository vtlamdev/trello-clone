import React, { ReactNode, createContext, useContext, useState } from "react";
import { WorkspaceModel } from "./WorkspaceModel";
import APIClient from "../../../base/networking/APIClient";
import { RequestData } from "../../../models/requestModel";
import { ResponseData } from "../../../models/responseModel";
import { useEffect } from "react";
import { UserExpired } from "../../../base/helper/DecodeJWT";
import { useNavigate } from "react-router-dom";
export const AllWorkspaceContex = createContext<{
  allWorkspace: WorkspaceModel | null;
  setAllWorkspace: React.Dispatch<React.SetStateAction<WorkspaceModel | null>>;
  fetchData:()=>void;
  isLoadingWorkspace:boolean
} | null
>(null);
export default function AllWorkspaceContexProvider({
  children,
}: {
  children: ReactNode;
}) {
  const apiClient: APIClient = new APIClient();
  const userToken=localStorage.getItem("AccessToken")
  const navigate=useNavigate()
  const [allWorkspace, setAllWorkspace] = useState<WorkspaceModel | null>(null);
  const [isLoadingWorkspace, setIsLoadingWorkspace]=useState<boolean>(false)
  const fetchData = async () => {
    try {
      if(userToken)
      {
        setIsLoadingWorkspace(true)
        if(!UserExpired())
        {   
          navigate("/login")
        }
        else
        {
          const responseData: ResponseData = await apiClient.getAuthenticatedData(
            `/workspace/all`,
            {} as RequestData,
            userToken,
          );
          setAllWorkspace(responseData);
        }
      }
    } catch (error) {
      console.error('Error fetching workspace data:', error);
    }
    finally{
      setIsLoadingWorkspace(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, []); 
  
  return (
    <AllWorkspaceContex.Provider value={{ allWorkspace, setAllWorkspace, fetchData ,isLoadingWorkspace}}>
      {children}
    </AllWorkspaceContex.Provider>
  );
}
export function useAllWorkspaceContext() {
  const contex = useContext(AllWorkspaceContex);
  if (!contex) {
    throw new Error(
      "useAllWorkspace contex must be used within a AllWorkspaceContexProdiver"
    );
  }
  return contex;
}
