import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setuserData } from "@/redux/userSlice";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ServerUrl = "http://localhost:8000";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Jobs", link: "/jobs" },
  { name: "Pricing", link: "/pricing" }
];

export default function AppNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select user state from Redux store
  const userData = useSelector((state) => state.user.userData);

  const handleLogout = async () => {
    try {
      // 1. Sign out from the server backend
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true });
      // 2. Sign out from Firebase client
      await signOut(auth);
      // 3. Clear user info in Redux store
      dispatch(setuserData(null));
      // 4. Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar>
      <NavBody>
        <a href="/" className="font-bold text-lg text-white">NextHire AI</a>
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          {userData ? (
            <>
              <a 
                href="/profile" 
                className="flex items-center justify-center size-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-sm border border-violet-500/50 shadow-[0_0_15px_rgba(109,40,217,0.4)] transition-all hover:scale-105 active:scale-95 duration-200"
                title={userData?.name || "Profile"}
              >
                {(userData?.name ? userData.name.charAt(0) : "U").toUpperCase()}
              </a>
              <NavbarButton as="button" onClick={handleLogout} variant="primary">Logout</NavbarButton>
            </>
          ) : (
            <>
              <NavbarButton href="/auth" variant="secondary">Login</NavbarButton>
              <NavbarButton href="/auth" variant="primary">Get Started</NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <a href="/" className="font-bold text-lg text-white">NextHire AI</a>
          <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          {navItems.map((item) => (
            <a key={item.name} href={item.link} className="block py-2 text-white"
              onClick={() => setMobileOpen(false)}>
              {item.name}
            </a>
          ))}
          {userData ? (
            <>
              <div className="flex items-center gap-3 py-3 px-1 border-b border-neutral-900 w-full mb-2">
                <div className="flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-black text-lg border border-violet-500/50">
                  {(userData?.name ? userData.name.charAt(0) : "U").toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{userData?.name}</p>
                  <p className="text-xs text-neutral-500 mt-1.5">{userData?.email}</p>
                </div>
              </div>
              <NavbarButton href="/profile" variant="secondary" className="w-full mt-1" onClick={() => setMobileOpen(false)}>
                Profile
              </NavbarButton>
              <NavbarButton as="button" onClick={() => { handleLogout(); setMobileOpen(false); }} variant="primary" className="w-full mt-2">
                Logout
              </NavbarButton>
            </>
          ) : (
            <NavbarButton href="/auth" variant="primary" className="w-full mt-2" onClick={() => setMobileOpen(false)}>
              Get Started
            </NavbarButton>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}