 // src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// Shell
import Login from "@/components/Login";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SettingsDrawer from "@/components/SettingsDrawer";
import QuoteModal from "@/components/QuoteModal";

// Pages (unchanged)
import Home from "@/pages/Home";
import Inbox from "@/pages/Inbox";
import Tasks from "@/pages/Tasks";
import MyTasks from "@/pages/MyTasks";
import Attendance from "@/pages/Attendance";
import LeadGen from "@/pages/LeadGen";
import ColdCalling from "@/pages/ColdCalling";
import ContentCalendar from "@/pages/content/ContentCalendar";
import Campaigns from "@/pages/Campaigns";
import Pipelines from "@/pages/Pipelines";
import MeetingsNotes from "@/pages/MeetingsNotes";
import People from "@/pages/People";
// NOTE: we intentionally DO NOT import the old Approvals page here
import CalendarPage from "@/pages/CalendarPage";
import Integrations from "@/pages/Integrations";

// Extra imports to implement all-access Approvals and Logout
import Guard from "@/components/Guard";
import Pills from "@/components/Pills";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

// New: Approvals page where everyone can add, edit, delete
function ApprovalsAllAccess() {
  return (
    <Guard area="Approvals">
      <div className="max-w-6xl mx-auto p-6">
        {/* canEdit=true gives CRUD to all roles, including interns */}
        <Pills tab="approvals" canEdit={true} />
      </div>
    </Guard>
  );
}

export default function App() {
  const session = useAuth((s) => s.session);
  const logout = useAuth((s) => s.logout);

  const [open, setOpen] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    if (session) {
      const key = `quoteSeen-${session.name}`;
      if (!localStorage.getItem(key)) {
        setShowQuote(true);
        localStorage.setItem(key, "1");
      }
    }
  }, [session]);

  if (!session) return <Login />;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header onOpenSettings={() => setOpen(true)} />

      {/* New: global Logout button (fixed, top-right) */}
      <button
        className="btn fixed top-3 right-4 z-50"
        onClick={logout}
        title="Logout"
      >
        Logout
      </button>

      <main className="ml-sidebar">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/todo" element={<MyTasks />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/lead" element={<LeadGen />} />
          <Route path="/cold" element={<ColdCalling />} />
          <Route path="/content" element={<ContentCalendar />} />
          <Route path="/pipelines" element={<Pipelines />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/meetings" element={<MeetingsNotes />} />
          <Route path="/people" element={<People />} />

          {/* New: route uses our all-access Approvals */}
          <Route path="/approvals" element={<ApprovalsAllAccess />} />

          <Route path="/integrations" element={<Integrations />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <SettingsDrawer open={open} onClose={() => setOpen(false)} />
      <QuoteModal open={showQuote} onClose={() => setShowQuote(false)} />
    </div>
  );
}
