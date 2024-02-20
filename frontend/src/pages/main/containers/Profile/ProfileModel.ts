export interface User {
  username: string;
  oldPassword: string;
  newPassword: string;
  newEmail: string;
}

export interface Editing {
  editingUsername: boolean;
  editingPassword: boolean;
  editingNewEmail: boolean;
}

export interface Validator {
  userNameValidator: boolean;
  passwordValidator: boolean;
  emailValidator: boolean;
}

export interface Loading {
  loadingSubmitUsername: boolean;
  loadingSubmitPassword: boolean;
  loadingSubmitEmail: boolean;
  loadingVerifyCode: boolean;
}

export interface responseForValidate {
  responseValidateUsername: string;
  responseValidatePassword: string;
  responseValidateEmail: string;
}
