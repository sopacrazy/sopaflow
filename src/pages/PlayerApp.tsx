import { useState, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { Home } from "./Home";
import { Favorites } from "./Favorites";
import { PlaylistView } from "./PlaylistView";
import { usePlayerStore } from "../store/usePlayerStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { Toaster } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const PlayerApp = () => {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const { setPlan, closePlayer } = usePlayerStore();
  const { loadFavorites } = useFavoritesStore();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadFavorites(user.id);
    }
  }, [user?.id, loadFavorites]);

  useEffect(() => {
    // Ensure player is completely closed when entering the app
    closePlayer();
  }, [closePlayer]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    
    // Set plan from user metadata if available
    if (user) {
       const userPlan = user.user_metadata?.plan || 'free';
       setPlan(userPlan);
    }
  }, [user, loading, navigate, setPlan]);

  if (loading) return null;

  return (
    <AppLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === "home" ? (
        <Home />
      ) : currentTab === "favorites" ? (
        <Favorites />
      ) : (
        <PlaylistView playlistId={currentTab} />
      )}
      <Toaster theme="dark" position="bottom-right" />
    </AppLayout>
  );
};
