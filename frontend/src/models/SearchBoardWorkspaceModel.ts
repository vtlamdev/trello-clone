export interface SearchWorkspace{
    name: string,
    workspace_id: string
}

export interface SearchBoard{
    title: string,
    board_id: string,
    workspace_id:string,
    workspace_name: string
    updated_at:string
}

export interface SearchData{
    workspaces:SearchWorkspace[],
    boards:SearchBoard[],
    workspace_next_offset: number,
    board_next_offset: number,
    workspace_has_next: boolean,
    board_has_next: boolean

}

export interface SearchBoardWorkspace{
    success: boolean,
    status_code: number,
    data: SearchData
}

