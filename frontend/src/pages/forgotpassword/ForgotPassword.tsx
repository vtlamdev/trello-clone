import InputForm from "../../components/input";
import { ButtonUsage } from "../../components/Button";
import { useState } from "react";
import LinkRouter from "../../components/link";
import TrelloImageLogo from "../../components/TrelloImageLogo";
import APIClient from "../../base/networking/APIClient";
import { ResponseData } from "../../models/responseModel";
import { RequestData } from "../../models/requestModel";
import { useNavigate } from "react-router-dom";

import { ButtonLoading } from "../../components/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const apiClient: APIClient = new APIClient();
  const [open, setOpen] = useState<boolean>(false);
  const [verification_code, SetVerification_code] = useState<string>("");
  const [isSentEmail, setIsSentEmail] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");

  const navigate = useNavigate();


  const handleClose = () => setOpen(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const responseData: ResponseData = await apiClient.postData(
        `/operation/sendEmail`,
        {} as RequestData,
        { email }
      );
      if (responseData.success) {
        setIsSentEmail(true);
        setOpen(true);
      } else {
        if (responseData.status_code === 404) {
          setFormError("404");
        } else if (responseData.status_code === 400) {
          setFormError("400");
        }
      }
    } catch (err: any) {
      setFormError("500");
    } finally {
      setLoading(false);
    }
  }
  async function handleSubmitCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSentEmail && verification_code) {
      try {
        setLoading(true);
        const responseDataForgot: ResponseData = await apiClient.putData(
          `/user/forgotPassword`,
          {} as RequestData,
          {
            email: email,
            verification_code: verification_code,
            password: newPassword,
          }
        );
        console.log(responseDataForgot);
        if (responseDataForgot.success) {
          navigate("/login");
        } else {
          if (responseDataForgot.status_code === 401) {
            setFormError("401");
          } else if (responseDataForgot.status_code === 400) {
            setFormError("400");
          }
        }
      } catch (err: any) {
        setFormError("500");
      } finally {
        setLoading(false);
      }
    }
  }
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center h-screen gap-2 md:gap-4 w-[200px] md:w-[400px] ">
        <TrelloImageLogo></TrelloImageLogo>
        <h3 className="uppercase font-bold text-[12px] md:text-sm">
          Forgot password
        </h3>
        <form
          className="flex flex-col justify-center items-center gap-4 md:gap-8 w-full"
          onSubmit={handleSubmit}
        >
          <InputForm
            type="email"
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {formError === "401" ? (
            <p className="text-red-300 text-sm">
              Verify code incorrect(401 error)
            </p>
          ) : formError === "400" ? (
            <p className="text-red-300 text-sm">Email not match (400 error)</p>
          ) : formError === "500" ? (
            <p className="text-red-300 text-sm">
              Internal service error (500 error)
            </p>
          ) : (
            <p></p>
          )}
          {loading ? (
            <ButtonLoading loading={loading}></ButtonLoading>
          ) : (
            <ButtonUsage name="Submit"></ButtonUsage>
          )}
          <LinkRouter
            LinkName="Already have an account? Login"
            RouterName="/login"
          />
        </form>
      </div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form onSubmit={handleSubmitCode} className="flex flex-col gap-2">
              <FormControl>
                <FormLabel>New password</FormLabel>
                <Input
                  placeholder="Enter new password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                  type="password"
                  required
                />
                <FormHelperText>New password is required.</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>
                  Verify code we have send it to your email *
                </FormLabel>
                <Input
                  placeholder="Enter your verify code"
                  onChange={(e) => {
                    SetVerification_code(e.target.value);
                  }}
                  required
                />
                <FormHelperText>Verify code is required.</FormHelperText>
              </FormControl>
              {formError === "401" ? (
                <p className="text-red-300 text-sm">
                  Verify code incorrect(401 error)
                </p>
              ) : formError === "400" ? (
                <p className="text-red-300 text-sm">
                  Email not match (400 error)
                </p>
              ) : formError === "500" ? (
                <p className="text-red-300 text-sm">
                  Internal service error (500 error)
                </p>
              ) : (
                <p></p>
              )}
              {loading ? (
                <ButtonLoading loading={loading}></ButtonLoading>
              ) : (
                <ButtonUsage name="Submit"></ButtonUsage>
              )}
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
