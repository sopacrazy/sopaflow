/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AppLayout } from "./components/AppLayout";
import { Home } from "./pages/Home";
import { Favorites } from "./pages/Favorites";
import { PlaylistView } from "./pages/PlaylistView";
import { Toaster } from "sonner";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");

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
}


