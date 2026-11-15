"use client";
import { useState } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { ClassSession } from "@/schemas/content";
import { days } from "@/content/schedule";
import { useQueryState } from "@/hooks/use-query-state";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ButtonLink } from "@/components/ui/button";
import { PendingContent } from "@/components/shared/sections";
export function ScheduleExplorer({ sessions }: { sessions: ClassSession[] }) {
  const { params, update } = useQueryState();
  const day = params.get("day") || "All";
  const program = params.get("program") || "All";
  const coach = params.get("coach") || "All";
  const [selected, setSelected] = useState<ClassSession | null>(null);
  const filtered = sessions.filter(
    (item) =>
      (day === "All" || item.day === day) &&
      (program === "All" || item.programId === program) &&
      (coach === "All" || item.coachId === coach),
  );
  return (
    <>
      <div className="schedule-controls">
        <label className="field">
          Program
          <select
            value={program}
            onChange={(e) => update({ program: e.target.value })}
          >
            <option>All</option>
            {[...new Set(sessions.map((s) => s.programId))].map((id) => (
              <option key={id}>{id}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Coach
          <select
            value={coach}
            onChange={(e) => update({ coach: e.target.value })}
          >
            <option>All</option>
            {[...new Set(sessions.map((s) => s.coachId))].map((id) => (
              <option key={id}>{id}</option>
            ))}
          </select>
        </label>
        <span className="small-note">
          <Clock3 size={15} /> All times: Dhaka (UTC+6)
        </span>
      </div>
      <div className="filter-pills day-pills">
        {["All", ...days].map((value) => (
          <button
            key={value}
            aria-pressed={value === day}
            className={value === day ? "selected" : ""}
            onClick={() => update({ day: value })}
          >
            {value === "All" ? "Full week" : value}
          </button>
        ))}
      </div>
      {sessions.length === 0 ? (
        <PendingContent
          title="Let’s plan your visit."
          description="The approved weekly timetable has not been supplied. Call the gym for current class times and availability."
        />
      ) : filtered.length === 0 ? (
        <div className="no-results">
          <h3>No matching classes.</h3>
          <button
            className="button button-dark"
            onClick={() => update({ day: "", program: "", coach: "" })}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <p className="result-count" aria-live="polite">
            {filtered.length} classes
          </p>
          <div className="schedule-table">
            {days
              .filter((value) => day === "All" || day === value)
              .map((value) => (
                <div className="schedule-day" key={value}>
                  <h3>{value}</h3>
                  {filtered
                    .filter((session) => session.day === value)
                    .map((session) => (
                      <button
                        key={session.id}
                        onClick={() => setSelected(session)}
                      >
                        <time>{session.time}</time>
                        <strong>{session.name}</strong>
                        <small>
                          {session.duration} min · {session.coachId}
                        </small>
                        <ArrowUpRight size={16} />
                      </button>
                    ))}
                  {filtered.filter((session) => session.day === value)
                    .length === 0 && <p>No matching sessions</p>}
                </div>
              ))}
          </div>
        </>
      )}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <p className="eyebrow">CLASS INFORMATION</p>
          <DialogTitle>{selected?.name}</DialogTitle>
          <DialogDescription>{selected?.description}</DialogDescription>
          <p>
            {selected?.day} · {selected?.time} · {selected?.duration} minutes
          </p>
          <p>
            Coach: {selected?.coachId} · Location: {selected?.locationId}
          </p>
          <ButtonLink
            href={`/contact?topic=Training&interest=${encodeURIComponent(selected?.name || "")}`}
          >
            Ask about this class
          </ButtonLink>
        </DialogContent>
      </Dialog>
    </>
  );
}
