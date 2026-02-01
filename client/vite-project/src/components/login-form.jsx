import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithRedirect, getRedirectResult, signInWithPopup } from "firebase/auth"
import { auth, provider } from "@/utils/firebase"
import axios from "axios"
import { ServerUrl } from "@/App"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setuserData } from "@/redux/userSlice"

export function LoginForm({ className, ...props }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    setLoading(true);
                    setErrorMsg(null);
                    const user = result.user;
                    const name = user.displayName || user.email.split("@")[0];
                    const email = user.email;
                    const response = await axios.post(ServerUrl + "/api/auth/google", {
                        name,
                        email
                    }, { withCredentials: true });
                    console.log("✅ Logged in:", response.data);
                    dispatch(setuserData(response.data));
                    navigate("/");
                }
            } catch (error) {
                console.error(error);
                setErrorMsg(error.response?.data?.message || error.message || "Authentication failed");
            } finally {
                setLoading(false);
            }
        };
        handleRedirectResult();
    }, [navigate, dispatch]);
    const handleGoogleLogin = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const result = await signInWithPopup(auth, provider);
            if (result) {
                const user = result.user;
                const name = user.displayName || user.email.split("@")[0];
                const email = user.email;
                const response = await axios.post(ServerUrl + "/api/auth/google", {
                    name,
                    email
                }, { withCredentials: true });
                dispatch(setuserData(response.data));
                console.log("✅ Logged in:", response.data);
                navigate("/");
            }
        } catch (error) {
            console.error("Google login error:", error);
            setErrorMsg(error.response?.data?.message || error.message || "Google Authentication failed");
            dispatch(setuserData(null));

        } finally {
            setLoading(false);
        }
    };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading}>Login</Button>
              <Button variant="outline" type="button" onClick={handleGoogleLogin} disabled={loading}>
                {loading ? "Connecting..." : "Login with Google"}
              </Button>
              {errorMsg && (
                <p className="text-red-500 text-sm text-center mt-1 font-semibold">
                  {errorMsg}
                </p>
              )}
              <p className="text-center text-sm">
                {"Don't have an account?"} <a href="#">Sign up</a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}