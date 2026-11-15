import {
  InquiryCTA,
  PageHero,
  SectionHeading,
} from "@/components/shared/sections";
import { ScheduleExplorer } from "@/features/schedule/schedule-explorer";
import { classes } from "@/content/schedule";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Class schedule",
  "Find class information and contact Crossfit Gym for its current weekly schedule. All times are local to Dhaka.",
  "/schedule",
);
export default function SchedulePage() {
  return (
    <>
      <PageHero
        eyebrow="MAKE TIME FOR YOURSELF"
        title={"YOUR WEEK.\nYOUR NEXT STEP."}
        description="Explore the weekly timetable. All class times are displayed in Dhaka local time."
      />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="CLASS SCHEDULE" title="PLAN YOUR WEEK." />
          <ScheduleExplorer sessions={classes} />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
