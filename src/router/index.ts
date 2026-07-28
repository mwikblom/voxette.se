import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";

export enum RouteName {
  Home = "home",
  Calendar = "calendar",
  Conductor = "conductor",
  Contact = "contact",
  About = "about",
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
      meta: {
        title: "Hem",
      },
    },
    {
      path: "/gdpr",
      name: RouteName.GDPR,
      component: () => import("../views/GDPRView.vue"),
      meta: {
        title: "GDPR",
      },
    },
    {
      path: "/kalender",
      name: RouteName.Calendar,
      component: () => import("../views/CalendarView.vue"),
      meta: {
        title: "Kalender",
      },
    },
    {
      path: "/dirigent",
      name: RouteName.Conductor,
      component: () => import("../views/ConductorView.vue"),
      meta: {
        title: "Dirigent",
      },
    },
    {
      path: "/kontakt",
      name: RouteName.Contact,
      component: () => import("../views/ContactView.vue"),
      meta: {
        title: "Kontakt",
      },
    },
    {
      path: "/om",
      name: RouteName.About,
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: "Om föreningen",
      },
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
          meta: {
            title: "Intern kalender",
          },
        },
        {
          path: "ladda-ned/:fullPath",
          name: RouteName.DownloadFile,
          component: () => import("../views/DownloadFileView.vue"),
          props: true,
        },
        {
          path: "filer",
          name: RouteName.Files,
          component: () => import("../views/FilesView.vue"),
          meta: {
            title: "Filer",
          },
        },
        {
          path: "filer/:fullPath",
          name: RouteName.File,
          component: () => import("../views/FileView.vue"),
          props: true,
        },
        {
          path: "medlemmar",
          name: RouteName.Members,
          component: () => import("../views/MembersView.vue"),
          meta: {
            title: "Medlemmar",
          },
        },
        {
          path: "medlemmar/:id",
          name: RouteName.Member,
          component: () => import("../views/MemberView.vue"),
          props: true,
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

router.afterEach((to, from) => {
  nextTick(() => {
    let title = "Voxette";
    if (to.meta.title) {
      title = `${to.meta.title} - ${title}`;
    }

    document.title = title;
  });
});

export default router;
