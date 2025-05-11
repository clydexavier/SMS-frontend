// src/routes.jsx;
import { Navigate } from "react-router-dom";

import HomeLayout from "./pages/layout/HomeLayout";
import GuestLayout from "./pages/layout/GuestLayout";

// Auth Components
import ProtectedRoute from "./auth/ProtectedRoute";
import UnauthorizedPage from "./pages/public/UnauthorizedPage";

// Public pages
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";

// Role-specific pages
import AdminPage from "./pages/admin/intramurals/parent/AdminPage";
import GAMPage from "./pages/GAM/GAMPage";
import SecretariatPage from "./pages/Secretariat/SecretariatPage";
import TSecretaryPage from "./pages/TSecretary/TSecretaryPage";

// Admin child components
import IntramuralsPage from "./pages/admin/intramurals/IntramuralsPage";
import EventsPage from "./pages/admin/events/EventsPage";
import TeamsPage from "./pages/admin/teams/TeamsPage";
import VarsityPlayersPage from "./pages/admin/varsity_players/VarsityPlayersPage";


// Within Intramural Pages
import IntramuralPage from "./pages/admin/events/parent/IntramuralPage";
import EventPage from "./pages/admin/EventPage";
import BracketPage from "./pages/admin/bracket/BracketPage";
import GamePage from "./pages/admin/games/GamePage";
import PodiumsPage from "./pages/admin/podiums/PodiumsPage";
import OverallTallyPage from "./pages/admin/tally/OverallTallyPage";
import PlayersPage from "./pages/admin/players/PlayersPage";
import GalleryPage from "./pages/admin/gallery/GalleryPage";
import ResultPage from "./pages/admin/result/ResultPage";
import TeamSeeder from "./pages/admin/seeder/TeamSeeder";

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
        
        { path: "intramurals", element: <IntramuralsPage /> },
      ],
      },
      {
        path: "admin/:intrams_id",
        element: (
          <ProtectedRoute roles = {["admin"]}>
            <IntramuralPage/>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="events" replace /> },
          { path: "events", element: <EventsPage /> },
          { path: "teams", element: <TeamsPage /> },
          { path: "vplayers", element: <VarsityPlayersPage /> },
          {path: "podiums", element: <PodiumsPage/>},
          { path: "tally", element: <OverallTallyPage /> },

          
        ],
      },
      {
        path: "admin/:intrams_id/events/:event_id",
        element: (
          <ProtectedRoute roles = {["admin"]}>
            <EventPage/>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="players" replace /> },
          {path: "seeder", element: <TeamSeeder/>},
          { path: "bracket", element: <BracketPage /> },
          { path: "games", element: <GamePage /> },
          { path: "players", element: <PlayersPage /> },
          { path: "gallery", element: <GalleryPage /> },
          { path: "result", element: <ResultPage /> },
          { path: "logs", element: <VarsityPlayersPage /> },
        ],
      },
      {
        path: "/tsecretary",
        element: (
          <ProtectedRoute roles={["tsecretary"]}>
            <TSecretaryPage />
          </ProtectedRoute>
        ),
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