"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const NavbarItems = () => {
  const pathName = usePathname();
  const { user } = useUser();

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

      <div className="flex gap-7.5 items-center">
        <Show when="signed-out">
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </Show>
        <Show when="signed-in">
          <div className="nav-user-link">
            <UserButton />
            {user?.firstName && (
              <Link href="/subscriptions" className="nav-user-name">
                {user.firstName}
              </Link>
            )}
          </div>
        </Show>
      </div>
    </nav>
  );
};

export default NavbarItems;
