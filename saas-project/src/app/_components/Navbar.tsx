"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggler";

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 
      ${
        scrolled
          ? "bg-muted/80 backdrop-blur-md border-b border-border"
          : "bg-muted/0 border-border border-b"
      }`}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4 md:py-6 px-4 md:px-6 space-y-4 md:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold">
          <Link href="/" className="flex items-center gap-2">
            <img src="/favicon.ico" alt="XRPlatform" className="h-8 w-auto" />
            <span className="text-xl font-bold">XRPlatform</span>
          </Link>
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center flex-wrap justify-center space-x-4 md:space-x-6">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Buttons */}
          {isClient && (
            <>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md 
                    transition-all duration-200 hover:shadow-md"
                >
                  Log In
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/node"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Nodes
                </Link>
                <UserButton />
              </SignedIn>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}