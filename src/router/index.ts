import { createRouter, createWebHistory } from "vue-router";

export enum RouteName {
  Home = "home",
  Calendar = "calendar",
  Conductor = "conductor",
  Contact = "contact",
  DownloadFile = "download-file",
  Files = "files",
  File = "file",
  InternalCalendar = "internal-calendar",
  LoggedIn = "logged-in",
  Members = "members",
  Member = "member",
  NotFound = "not-found",
  GDPR = "gdpr",
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (to.hash) {
          resolve({ el: to.hash });
          return;
        }

        if (savedPosition) {
          resolve(savedPosition);
          return;
        }

        resolve({ top: 0 });
      }, 200);
    });
  },
  routes: [
    {
      path: "/",
      name: RouteName.Home,
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/gdpr",
      name: RouteName.GDPR,
      component: () => import("../views/GDPRView.vue"),
    },
    {
      path: "/kalender",
      name: RouteName.Calendar,
      component: () => import("../views/CalendarView.vue"),
    },
    {
      path: "/dirigent",
      name: RouteName.Conductor,
      component: () => import("../views/ConductorView.vue"),
    },
    {
      path: "/kontakt",
      name: RouteName.Contact,
      component: () => import("../views/ContactView.vue"),
    },
    {
      path: "/inloggad",
      name: RouteName.LoggedIn,
      component: () => import("../views/LoggedInView.vue"),
      children: [
        {
          path: "kalender",
          name: RouteName.InternalCalendar,
          component: () => import("../views/InternalCalendarView.vue"),
        },
        {
          path: "ladda-ned",
          name: RouteName.DownloadFile,
          component: () => import("../views/DownloadFileView.vue"),
        },
        {
          path: "filer",
          name: RouteName.Files,
          component: () => import("../views/FilesView.vue"),
        },
        {
          path: "fil",
          name: RouteName.File,
          component: () => import("../views/FileView.vue"),
        },
        {
          path: "medlemmar",
          name: RouteName.Members,
          component: () => import("../views/MembersView.vue"),
        },
        {
          path: "medlemmar/:id",
          name: RouteName.Member,
          component: () => import("../views/MemberView.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: RouteName.NotFound,
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
