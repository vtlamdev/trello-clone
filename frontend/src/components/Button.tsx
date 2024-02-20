import Button from "@mui/material/Button";
import TrelloImage from "/trello-logo.gif";
import { Link } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
export function ButtonUsage({ name }: { name: React.ReactNode }) {
  return (
    <Button type="submit" className="w-full" variant="contained">
      {name}
    </Button>
  );
}
export function LogoButton() {
  return (
    <Link
      to="/page/home"
      className="text-center flex justify-center items-center"
    >
      <img
        className="w-20 bg-black filter invert"
        src={TrelloImage}
        alt="logo trello"
      />
    </Link>
  );
}
export function ButtonLoading({loading}:{loading:boolean}) {
  return (
    <LoadingButton
      loading={loading}
      variant="contained"
      disabled
      className="w-full"
    >
      <span>loading...</span>
    </LoadingButton>
  );
}
