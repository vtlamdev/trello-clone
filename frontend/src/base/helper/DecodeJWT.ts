import { jwtDecode } from "jwt-decode";
const DecodeJWT = () => {
  const token = localStorage.getItem("AccessToken") || "";
  if (token != "") {
    const decode = jwtDecode(token);
    return JSON.parse(JSON.stringify(decode));
  } else {
    return {
      exp: 0,
      data: {
        user_id: "",
        username: "",
        email: "",
      },
    };
  }
};

const UserExpired =()=>{
  const userInfor= DecodeJWT();
  if(new Date(userInfor.exp*1000)<new Date())
  {
    return false
  }
  return true
}

export { DecodeJWT, UserExpired };
