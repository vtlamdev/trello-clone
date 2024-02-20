export interface Workspace{
    workspace_id:string,
    name:string,
    description:string,
    visibility:string,
    member:{user_id:string,role:string}[],
    created_at:string,
    updated_at:string
}