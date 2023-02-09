/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { action, createStore, persist } from "easy-peasy";
import { original } from "immer";
import { uniqBy } from "lodash";

const store = createStore(
  persist(
    {
      // Initial State
      auth: {
        user: { isVerified: false },
        token: "",
      },
      users: [],
      userEvents: [],
      allEvents: [],
      sports: [],
      modalProfileId: "",
      announcements: [],

      // Auth actions
      storeUserData: action((state, payload) => {
        state.auth = { ...state.auth, ...payload };
      }),

      logOut: action((state) => {
        state.auth = {
          user: { isVerified: false },
          token: "",
        };
        state.users = [];
        state.userEvents = [];
        state.allEvents = [];
      }),

      // Events actions
      storeUserEvents: action((state, payload) => {
        state.userEvents = payload;
      }),

      // Announcement actions
      storeAnnouncement: action((state, payload) => {
        state.announcements = payload;
      }),

      // Sports actions
      storeSports: action((state, payload) => {
        state.sports = payload;
      }),

      // Users actions
      storeUsers: action((state, payload) => {
        state.users = payload;
      }), // Users actions

      storeAllEvents: action((state, payload) => {
        state.allEvents = payload;
      }),

      appendAllEvents: action((state, payload) => {
        state.allEvents = uniqBy([...state.allEvents, ...payload], (event) => event._id);
      }),

      deleteEventbyId: action((state, payload) => {
        state.allEvents = state.allEvents.filter(
          (event) => event._id !== payload
        );
      }),

      updateModalProfileId: action((state, payload) => {
        state.modalProfileId = payload;
      }),

      // updateApplication: action((state, payload) => {
      //   const applicationsList = original(state.applications);
      //   const appIndex = applicationsList.findIndex(
      //     (application) => application._id === payload.data._id,
      //   );
      //   applicationsList[appIndex] = payload.data;
      //   state.applications = applicationsList;
      // }),
    },
    {
      deny: [], // Use this to prevent persist for listed varibales
      storage: localStorage,
    }
  )
);

export default store;
