import { ButtonLink } from "@/components/ui/button";
export default function NotFound() {
  return (
    <section className="error-page">
      <p className="eyebrow">A STEP OFF THE PATH</p>
      <h1>404</h1>
      <h2>LET’S GET YOU BACK.</h2>
      <p>That page isn’t here. Find your next step with Crossfit Gym.</p>
      <div className="button-row">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/programs" variant="outline">
          Explore programs
        </ButtonLink>
        <ButtonLink href="/contact" variant="text">
          Contact us
        </ButtonLink>
      </div>
    </section>
  );
}
