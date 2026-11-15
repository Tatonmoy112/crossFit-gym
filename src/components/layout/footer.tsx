import { SiteLink as Link } from "@/components/ui/site-link";
import { ArrowUpRight, Instagram } from "lucide-react";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link href="/" className="footer-wordmark">
            CROSSFIT<span>GYM.</span>
          </Link>
          <p>
            One step closer.
            <br />
            Uttara, Dhaka.
          </p>
        </div>
        <div className="footer-grid">
          <div className="footer-contact">
            <p className="eyebrow">COME SAY HELLO</p>
            <a className="footer-phone" href={`tel:${site.telephone}`}>
              {site.phone}
              <ArrowUpRight size={18} />
            </a>
            <p>{site.address}</p>
            <div className="social-links">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (opens in a new tab)"
              >
                <Instagram size={18} />
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook (opens in a new tab)"
              >
                f
              </a>
            </div>
          </div>
          {navigation.map((group) => (
            <div key={group.label}>
              <h2>{group.label}</h2>
              {group.links.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Crossfit Gym. All rights reserved.</p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <span>Made for movement.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
