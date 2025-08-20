"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  ShoppingBag,
  Scale,
  Sparkles,
  Home,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const menuItems = [
  {
    name: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    name: "Order History",
    href: "/account/orders",
    icon: ShoppingBag,
  },
  {
    name: "Measurements",
    href: "/account/measurements",
    icon: Scale,
  },
  {
    name: "Style Preferences",
    href: "/account/preferences",
    icon: Sparkles,
  },
  {
    name: "Address Book",
    href: "/account/addresses",
    icon: Home,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="bg-white rounded-lg shadow-sm p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-md
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-gold text-black font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
        
        <li className="pt-4 mt-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 w-full transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}