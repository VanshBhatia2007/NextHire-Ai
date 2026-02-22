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

const navItems = [
  { name: "Home", link: "/" },
  { name: "Jobs", link: "/jobs" },
];

export default function AppNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Navbar>
      <NavBody>
        <a href="/" className="font-bold text-lg text-white">NextHire AI</a>
        <NavItems items={navItems} />
        <div className="flex gap-2">
          <NavbarButton href="/auth" variant="secondary">Login</NavbarButton>
          <NavbarButton href="/auth" variant="primary">Get Started</NavbarButton>
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
          <NavbarButton href="/auth" variant="primary" className="w-full mt-2">
            Get Started
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}