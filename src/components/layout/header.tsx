"use client";
import Image from "next/image";
import { SiteLink as Link } from "@/components/ui/site-link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, MapPin, Menu, Phone } from "lucide-react";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export function Brand() {
  return (
    <Link href="/" className="brand">
      <Image src="/images/brand/logo.jpg" width={39} height={39} alt="" />
      <span>
        CROSSFIT <span className="brand-sub">GYM · UTTARA</span>
      </span>
      <span className="sr-only">home</span>
    </Link>
  );
}
export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>
            <MapPin size={12} /> UTTARA, DHAKA
          </span>
          <span className="topbar-message">ONE STEP CLOSER.</span>
          <a href={`tel:${site.telephone}`}>
            <Phone size={12} /> {site.phone}
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav aria-label="Main navigation" className="desktop-nav">
            {navigation.map((group) => (
              <div
                className="nav-group"
                key={group.label}
                data-open={desktopOpen === group.label}
                onMouseEnter={() => setDesktopOpen(group.label)}
                onMouseLeave={() => setDesktopOpen(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    setDesktopOpen(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setDesktopOpen(null);
                    event.currentTarget.querySelector("button")?.focus();
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={desktopOpen === group.label}
                  aria-controls={`nav-${group.label.replaceAll(" ", "-")}`}
                  onClick={() =>
                    setDesktopOpen(
                      desktopOpen === group.label ? null : group.label,
                    )
                  }
                  className={
                    group.links.some((item) => path === item.href)
                      ? "active"
                      : ""
                  }
                >
                  {group.label}
                  <ChevronDown size={12} />
                </button>
                <div
                  className="nav-dropdown"
                  id={`nav-${group.label.replaceAll(" ", "-")}`}
                >
                  {group.links.map((item) => (
                    <Link
                      href={item.href}
                      key={item.href}
                      onClick={() => setDesktopOpen(null)}
                      aria-current={path === item.href ? "page" : undefined}
                    >
                      {item.label}
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <Link href="/contact" className="header-cta">
            Let’s talk <ArrowUpRight size={17} />
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="icon-button mobile-toggle"
                aria-label="Open navigation"
              >
                <Menu />
              </button>
            </DialogTrigger>
            <DialogContent className="mobile-menu">
              <DialogTitle>Explore Crossfit Gym</DialogTitle>
              <DialogDescription className="small-note">
                Find your next step in Uttara.
              </DialogDescription>
              <nav aria-label="Mobile navigation">
                {navigation.map((group) => (
                  <details key={group.label} open>
                    <summary>
                      {group.label}
                      <ChevronDown size={16} />
                    </summary>
                    <div>
                      {group.links.map((item) => (
                        <Link
                          href={item.href}
                          key={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={path === item.href ? "page" : undefined}
                        >
                          {item.label}
                          <ArrowUpRight size={16} />
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </nav>
              <a
                className="button button-primary"
                href={`tel:${site.telephone}`}
              >
                Call {site.phone}
                <Phone size={16} />
              </a>
            </DialogContent>
          </Dialog>
        </div>
      </header>
    </>
  );
}
