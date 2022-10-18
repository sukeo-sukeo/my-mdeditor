import { createRouter, createWebHistory } from "vue-router";
import Editor from "./components/views/MdEditor.vue";
import Draft from "./components/views/DraftManager.vue";
import Media from "./components/views/MediaLiblary.vue";
import Category from "./components/views/CategoryManager.vue";
import Tags from "./components/views/TagsManager.vue";

import { appConfig } from "./config/app.config";

const routes = [
  {
    path: "/",
    name: "Editor",
    component: Editor,
  },
  {
    path: "/draft",
    name: "Draft",
    component: Draft,
  },
  {
    path: "/media",
    name: "Media",
    component: Media,
  },
  {
    path: "/category",
    name: "Category",
    component: Category,
  },
  {
    path: "/tags",
    name: "Tags",
    component: Tags,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
