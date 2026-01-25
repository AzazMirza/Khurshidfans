
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ComponentProps } from "react";
import { ThemeColors, DEFAULT_THEME } from "@/lib/theme";

async function fetchTheme(): Promise<ThemeColors> {
  // const API_BASE = process.env.NEXT_PUBLIC_API;
  // if (!API_BASE) return DEFAULT_THEME;

  try {
    const res = await fetch(`/api/theme`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return DEFAULT_THEME;

    const data = await res.json();

    // ✅ Validate and ensure correct shape
    if (data?.pr && data?.se) {
      // Optional: enforce full type
      return {
        pr: data.pr,
        se: data.se,
        tx: data.tx ?? DEFAULT_THEME.tx,
        bg: data.bg ?? DEFAULT_THEME.bg,
      };
    }
    return DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}
  const colors: ThemeColors = await fetchTheme();


export  const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  
  <NavigationMenu {...props} viewport={false}>
  <NavigationMenuList className="w-full flex justify-evenly" style={{color: (colors.tx)}}>
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link className="nav-links font-extrabold" href="/">Home</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>

    {/* <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link className="nav-links" href="#">Blogs</Link>
      </NavigationMenuLink>
    </NavigationMenuItem> */}

    <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link className="nav-links" href="/catalogue">
              Products
            </Link>
          </NavigationMenuLink>
      {/* <NavigationMenuTrigger className="nav-links">Store</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="flex flex-col w-[140px]">
          <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] " href="#">
              View Cart
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] " href="#">
              Check Out
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] " href="#">
              Profile
            </Link>
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent> */}
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuTrigger className="nav-links">Support</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="flex flex-col w-[140px]">
          <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] hover:text-white" href="/#contact">
              Contact Us
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] hover:text-white" href="/stillFaq">
              FAQ
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] hover:text-white" href="\aboutus">
              About Us
            </Link>
          </NavigationMenuLink>
          
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuTrigger className="nav-links">Customer Service</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="flex flex-col w-[140px]">
          <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] hover:text-white" href="#">
              Complaint
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] hover:text-white" href="#">
              Reviews
            </Link>
          </NavigationMenuLink>
          {/* <NavigationMenuLink asChild>
            <Link className="border-b hover:bg-[var(--nav-color)] hover:text-white" href="#">
              About Us
            </Link>
          </NavigationMenuLink> */}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link className="nav-links" href="#">Export Queries</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
     <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link className="nav-links" href="/joinus">Join Us</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

);
