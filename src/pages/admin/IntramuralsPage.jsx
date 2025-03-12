import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function IntramuralsPage() {
  return (
    <div>
      <h1>Intramurals Page</h1>
      <nav>
        <ul>
          <li><Link to="documents">Documents</Link></li>
          <li><Link to="events">Events</Link></li>
          <li><Link to="logs">Logs</Link></li>
          <li><Link to="teams">Teams</Link></li>
          <li><Link to="varsity_players">Varsity Players</Link></li>
          <li><Link to="venues">Venues</Link></li>
        </ul>
      </nav>
      <Outlet /> {/* ✅ This renders nested pages like "/admin/intramurals/venues" */}
    </div>
  );
}
