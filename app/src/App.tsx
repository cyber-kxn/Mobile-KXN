import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/routes/Dashboard';
import { Paths } from '@/routes/Paths';
import { PathDetail } from '@/routes/PathDetail';
import { RoomView } from '@/routes/RoomView';
import { Roadmap } from '@/routes/Roadmap';
import { Leaderboard } from '@/routes/Leaderboard';
import { Profile } from '@/routes/Profile';
import { Login } from '@/routes/Login';
import { Onboarding } from '@/routes/Onboarding';
import { useAuth } from '@/store/useAuth';

export default function App() {
  const { user } = useAuth();

  if (!user) return <Login />;
  if (!user.onboarded) return <Onboarding />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/paths" element={<Paths />} />
        <Route path="/path/:slug" element={<PathDetail />} />
        <Route path="/room/:slug" element={<RoomView />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
