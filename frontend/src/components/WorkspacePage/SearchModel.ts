export interface UsersModel{
    username: string,
    email: string,
    user_id: string
}
export interface Users{
    users:UsersModel[]
}
export interface SearchUsersModel{
    success: boolean,
    status_code: number,
    data:Users
}