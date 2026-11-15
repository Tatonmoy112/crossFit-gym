import { SiteLink as Link } from "@/components/ui/site-link";
import {
  ArrowDown,
  ArrowUpRight,
  Dumbbell,
  MapPin,
  Phone,
  Users,
  CalendarDays,
  MoveUpRight,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  GymPhoto,
  InquiryCTA,
  LocationDetails,
  SectionHeading,
} from "@/components/shared/sections";
import { site } from "@/content/site";
import { HomeContentSections } from "./content-sections";
const explore = [
  {
    number: "01",
    name: "Training programs",
    detail: "Find your starting point",
    href: "/programs",
    icon: Dumbbell,
  },
  {
    number: "02",
    name: "Meet the coaches",
    detail: "The people behind your progress",
    href: "/coaches",
    icon: Users,
  },
  {
    number: "03",
    name: "Your membership",
    detail: "Take the next step",
    href: "/membership",
    icon: CalendarDays,
  },
];
export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-grid-line" />
        <div className="container home-hero-inner">
          <div className="home-hero-copy">
            <p className="eyebrow">
              <span className="accent-dot" /> CROSSFIT GYM · UTTARA, DHAKA
            </p>
            <h1>
              ONE STEP
              <br />
              <span>CLOSER.</span>
            </h1>
            <p className="home-hero-description">
              Your next step starts in Uttara.
              <br />
              Come find Crossfit Gym.
            </p>
            <div className="button-row">
              <ButtonLink href="/programs">Explore the gym</ButtonLink>
              <a href={`tel:${site.telephone}`} className="hero-call">
                <Phone size={16} />
                Talk to our team
              </a>
            </div>
            <a className="hero-scroll" href="#discover">
              <ArrowDown size={15} /> FIND YOUR NEXT STEP
            </a>
          </div>
          <div className="home-hero-visual">
            <GymPhoto priority />
            <div className="photo-label">
              <span className="accent-dot" /> A LOOK INSIDE
            </div>
            <div className="hero-photo-caption">
              <MapPin size={17} />
              <span>
                SECTOR 12
                <br />
                <strong>UTTARA, DHAKA</strong>
              </span>
              <Link
                href="/locations/uttara"
                aria-label="Explore the Uttara location"
              >
                <ArrowUpRight size={25} />
              </Link>
            </div>
            <span className="visual-coordinate">UTTARA / DHAKA</span>
          </div>
        </div>
        <div className="hero-bottom-bar">
          <div className="container">
            <span>YOUR SPACE. YOUR PACE. YOUR NEXT STEP.</span>
            <Link href="/contact">
              LET’S GET STARTED <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <div className="movement-strip" aria-hidden="true">
        <span>SHOW UP.</span>
        <span className="strip-star">✳</span>
        <span>TAKE A STEP.</span>
        <span className="strip-star">✳</span>
        <span>KEEP MOVING.</span>
        <span className="strip-star">✳</span>
      </div>
      <section id="discover" className="section intro-section">
        <div className="container intro-grid">
          <div>
            <p className="eyebrow">WELCOME TO CROSSFIT GYM</p>
            <h2>
              A PLACE TO
              <br />
              MAKE YOUR
              <br />
              <span className="text-muted">NEXT MOVE.</span>
            </h2>
          </div>
          <div className="intro-copy">
            <span className="section-index">/ 01 — THE GYM</span>
            <p className="large-copy">
              Right here in Uttara.
              <br />
              One step closer to you.
            </p>
            <p>
              Find us at House 2, Road 2/A, Sector 12. Whether you’re exploring
              the gym or asking about training, our team is a phone call away.
            </p>
            <ButtonLink href="/about" variant="text">
              Get to know us
            </ButtonLink>
            <div className="location-mini">
              <MapPin size={18} />
              <span>
                Sonargoan Janapat Road
                <br />
                Uttara, Dhaka, Bangladesh
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section explore-section">
        <div className="container">
          <SectionHeading
            eyebrow="MAKE IT YOURS"
            title="YOUR NEXT STEP."
            description="A little direction for wherever you’re starting."
            href="/programs"
            linkLabel="All programs"
          />
          <div className="explore-grid">
            {explore.map((item) => (
              <Link className="explore-card" href={item.href} key={item.href}>
                <div className="explore-card-top">
                  <span>{item.number}</span>
                  <item.icon size={34} strokeWidth={1.2} />
                </div>
                <div>
                  <p>{item.detail}</p>
                  <h3>{item.name}</h3>
                </div>
                <span className="card-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <HomeContentSections />
      <section className="section facilities-preview">
        <div className="container facilities-grid">
          <div className="facility-image">
            <GymPhoto />
            <span className="image-corner">A LOOK INSIDE THE GYM</span>
          </div>
          <div>
            <p className="eyebrow">GET A FEEL FOR THE PLACE</p>
            <h2>
              SEE WHERE
              <br />
              IT STARTS.
            </h2>
            <p>
              Take a look at the supplied gym photograph, then get in touch to
              arrange a visit and see the space for yourself.
            </p>
            <div className="button-row">
              <ButtonLink href="/facilities" variant="dark">
                Explore the space
              </ButtonLink>
              <ButtonLink href="/gallery" variant="text">
                View gallery
              </ButtonLink>
            </div>
            <div className="outlined-callout">
              <MoveUpRight size={28} />
              <span>
                Pictures are a start.
                <br />
                <strong>Come see us in Uttara.</strong>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section home-links">
        <div className="container">
          <SectionHeading eyebrow="MORE TO EXPLORE" title="BEYOND THE FLOOR." />
          <div className="editorial-links">
            {[
              {
                href: "/schedule",
                name: "Plan your week",
                meta: "CLASS SCHEDULE",
              },
              {
                href: "/blog",
                name: "The gym journal",
                meta: "STORIES & UPDATES",
              },
              {
                href: "/supplements",
                name: "The supplement guide",
                meta: "PRODUCT INFORMATION",
              },
            ].map((item, i) => (
              <Link key={item.href} href={item.href}>
                <span className="row-number">0{i + 1}</span>
                <span>
                  <small>{item.meta}</small>
                  <h3>{item.name}</h3>
                </span>
                <ArrowUpRight size={28} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section location-section">
        <div className="container location-grid">
          <LocationDetails />
          <div className="location-map-art">
            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-road road-three" />
            <span className="map-sector">SECTOR 12</span>
            <div className="map-pin">
              <MapPin size={32} />
              <strong>CROSSFIT GYM</strong>
              <span>UTTARA · DHAKA</span>
            </div>
            <span className="map-disclaimer">
              Location illustration · open maps for directions
            </span>
            <ButtonLink href={site.directions} variant="dark">
              Open in Google Maps
            </ButtonLink>
          </div>
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
