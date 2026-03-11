import Link from "next/link";
import Image from "next/image";
import NavbarItems from "./NavbarItems";

const Navbar = () => {
  return (
    <header className="w-full fixed z-50 bg-(--bg-primary)">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image src="/assets/logo.png" alt="Bookfied" width={42} height={26} />
          <span className="logo-text">Book Mind</span>
        </Link>

        <NavbarItems />
      </div>
    </header>
  );
};

export default Navbar;
