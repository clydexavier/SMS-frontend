import AdminPage from "./pages/admin/AdminPage";
import GAMPage from "./pages/GAM/GAMPage";
import SecretariatPage from "./pages/Secretariat/SecretariatPage";
import TSecretaryPage from "./pages/TSecretary/TSecretaryPage";
import ProtectedRoute from "./context/ProtectedRoute";

// Admin child components
import AdminLogsPage from "./pages/admin/AdminLogsPage";
import IntramuralsPage from "./pages/admin/IntramuralsPage";
import DocumentsPage from "./pages/admin/DocumentsPage";
import EventsPage from "./pages/admin/EventsPage";
import TeamsPage from "./pages/admin/TeamsPage";
import VenuesPage from "./pages/admin/VenuesPage";
import IntramuralLogsPage from "./pages/admin/IntramuralLogsPage";
import VarsityPlayersPage from "./pages/admin/VarsityPlayersPage";

const routes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminPage />
      </ProtectedRoute>
    ),
    children: [
      { path: "logs", element: <AdminLogsPage /> },
      {
        path: "intramurals",
        element: <IntramuralsPage />,
        children: [
          { path: "documents", element: <DocumentsPage /> },
          { path: "events", element: <EventsPage /> },
          { path: "logs", element: <IntramuralLogsPage /> },
          { path: "teams", element: <TeamsPage /> },
          { path: "varsity_players", element: <VarsityPlayersPage /> },
          { path: "venues", element: <VenuesPage /> },
        ],
      },
    ],
  },
  {
    path: "/GAM",
    element: (
      <ProtectedRoute roles={["GAM"]}>
        <GAMPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/secretariat",
    element: (
      <ProtectedRoute roles={["secretariat"]}>
        <SecretariatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tsecretary",
    element: (
      <ProtectedRoute roles={["tsecretary"]}>
        <TSecretaryPage />
      </ProtectedRoute>
    ),
  },
];

export default routes;
