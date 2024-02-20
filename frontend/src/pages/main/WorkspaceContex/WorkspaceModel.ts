export enum VisibilityType {
    PUBLIC='PUBLIC',
    PRIVATE='PRIVATE',
  }
  export enum MemberRoleType {
    OWNER='OWNER',
    ADMIN='ADMIN',
    MEMBER='MEMBER',
    VIEWER='VIEWER',
  }
  export  enum BoardVisibility {
    PUBLIC='PUBLIC',
    WORKSPACE='WORKSPACE',
    PRIVATE='PRIVATE',
  }
export interface User{
  user_id:string,
  username:string,
  email:string
}
 export interface MembersModel {
    role:MemberRoleType
    user:User
  }
  export interface BoardModel {
    board_id: string;
    workspaceId:string;
    title: string;
    description: string;
    visibility: BoardVisibility;
    members: string[];
    star: string[];
    is_closed: boolean;
    created_at: string;
    updated_at: string;
  }
  export interface WorkspaceDataModel {
    workspace_id: string;
    name: string;
    description: string;
    visibility: VisibilityType;
    invite_link:string;
    members: MembersModel[];
    boards: BoardModel[];
    is_deleted:boolean
    created_at: string;
    updated_at: string;
  }
  export interface WorkspaceModel {
    success: boolean;
    status_code: number;
    data: WorkspaceDataModel[]
  }
  