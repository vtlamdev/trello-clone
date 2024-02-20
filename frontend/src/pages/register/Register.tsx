import InputForm from "../../components/input";
import { ButtonUsage } from "../../components/Button";
import {  useState } from "react";
import LinkRouter from "../../components/link";
import TrelloImageLogo from "../../components/TrelloImageLogo";
import APIClient from "../../base/networking/APIClient";
import { ResponseData } from "../../models/responseModel";
import { RequestData } from "../../models/requestModel";
import { ButtonLoading } from "../../components/Button";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [verification_code, SetVerification_code] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [isSentEmail, setIsSentEmail] = useState<boolean>(false);
  const navigate = useNavigate();

  const apiClient: APIClient = new APIClient();
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => setOpen(false);
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
  // useEffect(() => {
  //   if (localStorage.getItem("AccessToken")) {
  //     if(UserExpired())
  //     {
  //       if (state === null) {
  //         navigate("/page/home");
  //       } else {
  //         navigate(-1);
  //       }
  //     }
  //   }
  // });
  const registerForm = z
    .object({
      username: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    })
    .refine(
      async (data) => {
        if (data.password !== data.confirmPassword) {
          setFormError("password");
          return false;
        } else if (Number(data.password) < 7) {
          setFormError("lessCharacter");
        }
        return true;
      },
      {
        message: "Passwords must match",
      }
    );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      setLoading(true);
      const submit = await registerForm.safeParseAsync({
        username,
        email,
        password,
        confirmPassword,
      });
      if (submit.success) {
        setOpen(true);
        const responseData: ResponseData = await apiClient.postData(
          `/operation/sendEmail`,
          {} as RequestData,
          { email }
        );
        if (responseData.success) {
          setIsSentEmail(true);
        }
      }
    } catch (err: any) {
      setFormError("500");
    } finally {
      setLoading(false);
    }
  }
  async function handleSubmitToken(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSentEmail && verification_code) {
      try {
        setLoading(true);
        const responseDataRegister: ResponseData = await apiClient.postData(
          `/authentication/register`,
          {} as RequestData,
          { username, email, password, verification_code }
        );
        if (responseDataRegister.success) {
          navigate("/login");
        } else {
          if (responseDataRegister.status_code === 401) {
            setFormError("401");
          } else if (responseDataRegister.status_code === 400) {
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
        <h3 className="uppercase font-bold text-[12px] md:text-sm">Register</h3>
        <form
          className="flex flex-col justify-center items-center gap-4 md:gap-8 w-full "
          onSubmit={handleSubmit}
        >
          <InputForm
            placeholder="Enter your username"
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></InputForm>
          <InputForm
            placeholder="Enter your email"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></InputForm>
          <InputForm
            placeholder="Enter your password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></InputForm>
          <InputForm
            placeholder="Confirm password"
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          ></InputForm>
          {formError === "401" ? (
            <p className="text-red-300 text-sm">
              Your verify code not match(401 error)
            </p>
          ) : formError === "400" ? (
            <p className="text-red-300 text-sm">
              email or password not valid (400 error)
            </p>
          ) : formError === "500" ? (
            <p className="text-red-300 text-sm">
              Internal service error (500 error)
            </p>
          ) : formError === "password" ? (
            <p className="text-red-300 text-sm">Password not match</p>
          ) : formError === "lessCharacter" ? (
            <p className="text-red-300 text-sm">
              Password must more than 7 characters
            </p>
          ) : (
            <p></p>
          )}

          {loading ? (
            <ButtonLoading loading={loading}></ButtonLoading>
          ) : (
            <ButtonUsage name="Register"></ButtonUsage>
          )}
          <LinkRouter
            LinkName="Already have an account? Login"
            RouterName="/login"
          ></LinkRouter>
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
            <FormControl>
              <form onSubmit={handleSubmitToken}>
                <FormLabel>
                  Enter your token we have send it to your email *
                </FormLabel>
                <Input
                  placeholder="Enter your token"
                  onChange={(e) => {
                    SetVerification_code(e.target.value);
                  }}
                  required
                />
                <FormHelperText>Token is required.</FormHelperText>
                {loading ? (
                  <ButtonLoading loading={loading}></ButtonLoading>
                ) : (
                  <ButtonUsage name="Submit"></ButtonUsage>
                )}
              </form>
            </FormControl>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
