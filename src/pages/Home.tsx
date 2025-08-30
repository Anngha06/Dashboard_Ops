 // src/pages/Home.tsx
import Guard from "@/components/Guard";
import { api } from "@/lib/api";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type T = {
  id?: string | number;
  status?: string;
  due_date?: string;
  created_at?: string;   // we’ll stamp this in Kanban
  completed_at?: string; // we’ll stamp this in Kanban
  _ts?: string;          // fallback timestamp
};

export default function Home() {
  const [completed, setCompleted] = useState(0);
  const [slaHit, setSlaHit] = useState(0);
  const [avgCycle, setAvgCycle] = useState<string>("—");

  useEffect(() => {
    (async () => {
      const res = await api.list("tasks");
      const rows: T[] = res.rows || [];

      const now = dayjs();
      const last7 = now.subtract(7, "day").startOf("day");
      const last30 = now.subtract(30, "day").startOf("day");

      // helper time getters with fallbacks
      const getDoneAt = (t: T) =>
        t.completed_at ? dayjs(t.completed_at) : t._ts ? dayjs(t._ts) : null;
      const getCreatedAt = (t: T) =>
        t.created_at ? dayjs(t.created_at) : null;

      // --- Completed in last 7 days
      const doneLast7 = rows.filter(
        (t) => t.status === "Done" && getDoneAt(t) && getDoneAt(t)!.isAfter(last7)
      );
      setCompleted(doneLast7.length);

      // --- SLA hit % (finished on/before due date)
      const slaHits = doneLast7.filter((t) => {
        if (!t.due_date) return false;
        const doneAt = getDoneAt(t);
        if (!doneAt) return false;
        return doneAt.isSame(dayjs(t.due_date).endOf("day")) || doneAt.isBefore(dayjs(t.due_date).endOf("day"));
      }).length;
      setSlaHit(doneLast7.length ? Math.round((slaHits / doneLast7.length) * 100) : 0);

      // --- Avg cycle time over last 30 days (Done tasks)
      const doneLast30 = rows.filter(
        (t) => t.status === "Done" && getDoneAt(t) && getDoneAt(t)!.isAfter(last30)
      );
      const deltas = doneLast30
        .map((t) => {
          const c = getCreatedAt(t);
          const d = getDoneAt(t);
          if (!c || !d) return null;
          return d.diff(c, "minute");
        })
        .filter((m): m is number => m !== null);

      if (!deltas.length) {
        setAvgCycle("—");
      } else {
        const avgMin = Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length);
        // pretty format
        if (avgMin < 60) setAvgCycle(`${avgMin}m`);
        else if (avgMin < 60 * 24) setAvgCycle(`${(avgMin / 60).toFixed(1)}h`);
        else setAvgCycle(`${(avgMin / 1440).toFixed(1)}d`);
      }
    })();
  }, []);

  return (
    <Guard area="Home">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <div className="title">Home</div>
          <div className="kicker">My Day, quick log, KPIs</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-sm font-semibold mb-2">My Day</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div>Overdue</div><div className="badge">0</div>
              </div>
              <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div>Due today</div><div className="badge">0</div>
              </div>
              <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div>Next 7 days</div><div className="badge">0</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-semibold mb-2">Quick log</div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="One-line update" />
              <button className="btn btn-primary">Log</button>
            </div>
            <div className="subtitle mt-2">Auto-timestamped in IST.</div>
          </div>

          <div className="card">
            <div className="text-sm font-semibold mb-2">KPIs (snapshot)</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div>Completed</div><div className="badge">{completed}</div>
              </div>
              <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div>SLA hit %</div><div className="badge">{slaHit}%</div>
              </div>
              <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div>Avg cycle time</div><div className="badge">{avgCycle}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Guard>
  );
}
