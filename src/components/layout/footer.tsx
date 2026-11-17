import { BrandLink } from "@/components/layout/brand-link";
import { FooterCallToAction } from "@/components/layout/footer-call-to-action";
import { Container } from "@/components/shared/container";
import { Card } from "@/components/ui/card";
import { NavigationLink } from "@/components/ui/navigation-link";
import { footerContent } from "@/content/footer";
import { navigation } from "@/content/navigation";

function Footer() {
  return (
    <footer data-site-footer data-surface="light">
      <FooterCallToAction content={footerContent.cta} />
      <div className="footer-body">
        <Container>
          <Card className="footer-panel min-w-0 gap-8 overflow-visible rounded-[2rem] border border-border p-4 ring-0 md:p-10">
            <div className="footer-panel-main">
              <div className="min-w-0 space-y-4">
                <BrandLink className="max-w-full flex-wrap" />
                <p className="m-0 text-base font-medium">
                  {footerContent.tagline}
                </p>
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
                className="footer-navigation min-w-0 content-start"
              >
                {navigation.map((group) => (
                  <div key={group.label} className="min-w-0">
                    <h2 className="type-control-strong mb-3">{group.label}</h2>
                    <ul className="m-0 list-none p-0">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <NavigationLink
                            href={link.href}
                            className="flex w-full px-2"
                          >
                            {link.label}
                          </NavigationLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
            <div className="footer-meta min-w-0 border-t border-border pt-6">
              <ul
                aria-label="Social links"
                className="m-0 flex list-none flex-wrap content-start gap-2 p-2"
              >
                {footerContent.socials.map((link) => (
                  <li key={link.href}>
                    <NavigationLink href={link.href}>
                      {link.label}
                    </NavigationLink>
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
                <p className="footer-legal-note type-hint text-measure m-0 text-muted-foreground">
                  {footerContent.legalNotice}
                </p>
              )}
            </div>
          </Card>
          {/* BrandLink supplies the accessible identity; this repeat is decoration. */}
          <div className="footer-wordmark-frame" aria-hidden="true" inert>
            <p className="footer-wordmark">{footerContent.wordmark}</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export { Footer };
