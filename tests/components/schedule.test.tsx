import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ScheduleExplorer } from "@/features/schedule/schedule-explorer";
it("filters class days and shows an honest empty selection", () => {
  render(
    <ScheduleExplorer
      sessions={[
        {
          id: "test",
          name: "Test fixture class",
          day: "Monday",
          time: "09:00",
          duration: 60,
          programId: "fixture-program",
          coachId: "fixture-coach",
          locationId: "uttara",
          description: "Only used in automated tests",
        },
      ]}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Tuesday" }));
  expect(screen.getByText("No matching classes.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
  expect(
    screen.getByRole("button", { name: /Test fixture class/ }),
  ).toBeInTheDocument();
});
