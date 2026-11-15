import Image from "next/image";
import { SiteLink as Link } from "@/components/ui/site-link";
import { ArrowRight, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { gymImage, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Explore more",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {href && (
        <ButtonLink href={href} variant="text">
          {linkLabel}
        </ButtonLink>
      )}
    </div>
  );
}
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <p className="eyebrow">
          <span className="accent-dot" />
          {eyebrow}
        </p>
        <h1>
          {title.split("\n").map((line, index) => (
            <span key={line} className={index ? "muted-heading" : ""}>
              {line}
              {index === 0 && <br />}
            </span>
          ))}
        </h1>
        <div className="hero-bottom">
          <p>{description}</p>
          {children}
        </div>
      </div>
      <span className="hero-watermark" aria-hidden="true">
        CROSSFIT
      </span>
    </section>
  );
}
export function PendingContent({
  title,
  description,
  previewHref,
}: {
  title: string;
  description: string;
  previewHref?: string;
}) {
  return (
    <div className="pending-content">
      <span className="pending-mark" aria-hidden="true">
        <ArrowUpRight size={30} />
      </span>
      <p className="eyebrow">INFORMATION COMING SOON</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <ButtonLink href={`tel:${site.telephone}`} variant="dark">
        Talk to the gym
      </ButtonLink>
      {previewHref && (
        <Link className="preview-link" href={previewHref}>
          View page structure <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
export function InquiryCTA() {
  return (
    <section className="inquiry-cta">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">YOUR NEXT STEP STARTS HERE</p>
          <h2>
            LET’S TALK
            <br />
            <span>ABOUT YOU.</span>
          </h2>
        </div>
        <div className="cta-actions">
          <p>
            Have a question about training or visiting the gym? Get in touch
            with our team in Uttara.
          </p>
          <ButtonLink href="/contact" variant="dark">
            Get in touch
          </ButtonLink>
          <a className="plain-contact" href={`tel:${site.telephone}`}>
            <Phone size={16} />
            {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
export function GymPhoto({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`gym-photo ${className}`}>
      <Image
        {...gymImage}
        alt={gymImage.alt}
        preload={priority}
        fetchPriority={priority ? "high" : "auto"}
        sizes="(max-width: 768px) 180vw, 100vw"
      />
    </div>
  );
}
export function LocationDetails() {
  return (
    <div className="location-details">
      <p className="eyebrow">FIND YOUR WAY HERE</p>
      <h2>
        Uttara.
        <br />
        <span className="text-muted">Dhaka.</span>
      </h2>
      <p className="address">
        <MapPin size={20} aria-hidden="true" />
        {site.address}
      </p>
      <a className="location-phone" href={`tel:${site.telephone}`}>
        {site.phone}
        <ArrowUpRight size={22} />
      </a>
      <p className="small-note">Call to confirm current opening hours.</p>
      <div className="button-row">
        <ButtonLink href={site.directions}>Get directions</ButtonLink>
        <ButtonLink href="/locations/uttara" variant="text">
          Location details
        </ButtonLink>
      </div>
    </div>
  );
}
export function PreviewNotice() {
  return (
    <aside className="content-notice">
      <span className="accent-dot" />
      <p>
        <strong>Page structure preview.</strong> This page contains no approved
        business record and is excluded from indexing.
      </p>
    </aside>
  );
}
