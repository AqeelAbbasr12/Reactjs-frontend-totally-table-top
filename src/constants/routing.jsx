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
import AttendanceConventionPage from '../pages/AttendanceConventionPage';
import AgendaPage from '../pages/AgendaPage';
import NextAgendaPage from '../pages/NextAgendaPage';
import FinalAgendaPage from '../pages/FinalAgendaPage';
import AccomodationPage from '../pages/AccomodationPage';
import CreateAccomodationPage from '../pages/CreateAccomodationPage';
import EventPage from '../pages/EventPage';
import CreateEventPage from '../pages/CreateEventPage';
import GamesPage from '../pages/GamesPage';
import CreateGamePage from '../pages/CreateGamePage';
import SingleGamePage from '../pages/SingleGamePage';
import FriendPage from '../pages/FriendPage';
import FindFriendPage from '../pages/FindFriendPage';
import NotificationPage from '../pages/NotificationPage';
import SalesPage from '../pages/SalesPage';
import FeedPage from '../pages/FeedPage';
import ProfilePage from '../pages/ProfilePage';
import MessagesPage from '../pages/MessagesPage';
import SettingsPage from '../pages/SettingsPage';
import StayingSafePage from '../pages/StayingSafePage';
import TermsPage from '../pages/TermsAndConditionsPage';
import CookiesPage from '../pages/CookiesPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import UserAnnouncementsPage from '../pages/UserAnnouncementsPage';
import ContactUsPage from '../pages/ContactUsPage';
import FeedbackPage from '../pages/FeedbackPage';

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
  { id: 15, link: "/user/announcements", element: <UserAnnouncementsPage />, protected: true },
  { id: 16, link: "/convention/attendance", element: <AttendanceConventionPage />, protected: true },
  { id: 17, link: "/agenda", element: <AgendaPage />, protected: true },
  { id: 18, link: "/next/agenda", element: <NextAgendaPage />, protected: true },
  { id: 19, link: "/final/agenda", element: <FinalAgendaPage />, protected: true },
  { id: 20, link: "/accomodation", element: <AccomodationPage />, protected: true },
  { id: 21, link: "/new/accomodation", element: <CreateAccomodationPage />, protected: true },
  { id: 22, link: "/event", element: <EventPage />, protected: true },
  { id: 23, link: "/new/event", element: <CreateEventPage />, protected: true },
  { id: 24, link: "/game/sale", element: <GamesPage />, protected: true },
  { id: 25, link: "/new/game", element: <CreateGamePage />, protected: true },
  { id: 26, link: "/game/single", element: <SingleGamePage />, protected: true },
  { id: 27, link: "/friends", element: <FriendPage />, protected: true },
  { id: 28, link: "/findfriends", element: <FindFriendPage />, protected: true },
  { id: 29, link: "/notification", element: <NotificationPage />, protected: true },
  { id: 30, link: "/sales", element: <SalesPage />, protected: true },
  { id: 31, link: "/feed/:friendId?", element: <FeedPage />, protected: true },
  { id: 32, link: "/profile", element: <ProfilePage />, protected: true },
  { id: 33, link: "/ownFeed", element: <FeedPage />, protected: true },
  { id: 34, link: "/messages/:receiver_id?", element: <MessagesPage />, protected: true },
  { id: 35, link: "/settings", element: <SettingsPage />, protected: true },
  { id: 36, link: "/staying-safe", element: <StayingSafePage />, protected: true },
  { id: 37, link: "/terms", element: <TermsPage /> },
  { id: 38, link: "/cookies", element: <CookiesPage /> },
  { id: 39, link: "/privacy", element: <PrivacyPolicyPage /> },
  { id: 40, link: "/contactus", element: <ContactUsPage /> },
  { id: 41, link: "/feedback", element: <FeedbackPage />, protected: true },
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
