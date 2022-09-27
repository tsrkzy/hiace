import "firebase/compat/auth";
import Vue from "vue";
import Room from "@/components/views/Room";
import RoomCreate from "@/components/views/RoomCreate";
import TermsOfService from "@/components/views/TermsOfService";
import PrivacyPolicy from "@/components/views/PrivacyPolicy";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: RoomCreate,
    },
    {
      path: "/r/:room_id",
      component: Room,
    },
    {
      path: "/terms-of-service",
      component: TermsOfService,
    },
    {
      path: "/privacy-policy",
      component: PrivacyPolicy,
    },
  ],
});

export default router;
