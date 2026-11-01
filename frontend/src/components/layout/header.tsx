"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, HeartPulse, LayoutDashboard, UserCheck, Users, LogOut } from "lucide-react";
import { logoutUser } from "@/helpers/next-fetch/authActions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Doctors", href: "/doctors", icon: UserCheck },
    { name: "Patients", href: "/patients", icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile hamburger & brand */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <HeartPulse className="h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-900 text-sm">
                Doctor Tracker
              </span>
            </div>
          </div>

          {/* Desktop Title & Subtitle */}
          <div className="hidden lg:block">
            {title && (
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>

          {/* Top Right Action (like Add Doctor, Add Patient button) */}
          <div className="flex items-center gap-3 ml-auto">
            {action}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs flex">
          <div className="w-64 bg-slate-900 text-white p-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-sm">Doctor Tracker</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                        isActive
                          ? "bg-teal-600 text-white font-semibold"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}

