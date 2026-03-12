import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { KnowledgeCenter } from "./components/KnowledgeCenter";
import { SkinToneTool } from "./components/SkinToneTool";
import { SunscreenGuide } from "./components/SunscreenGuide";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "knowledge", Component: KnowledgeCenter },
      { path: "skin-tone", Component: SkinToneTool },
      { path: "sunscreen", Component: SunscreenGuide },
      { path: "*", Component: NotFound },
    ],
  },
]);
