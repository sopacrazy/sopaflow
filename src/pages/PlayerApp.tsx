import { useState, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { Home } from "./Home";
import { Favorites } from "./Favorites";
import { PlaylistView } from "./PlaylistView";
import { Toaster } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const PlayerApp = () => {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

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
