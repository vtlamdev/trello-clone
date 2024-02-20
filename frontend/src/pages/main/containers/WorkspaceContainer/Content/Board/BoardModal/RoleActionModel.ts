export interface BoardPermissionsModel {
    view: boolean;
    edit: boolean;
  }
  
export interface RoleActionsModel {
    [key: string]: {
      createDeletePublicBoard: boolean;
      createDeleteWorkspaceBoard: boolean;
      createDeletePrivateBoard: boolean;
      changeWorkspaceVisibility: boolean;
      changeBoardVisibility: boolean;
      canAssignRoles:string[];
      boardPermissions: {
        PUBLIC: BoardPermissionsModel;
        WORKSPACE: BoardPermissionsModel;
        PRIVATE: BoardPermissionsModel;
      };
    };
  }