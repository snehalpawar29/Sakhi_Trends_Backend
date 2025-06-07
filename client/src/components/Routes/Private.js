import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import  {Spinner}  from "../../components/spinner";
export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/user-auth", {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        });
  
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setOk(false);
      }
    };
  
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner/>;
}
