
import { NavigateFunction } from "react-router-dom";

export const navigateTo = (navigate: NavigateFunction, path: string) => {
  navigate(path);
};

export const redirectBasedOnRole = (role: string | null, navigate: NavigateFunction) => {
  if (role === "admin") {
    navigateTo(navigate, "/admin");
  } else if (role === "student") {
    navigateTo(navigate, "/student");
  } else {
    navigateTo(navigate, "/login");
  }
};
