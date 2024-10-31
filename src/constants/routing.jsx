import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Import your pages/components
import AcknowledgedPage from '../pages/AcknowledgedPage';
import LoginPage from '../pages/LoginPage';
import RegisterInfo from '../pages/RegisterInfo';
import RegisterPage from '../pages/RegisterPage';
import VerifyEmail from '../pages/VerifyEmail';
import ForgetPage from '../pages/ForgetPage';
import ResetPage from '../pages/ResetPage';
import HomePage from '../pages/HomePage';
import CompleteProfilePage from '../pages/CompleteProfilePage';
import ActivityPage from '../pages/ActivityPage';
import SearchPage from '../pages/SearchPage';
import SingleConventionPage from '../pages/SingleConventionPage';
import AttendConventionPage from '../pages/AttendConventionPage';
import UserConventionPage from '../pages/UserConventionPage';
import UserUpcomingConventionPage from '../pages/UserUpcomingConventionPage';
import UserSingleUpcomingConventionPage from '../pages/UserSingleUpcomingConventionPage';
import AttendanceConventionPage from '../pages/AttendanceConventionPage';
import AgendaPage from '../pages/AgendaPage';
import ConventionAttendancePage from '../pages/ConventionAttendancePage';
import NextAgendaPage from '../pages/NextAgendaPage';
import FinalAgendaPage from '../pages/FinalAgendaPage';
import AccomodationPage from '../pages/AccomodationPage';
import CreateAccomodationPage from '../pages/CreateAccomodationPage';
import EditAccomodationPage from '../pages/EditAccomodationPage';
import EventPage from '../pages/EventPage';
import FindATablePage from '../pages/FindATablePage';
import CreateEventPage from '../pages/CreateEventPage';
import EditEventPage from '../pages/EditEventPage';
import EditGamePage from '../pages/EditGamePage';
import GamesPage from '../pages/GamesPage';
import CreateGamePage from '../pages/CreateGamePage';
import SingleGamePage from '../pages/SingleGamePage';
import FriendPage from '../pages/FriendPage';
import FindFriendPage from '../pages/FindFriendPage';
import NotificationPage from '../pages/NotificationPage';
import SalesPage from '../pages/SalesPage';
import FeedPage from '../pages/FeedPage';
import OwnFeedPage from '../pages/OwnFeedPage';
import ProfilePage from '../pages/ProfilePage';
import ViewProfilePage from '../pages/ViewProfilePage';
import MessagesPage from '../pages/MessagesPage';
import SettingsPage from '../pages/SettingsPage';
import StayingSafePage from '../pages/StayingSafePage';
import TermsPage from '../pages/TermsAndConditionsPage';
import CookiesPage from '../pages/CookiesPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import UserAnnouncementsPage from '../pages/UserAnnouncementsPage';
import SingleAnnouncementPage from '../pages/SingleAnnouncementPage';
import ContactUsPage from '../pages/ContactUsPage';
import FeedbackPage from '../pages/FeedbackPage';
// Admin

import AdminLoginPage from '../pages/Admin/LoginPage';
import DashboardPage from '../pages/Admin/DashboardPage';
import ConventionPage from '../pages/Admin/ConventionPage';
import CreateConventionPage from '../pages/Admin/CreateConventionPage';
import EditConventionPage from '../pages/Admin/EditConventionPage';
import AnnouncementPage from '../pages/Admin/AnnouncementPage';
import CreateAnnouncementPage from '../pages/Admin/CreateAnnouncementPage';
import EditAnnouncementPage from '../pages/Admin/EditAnnouncementPage';
import SponserPage from '../pages/Admin/SponserPage';
import CreateSponserPage from '../pages/Admin/CreateSponserPage';
import EditSponserPage from '../pages/Admin/EditSponserPage';

