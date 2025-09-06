/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { logout, setUser } from "@/redux/features/user/userSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface DecodedToken {
  id: string; // Ensure this matches your JWT payload
  role: string; // Ensure this matches your JWT payload
  exp: number;
}

const profile = [
  {
    name: "Blog",
    link: "/blog",
  },

  {
    name: "Payment",
    link: "/payment",
  },
];

const useAuthUser = () => {
  const dispatch = useDispatch();
  const [temp, setTemp] = useState<any | null>(null);
  const [profileLinks, setProfileLinks] = useState<
    {
      name: string;
      link: string;
    }[]
  >(profile);
  const navigate = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const decodedUser = jwtDecode<DecodedToken>(token);
        console.log(decodedUser);
        setTemp(decodedUser);
        if (decodedUser.role === "INDIVIDUAL") {
          setProfileLinks([
            {
              name: "Profile",
              link: "/profile",
            },
            {
              name: "Project",
              link: "/my-project",
            },
            {
              name: "Messaging",
              link: "/messaging",
            },

            {
              name: "Consultation",
              link: "/my-consultation",
            },
            {
              name: "Favorite",
              link: "/favorite",
            },
            ...profile,
          ]);
        }
        if (decodedUser.role === "COMPANY") {
          setProfileLinks([
            {
              name: "Company",
              link: "/company",
            },
            {
              name: "Job List",
              link: "/job-list",
            },
            ...profile,
          ]);
        }
        if (decoded.exp * 1000 < Date.now()) {
          // Check if the token is expired
          Cookies.remove("token");
          return;
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  // Fetch user details using the extracted userId
  const { data, error, isLoading } = useGetMeQuery({});

  console.log(data);
  useEffect(() => {
    if (data?.success) {
      dispatch(
        setUser({
          user: data.data,
        })
      );
    }
  }, [data, dispatch]);

  const handleLogout = () => {
    // Clean up all stored authentication data
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    dispatch(logout()); // Reset Redux store
    navigate.push("/signIn"); // Redirect to sign-in page
  };
  return {
    user: data?.data || temp,
    isLoading,
    error,
    handleLogout,
    profileLinks,
  };
};

export default useAuthUser;
