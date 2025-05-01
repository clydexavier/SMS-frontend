import { useStateContext } from "./context/ContextProvider";

import HomeLayout from "./components/layout/HomeLayout";
import GuestLayout from "./components/layout/GuestLayout";

//public pages
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";

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

//Within Intramural Pages
import IntramuralPage from "./pages/admin/IntramuralPage";

import EventPage from "./pages/admin/EventPage";
import BracketPage from "./pages/admin/BracketPage";
import GamePage from "./pages/admin/GamePage";
import ParticipantsPage from "./pages/admin/ParticipantsPage";

import ParticipantPage from "./pages/admin/ParticipantPage";
import PlayersPage from "./pages/admin/PlayersPage";
import GalleryPage from "./pages/admin/GalleryPage";

const routes = [
  {
    path: "/",
    element: <HomeLayout/>,
    children: [
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
          },
        ],
      },
      {
        path: ":intrams_id",
        element: (
          <ProtectedRoute roles = {["admin"]}>
            <IntramuralPage/>
          </ProtectedRoute>
        ),
        children: [
          { path: "venues", element: <VenuesPage /> },
          { path: "events", element: <EventsPage /> },
          { path: "teams", element: <TeamsPage /> },
          { path: "vplayers", element: <VarsityPlayersPage /> },
          { path: "documents", element: <DocumentsPage /> },
          { path: "logs", element: <IntramuralLogsPage /> },
          
          
          
        ],
      },
      {
        path: ":intrams_id/events/:event_id",
        element: (
          <ProtectedRoute roles = {["admin"]}>
            <EventPage/>
          </ProtectedRoute>
        ),
        children: [
          { path: "bracket", element: <BracketPage /> },
          { path: "games", element: <GamePage /> },
          { path: "players", element: <PlayersPage /> },
          { path: "gallery", element: <GalleryPage /> },

          { path: "logs", element: <VarsityPlayersPage /> },
        ],
      },
      {
        path: ":intrams_id/events/:event_id/participants/:participant_id",
        element: (
          <ProtectedRoute roles = {["admin"]}>
            <ParticipantPage/>
          </ProtectedRoute>
        ),
        children: [
          { path: "bracket", element: <BracketPage /> },
          { path: "games", element: <GamePage /> },
          { path: "players", element: <PlayersPage /> },
          { path: "logs", element: <VarsityPlayersPage /> },
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
    ],
  },
  {
    path: "/",
    element: <GuestLayout/>,
    children: [
      {
        path: "/login",
        element: <LoginPage/>
      },
      {
        path: "/register",
        element: <RegisterPage/>
      },
    ]
  },
  
];

export default routes;
