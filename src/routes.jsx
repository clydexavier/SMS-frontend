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
import SecretariatPage from "./pages/secretariat/intramurals/parent/SecretariatPage";
import TSecretaryPage from "./pages/TSecretary/TSecretaryPage";

// Admin child components
import IntramuralsPage from "./pages/admin/intramurals/IntramuralsPage";
import UsersPage from "./pages/admin/users/UsersPage";
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


//Tournament Secretary Pages
import TSGamesPage from "./pages/TSecretary/games/TSGamesPage";
import TSBracketPage from "./pages/TSecretary/bracket/TSBracketPage";
import TSResultPage from "./pages/TSecretary/result/TSResultPage";
import TSPodiumsPage from "./pages/TSecretary/podiums/TSPodiumsPage";
import TSOverallTallyPage from "./pages/TSecretary/tally/TSOverallTallyPage";

//GAM Pages
import GAMEventsPage from "./pages/GAM/events/GAMEventsPage";
import GAMGalleryPage from "./pages/GAM/gallery/GAMGalleryPage";
import GAMOverallTallyPage from "./pages/GAM/tally/GAMOverallTallyPage";
import GAMPlayersPage from "./pages/GAM/players/GAMPlayersPage";
import GAMPodiumsPage from "./pages/GAM/podiums/GAMPodiumsPage";
import GAMEventPage from "./pages/GAM/events/parent/GAMEventPage";

//Secretariat Pages
import SecIntramuralsPage from "./pages/secretariat/intramurals/SecIntramuralsPage";
import SecIntramuralPage from "./pages/secretariat/events/parent/SecIntramuralPage";
import SecEventsPage from "./pages/secretariat/events/SecEventsPage";
import SecEventPage from "./pages/secretariat/SecEventPage";
import SecBracketPage from "./pages/secretariat/bracket/SecBracketPage";
import SecGamePage from "./pages/secretariat/games/SecGamePage";
import SecResultPage from "./pages/secretariat/result/SecResultPage";
import SecPodiumsPage from "./pages/secretariat/podiums/SecPodiumsPage";
import SecOverallTallyPage from "./pages/secretariat/tally/SecOverallTallyPage";

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
        
        { index: true, element: <Navigate to="intramurals" replace /> },
        { path: "intramurals", element: <IntramuralsPage /> },
        { path: "users", element: <UsersPage/>}
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
        children: [
          { index: true, element: <Navigate to="bracket" replace /> },
          { path: "bracket", element: <TSBracketPage/>},
          { path: "result", element: <TSResultPage /> },
          { path: "podiums", element: <TSPodiumsPage /> },
          { path: "tally", element: <TSOverallTallyPage /> },
          {path: "games", element: <TSGamesPage/>},
        ],
      },
      {
        path: "/GAM",
        element: (
          <ProtectedRoute roles={["GAM"]}>
            <GAMPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="events" replace /> },
          { path: "events", element: <GAMEventsPage /> },
          { path: "podiums", element: <GAMPodiumsPage/> },
          { path: "tally", element: <GAMOverallTallyPage/> },
        ],
      },
      {
        path: "GAM/events/:event_id",
        element: (
          <ProtectedRoute roles={["GAM"]}>
            <GAMEventPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="players" replace /> },
          { path: "players", element: <GAMPlayersPage /> },
          { path: "gallery", element: <GAMGalleryPage /> },
        ],
      },
      {
        path: "/secretariat",
        element: (
          <ProtectedRoute roles={["secretariat"]}>
            <SecretariatPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="intramurals" replace /> },
          { path: "intramurals", element: <SecIntramuralsPage /> },
        ],
      },
      {
        path:"/secretariat/:intrams_id",
        element: (
          <ProtectedRoute roles={["secretariat"]}>
            <SecIntramuralPage/>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="events" replace /> },
          { path: "events", element: <SecEventsPage /> },
          { path: "podiums", element: <SecPodiumsPage/>},
          { path: "tally", element: <SecOverallTallyPage/>},
        ],
      },
      
      {
        path:"/secretariat/:intrams_id/events/:event_id",
        element: (
          <ProtectedRoute roles={["secretariat"]}>
            <SecEventPage/>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="bracket" replace /> },
          { path: "bracket", element: <SecBracketPage /> },
          { path: "games", element: <SecGamePage/>},
          { path: "result", element: <SecResultPage/>},
        ],
      }
      
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