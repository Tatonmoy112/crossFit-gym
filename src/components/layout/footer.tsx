import { BrandLink } from "@/components/layout/brand-link";
import { NavigationLink } from "@/components/ui/navigation-link";
import { footerContent } from "@/content/footer";
import { navigation } from "@/content/navigation";

function Footer() {
  return (
    <footer data-surface="charcoal" className="border-t border-input">
      <div className="layout-container space-y-10 py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="min-w-0 space-y-4">
            <BrandLink className="max-w-full" />
            <h2 className="type-control-strong">Contact details</h2>
            <address className="text-measure not-italic">
              {footerContent.address}
            </address>
            <div className="flex flex-wrap gap-2">
              <NavigationLink href={footerContent.phone.href}>
                {footerContent.phone.label}
              </NavigationLink>
              <NavigationLink href={footerContent.directions.href}>
                {footerContent.directions.label}
              </NavigationLink>
            </div>
            <p className="type-hint text-measure text-muted-foreground">
              {footerContent.hoursNote}
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] content-start gap-6"
          >
            {navigation.map((group) => (
              <div key={group.label} className="min-w-0">
                <h2 className="type-control-strong mb-3">{group.label}</h2>
                <ul className="m-0 list-none p-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <NavigationLink href={link.href} className="flex w-full">
                        {link.label}
                      </NavigationLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="space-y-4 border-t border-input pt-6">
          <ul
            aria-label="Social links"
            className="m-0 flex list-none flex-wrap gap-2 p-2"
          >
            {footerContent.socials.map((link) => (
              <li key={link.href}>
                <NavigationLink href={link.href}>{link.label}</NavigationLink>
              </li>
            ))}
          </ul>
          {footerContent.legal.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <NavigationLink href={link.href}>
                      {link.label}
                    </NavigationLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          {footerContent.legalNotice && (
            <p className="type-hint text-measure text-muted-foreground">
              {footerContent.legalNotice}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

export { Footer };
