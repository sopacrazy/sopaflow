/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AppLayout } from "./components/AppLayout";
import { Home } from "./pages/Home";
import { Favorites } from "./pages/Favorites";
import { Toaster } from "sonner";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"home" | "favorites">("home");

  return (
    <AppLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === "home" ? <Home /> : <Favorites />}
      <Toaster theme="dark" position="bottom-right" />
    </AppLayout>
  );
}


