"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NavbarItems = () => {
  const pathName = usePathname();

  return (
    <nav className="w-fit flex gap-7.5 items-center">
      {navItems.map(({ label, href }) => {
        const isActive =
          pathName === href || (href !== "/" && pathName.startsWith(href));

        return (
          <Link
            href={href}
            key={label}
            className={cn(
              "nav-link-base",
              isActive ? "nav-link-active" : "text-black hover:opacity-70",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavbarItems;
