import React, { MouseEvent, ChangeEvent, useState } from "react";
import { Typography, Paper, Grid, Button, Box, Divider, TextField, Modal, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import APIClient from "../../../../base/networking/APIClient";
import { RequestData } from "../../../../models/requestModel";
import { ResponseData } from "../../../../models/responseModel";
import { ButtonLoading } from "../../../../components/Button";
import { DecodeJWT, UserExpired } from "../../../../base/helper/DecodeJWT";
import { Editing, User, Validator, responseForValidate, Loading } from "./ProfileModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [editing, setEditing] = useState<Editing>({
    editingUsername: false,
    editingPassword: false,
    editingNewEmail: false,
  });

  const [profile, setProfile] = useState<User>({
    username: DecodeJWT().data.username,
    oldPassword: "",
    newPassword: "",
    newEmail: "",
  });

  const [validator, setValidator] = useState<Validator>({
    userNameValidator: true,
    passwordValidator: true,
    emailValidator: true,
  });

  const [responseForValidate, setResponseForValidate] = useState<responseForValidate>({
    responseValidateEmail: "",
    responseValidatePassword: "",
    responseValidateUsername: "",
  });

  const [loading, setLoading] = useState<Loading>({
    loadingSubmitEmail: false,
    loadingSubmitUsername: false,
    loadingSubmitPassword: false,
    loadingVerifyCode: false,
  });

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<string>("");
  const navigate = useNavigate();
  const apiClient: APIClient = new APIClient();

  const validateUsername = (username: string): boolean => {
    let regex = /^[0-9A-Za-z]{4,20}$/;
    if (username == "") {
      setResponseForValidate((prev) => ({ ...prev, responseValidateUsername: "Username can not be empty !!!" }));
      return false;
    }
    if (!regex.test(username)) {
      setResponseForValidate((prev) => ({ ...prev, responseValidateUsername: "Username is not valid !!!" }));
      return false;
    }
    return true;
  };

  const validatePassword = (oldPassword: string, newPassword: string): boolean => {
    let regex = /^[0-9A-Za-z]{6,40}$/;
    if (oldPassword == "" || newPassword == "") {
      setResponseForValidate((prev) => ({ ...prev, responseValidatePassword: "Password can not be empty !!!" }));
      return false;
    }
    if (!regex.test(oldPassword) || !regex.test(newPassword)) {
      setResponseForValidate((prev) => ({ ...prev, responseValidatePassword: "Password is not valid !!!" }));
      return false;
    }
    return true;
  };

  const validateEmail = (newEmail: string): boolean => {
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (newEmail == "") {
      setResponseForValidate((prev) => ({ ...prev, responseValidateEmail: "Email can not be empty !!!" }));
      return false;
    }
    if (!regex.test(newEmail)) {
      setResponseForValidate((prev) => ({ ...prev, responseValidateEmail: "Email is not valid !!!" }));
      return false;
    }
    return true;
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setEditing((prev) => ({ ...prev, editingUsername: true, editingNewEmail: false, editingPassword: false }));
    setValidator((prev) => ({ ...prev, userNameValidator: true }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setEditing((prev) => ({ ...prev, editingPassword: true, editingNewEmail: false, editingUsername: false }));
    setValidator((prev) => ({ ...prev, passwordValidator: true }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setEditing((prev) => ({ ...prev, editingNewEmail: true, editingPassword: false, editingUsername: false }));
    setValidator((prev) => ({ ...prev, emailValidator: true }));
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifyCode(e.target.value);
  };

  const handleSaveUsernameClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setLoading((prev) => ({ ...prev, loadingSubmitUsername: true }));

      if (validateUsername(profile.username)) {
        setValidator((prev) => ({ ...prev, userNameValidator: true }));

        let requestBody = {
          username: profile.username,
        };
        let token = localStorage.getItem("AccessToken") || "";
        if (token) {
          if (!UserExpired()) {
            navigate("/login");
          } else {
            const responseData: ResponseData = await apiClient.putAuthenticatedData(`/user/updateUsername`, {} as RequestData, requestBody, token);

            if (responseData.success) {
              toast.success("Change username successful!");
              localStorage.setItem("AccessToken", responseData.data.token);
              setProfile((prev) => ({ ...prev, username: DecodeJWT().data.username }));
            } else {
              if (responseData.status_code == 401) {
                toast.error("Unauthorized!");
              } else if (responseData.status_code == 404) {
                toast.error("User is not found!");
              } else {
                toast.error("Change username failed!");
              }
            }
          }
        } else {
          navigate("/login");
        }
      } else {
        setValidator((prev) => ({ ...prev, userNameValidator: false }));
      }
    } catch (error) {
    } finally {
      setLoading((prev) => ({ ...prev, loadingSubmitUsername: false }));
      setEditing((prev) => ({ ...prev, editingUsername: false }));
    }
  };

  const handleSavePasswordClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setLoading((prev) => ({ ...prev, loadingSubmitPassword: true }));

      if (validatePassword(profile.oldPassword, profile.newPassword)) {
        setValidator((prev) => ({ ...prev, passwordValidator: true }));

        let requestBody = {
          old_password: profile.oldPassword,
          new_password: profile.newPassword,
        };
        let token = localStorage.getItem("AccessToken") || "";
        if (token) {
          if (!UserExpired()) {
            navigate("/login");
          } else {
            const responseData: ResponseData = await apiClient.putAuthenticatedData(`/user/updatePassword`, {} as RequestData, requestBody, token);

            if (responseData.success) {
              toast.success("Change password successful!");
              setProfile((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
            } else {
              if (responseData.status_code == 401) {
                toast.error("Unauthorized!");
              } else if (responseData.status_code == 404) {
                toast.error("User is not found!");
              } else if (responseData.status_code == 400) {
                toast.error("Password incorrect!");
              } else {
                toast.error("Change password failed!");
              }
            }
          }
        } else {
          navigate("/login");
        }
      } else {
        setValidator((prev) => ({ ...prev, passwordValidator: false }));
      }
    } catch (error) {
    } finally {
      setLoading((prev) => ({ ...prev, loadingSubmitPassword: false }));
      setEditing((prev) => ({ ...prev, editingPassword: false }));
    }
  };

  const handleVerifyEmailClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setLoading((prev) => ({ ...prev, loadingSubmitEmail: true }));

      if (validateEmail(profile.newEmail)) {
        setValidator((prev) => ({ ...prev, emailValidator: true }));

        let requestBody = {
          email: profile.newEmail,
        };
        const responseData: ResponseData = await apiClient.postData(`/operation/sendEmail`, {} as RequestData, requestBody);

        if (responseData.success) {
          toast.success("Send code successful!");
          setOpenModal(true);
        } else {
          if (responseData.status_code == 400) {
            toast.error("Email invalid!");
          } else {
            toast.error("Send code error!");
          }
        }
      } else {
        setValidator((prev) => ({ ...prev, emailValidator: false }));
      }
    } catch (error) {
    } finally {
      setEditing((prev) => ({ ...prev, editingNewEmail: false }));
      setLoading((prev) => ({ ...prev, loadingSubmitEmail: false }));
    }
  };

  const handleVerifyCodeClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      let requestBody = {
        email: profile.newEmail,
        verification_code: verifyCode,
      };
      let token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/user/updateEmail`, {} as RequestData, requestBody, token);

          if (responseData.success) {
            toast.success("Change email successful!");
            localStorage.setItem("AccessToken", responseData.data.token);
            setVerifyCode("");
            setProfile((prev) => ({ ...prev, newEmail: "" }));
            setOpenModal(false);
          } else {
            if (responseData.status_code == 401) {
              toast.error("Verification code or email is wrong!");
            } else {
              toast.error("Change email failed");
            }
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
    } finally {
    }
  };

  const handleCloseModal = () => {
    setVerifyCode("");
    setOpenModal(false);
  };

  const handleClearClick = () => {
    setProfile({
      username: DecodeJWT().data.username,
      oldPassword: "",
      newPassword: "",
      newEmail: "",
    });
    setEditing({
      editingUsername: false,
      editingPassword: false,
      editingNewEmail: false,
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "90vh", backgroundColor: "lightblue" }}>
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: 20, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 1,
            }}
          >
            <Typography variant="h3" fontSize={20}>
              Profile Setting
            </Typography>
            {editing.editingUsername || editing.editingPassword || editing.editingNewEmail ? (
              <Button size="small" variant="contained" color="primary" onClick={handleClearClick}>
                Clear
              </Button>
            ) : (
              <></>
            )}
          </Box>

          <Divider sx={{ marginBottom: 1, marginTop: 1 }} />

          {/* Change username */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 2,
            }}
          >
            <Typography variant="h4" fontSize={15} color="textSecondary" gutterBottom sx={{ alignSelf: "flex-start" }}>
              Username
            </Typography>
            <TextField
              variant="outlined"
              name="username"
              value={profile.username}
              onChange={handleUsernameChange}
              fullWidth
              placeholder="Enter your username"
              inputProps={{ maxLength: 40 }}
              sx={{ marginBottom: 1 }}
            />
            {validator.userNameValidator ? (
              <></>
            ) : (
              <>
                <Typography fontSize={13} gutterBottom sx={{ alignSelf: "flex-start", color: "red" }}>
                  {responseForValidate.responseValidateUsername}
                </Typography>
              </>
            )}
            {editing.editingUsername && profile.username != DecodeJWT().data.username ? (
              loading.loadingSubmitUsername ? (
                <ButtonLoading loading={loading.loadingSubmitUsername}></ButtonLoading>
              ) : (
                <Button size="small" variant="contained" color="primary" onClick={handleSaveUsernameClick} sx={{ alignSelf: "flex-start" }}>
                  Save Username
                </Button>
              )
            ) : (
              <></>
            )}
          </Box>

          {/* Change password */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 2,
            }}
          >
            <Typography variant="h4" fontSize={15} color="textSecondary" gutterBottom sx={{ alignSelf: "flex-start" }}>
              Change password
            </Typography>
            <TextField
              variant="outlined"
              type="password"
              name="oldPassword"
              value={profile.oldPassword}
              onChange={handlePasswordChange}
              fullWidth
              placeholder="Enter your old password"
              sx={{ marginBottom: 1 }}
            />
            <TextField
              variant="outlined"
              type="password"
              name="newPassword"
              value={profile.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              placeholder="Enter your new password"
              sx={{ marginBottom: 1 }}
            />
            {validator.passwordValidator ? (
              <></>
            ) : (
              <>
                <Typography fontSize={12} gutterBottom sx={{ alignSelf: "flex-start", color: "red" }}>
                  {responseForValidate.responseValidatePassword}
                </Typography>
              </>
            )}
            {editing.editingPassword ? (
              loading.loadingSubmitPassword ? (
                <ButtonLoading loading={loading.loadingSubmitPassword}></ButtonLoading>
              ) : (
                <Button size="small" variant="contained" color="primary" onClick={handleSavePasswordClick} sx={{ alignSelf: "flex-start" }}>
                  Save Password
                </Button>
              )
            ) : (
              <></>
            )}
          </Box>

          {/* Change email */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 1,
            }}
          >
            <Typography variant="h4" fontSize={15} color="textSecondary" gutterBottom sx={{ alignSelf: "flex-start" }}>
              Change email
            </Typography>
            <TextField variant="outlined" size="small" name="newEmail" value={profile.newEmail} onChange={handleEmailChange} fullWidth placeholder="Enter your new email" sx={{ marginBottom: 1 }} />
            {validator.emailValidator ? (
              <></>
            ) : (
              <>
                <Typography fontSize={12} gutterBottom sx={{ alignSelf: "flex-start", color: "red" }}>
                  {responseForValidate.responseValidateEmail}
                </Typography>
              </>
            )}
            {editing.editingNewEmail ? (
              loading.loadingSubmitEmail ? (
                <ButtonLoading loading={loading.loadingSubmitEmail}></ButtonLoading>
              ) : (
                <Button size="small" variant="contained" color="primary" onClick={handleVerifyEmailClick} sx={{ alignSelf: "flex-start" }}>
                  Verify Email
                </Button>
              )
            ) : (
              <></>
            )}
          </Box>

          {/* <Divider sx={{ marginBottom: 1, marginTop: 1 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 0,
            }}
          >
            <Typography variant="h4" fontSize={15} color="textSecondary" gutterBottom sx={{ alignSelf: "flex-start" }}>
              Delete Account
            </Typography>
            <Button size="small" variant="contained" color="error" onClick={() => {}} sx={{ alignSelf: "flex-start" }}>
              Delete Account
            </Button>
          </Box> */}
        </Paper>
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "5px solid lightblue",
              borderRadius: "5px",
              boxShadow: 24,
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid container sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
              <Grid item>
                <Typography variant="h4" fontSize={15} color="textSecondary">
                  Check email and verify token !!!
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={handleCloseModal} sx={{ padding: 0 }}>
                  <CloseOutlinedIcon sx={{ width: 25, height: 25 }} />
                </IconButton>
              </Grid>
            </Grid>
            <TextField
              variant="outlined"
              name="verifyCode"
              value={verifyCode}
              onChange={handleCodeChange}
              fullWidth
              placeholder="Enter your verify code"
              inputProps={{ maxLength: 40 }}
              sx={{ marginBottom: 2 }}
            />
            {loading.loadingVerifyCode ? (
              <ButtonLoading loading={loading.loadingVerifyCode}></ButtonLoading>
            ) : (
              <Button size="small" variant="contained" color="primary" onClick={handleVerifyCodeClick} sx={{}}>
                Submit
              </Button>
            )}
          </Box>
        </Modal>
        <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={true} />
      </Grid>
    </Grid>
  );
};

export default Profile;