export const routing = [
  { id: 1, link: "/", element: <LoginPage />, public: true },
  { id: 2, link: "/register", element: <RegisterInfo />, public: true },
  { id: 3, link: "/register-form", element: <RegisterPage />, public: true },
  { id: 4, link: "/acknowledge", element: <AcknowledgedPage />, public: true },
  { id: 5, link: "/forget", element: <ForgetPage />, public: true },
  { id: 6, link: "/reset", element: <ResetPage />, public: true },
  { id: 7, link: "/verify-email/:id/:token", element: <VerifyEmail />, public: true },
  
  { id: 8, link: "/home", element: <HomePage />, protected: true },
  { id: 9, link: "/complete", element: <CompleteProfilePage />, protected: true },
  { id: 10, link: "/activity", element: <ActivityPage />, protected: true },
  { id: 11, link: "/search/:value/:type", element: <SearchPage />, protected: true },
  { id: 12, link: "/single/conv/:id", element: <SingleConventionPage />, protected: true },
  { id: 13, link: "/attend", element: <AttendConventionPage />, protected: true },
  { id: 14, link: "/user/convention", element: <UserConventionPage />, protected: true },
  { id: 14, link: "/upcoming-convention", element: <UserUpcomingConventionPage />, protected: true },
  { id: 14, link: "/single-upcoming-convention/:convention_id", element: <UserSingleUpcomingConventionPage />, protected: true },
  { id: 15, link: "/user/announcements", element: <UserAnnouncementsPage />, protected: true },
  { id: 16, link: "/convention/attendance/:convention_id", element: <AttendanceConventionPage />, protected: true },
  { id: 17, link: "/agenda/:convention_id", element: <AgendaPage />, protected: true },
  { id: 18, link: "/next/agenda/:convention_id", element: <NextAgendaPage />, protected: true },
  { id: 19, link: "/final/agenda", element: <FinalAgendaPage />, protected: true },
  { id: 20, link: "/accomodation/:convention_id", element: <AccomodationPage />, protected: true },
  { id: 21, link: "/new/accomodation/:convention_id", element: <CreateAccomodationPage />, protected: true },
  { id: 22, link: "/event/:convention_id", element: <EventPage />, protected: true },
  { id: 22, link: "/find_a_table", element: <FindATablePage />, protected: true },
  { id: 23, link: "/new/event/:convention_id", element: <CreateEventPage />, protected: true },
  { id: 24, link: "/game/sale/:convention_id?", element: <GamesPage />, protected: true },
  { id: 25, link: "/new/game/:convention_id", element: <CreateGamePage />, protected: true },
  { id: 26, link: "/game/single/:game_id", element: <SingleGamePage />, protected: true },
  { id: 27, link: "/friends", element: <FriendPage />, protected: true },
  { id: 28, link: "/findfriends", element: <FindFriendPage />, protected: true },
  { id: 29, link: "/notification", element: <NotificationPage />, protected: true },
  { id: 30, link: "/sales", element: <SalesPage />, protected: true },
  { id: 31, link: "/feed/:friendId?", element: <FeedPage />, protected: true },
  { id: 32, link: "/profile", element: <ProfilePage />, protected: true },
  { id: 33, link: "/ownFeed", element: <OwnFeedPage />, protected: true },
  { id: 34, link: "/messages/:receiver_id?", element: <MessagesPage />, protected: true },
  { id: 36, link: "/messages/:receiver_id/game/:game_id", element: <MessagesPage />, protected: true },
  { id: 35, link: "/settings", element: <SettingsPage />, protected: true },
  { id: 36, link: "/staying-safe", element: <StayingSafePage />, protected: true },
  { id: 37, link: "/terms", element: <TermsPage /> },
  { id: 38, link: "/cookies", element: <CookiesPage /> },
  { id: 39, link: "/privacy", element: <PrivacyPolicyPage /> },
  { id: 40, link: "/contactus", element: <ContactUsPage /> },
  { id: 41, link: "/feedback", element: <FeedbackPage />, protected: true },
  { id: 42, link: "/viewprofile/:user_id?", element: <ViewProfilePage />, protected: true },
  { id: 43, link: "/conventionAttendance/:convention_id", element: <ConventionAttendancePage />, protected: true },
  { id: 44, link: "/edit/accommodation/:accommodation_id/convention/:convention_id", element: <EditAccomodationPage />, protected: true },
  { id: 45, link: "/edit/event/:event_id/convention/:convention_id", element: <EditEventPage />, protected: true },
  { id: 46, link: "/edit/game/:game_id/convention/:convention_id", element: <EditGamePage />, protected: true },
  { id: 15, link: "/single/announcement/:announcement_id", element: <SingleAnnouncementPage />, protected: true },
  // Admin
  { id: 47, link: "/admin-login", element: <AdminLoginPage />, public: true },
  { id: 48, link: "/admin/dashboard", element: <DashboardPage />, protected: true },
  { id: 49, link: "/admin/conventions", element: <ConventionPage />, protected: true },
  { id: 49, link: "/admin/create/convention", element: <CreateConventionPage />, protected: true },
  { id: 49, link: "/admin/edit/convention/:convention_id", element: <EditConventionPage />, protected: true },
  { id: 49, link: "/admin/announcement", element: <AnnouncementPage />, protected: true },
  { id: 49, link: "/admin/create/announcement", element: <CreateAnnouncementPage />, protected: true },
  { id: 49, link: "/admin/edit/announcement/:announcement_id", element: <EditAnnouncementPage />, protected: true },
  { id: 49, link: "/admin/sponser", element: <SponserPage />, protected: true },
  { id: 49, link: "/admin/create/sponser", element: <CreateSponserPage />, protected: true },
  { id: 49, link: "/admin/edit/sponser/:sponser_id", element: <EditSponserPage />, protected: true },

];

const AppRoutes = () => (
  <Routes>
    {routing.map((route) =>
      route.protected ? (
        <Route
          key={route.id}
          path={route.link}
          element={<ProtectedRoute element={route.element} />}
        />
      ) : route.public ? (
        <Route
          key={route.id}
          path={route.link}
          element={<PublicRoute element={route.element} />}
        />
      ) : (
        <Route
          key={route.id}
          path={route.link}
          element={route.element}
        />
      )
    )}
  </Routes>
);

export default AppRoutes;
