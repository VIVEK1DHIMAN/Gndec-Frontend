import React, { useEffect, useState } from "react";
import {
  IonLoading, IonRefresher, IonRefresherContent, useIonRouter, useIonToast
} from "@ionic/react";
import { useStoreActions, useStoreRehydrated, useStoreState } from 'easy-peasy';
import Axios from "axios";
import { API } from "../constants";
import { AttendanceList, EnrolledUsers, SportsList, UsersList, AnnouncementList, TeamEvent, DevTeam, ExcelExport, Analytics } from "../components/AdminDashboard";
import { ResultList } from "../components/AdminDashboard/ResultList";
import { PageLayout } from "./Page";
import { ProfileModal } from "../common";

export const AdminDashboard: React.FC<any> = ({ match = { url: "" } }) => {
  const page = match.params.page;

  const storeUserData = useStoreActions<any>((actions) => actions.storeUserData);
  const storeAllEvents = useStoreActions<any>((actions) => actions.storeAllEvents);
  const storeSports = useStoreActions<any>((actions) => actions.storeSports);
  const storeAnnouncement = useStoreActions<any>((actions) => actions.storeAnnouncement);
  const storeUsers = useStoreActions<any>((actions) => actions.storeUsers);
  const modalProfileId = useStoreState<any>(({ modalProfileId }) => modalProfileId);
  const logout = useStoreActions<any>((actions) => actions.logOut);
  const auth = useStoreState<any>(({ auth }) => auth);
  const [loading, setLoading] = useState(true);

  Axios.defaults.headers.common.Authorization = auth.token;

  const isRehydrated = useStoreRehydrated();
  const router = useIonRouter();
  const [showToast] = useIonToast();

  useEffect(() => {
    if (!auth.token) {
      logOut()
    }
    else {
      me()
    }
    if (!auth?.user?.isAdmin) {
      router.push("/dashboard")
    }
  }, [isRehydrated])

  useEffect(() => {
    fetchAll();
  }, [])

  const fetchAll = (callback = () => { }) => {
    Axios.get(API.ALL_USERS)
      .then(({ data }) => {
        storeUsers(data.users);
      })
      .catch(() => {
        showToast("Something went wrong", 3000)
      });
    Axios.get(API.GET_ENROLLMENTS)
      .then(({ data }) => {
        storeAllEvents(data.allEvents);
      })
      .catch(() => {
        showToast("Something went wrong", 3000)
      });
    Axios.get(API.GET_ANNOUNCEMENTS)
      .then((res) => storeAnnouncement(res.data.allAnnouncements))
      .catch(() => { });
    Axios.get(API.GET_SPORTS)
      .then(result => storeSports(result.data))
      .catch(() => { }).finally(() => callback());

  }

  const doRefresh = (e: CustomEvent<any>) => {
    fetchAll(() => e.detail.complete());
  }

  const logOut = () => {
    logout();
    router.push("/login", "none", "replace")
  }

  const me = () => {
    Axios.get(API.ME)
      .then(({ data }) => {
        storeUserData({ user: data.user });
      })
      .catch(() => {
        showToast("Something went wrong", 3000)
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <PageLayout>
      {modalProfileId && <ProfileModal />}
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <IonLoading
        isOpen={loading}
        message={'Hold on... Enjoy the wheater meanwhile!'}
      />
      {page === undefined && <UsersList />}
      {page === "analytics" && <Analytics />}
      {page === 'enrolled' && <EnrolledUsers />}
      {page === 'sports' && <SportsList />}
      {page === 'mark-attendance' && [1, 2, 3].includes(auth?.user?.adminLevel) && <AttendanceList />}
      {page === 'view-attendance' && <AttendanceList view />}
      {page === 'mark-result' && [1, 2, 3].includes(auth?.user?.adminLevel) && <ResultList />}
      {page === 'view-result' && <ResultList view />}
      {/* {page === 'promote-event' && <PromoteEvent />} */}
      {page === 'excel' && <ExcelExport />}
      {page === 'announcements' && <AnnouncementList />}
      {page === 'team' && <TeamEvent />}
      {page === 'dev-team' && <DevTeam />}
    </PageLayout>
  );
};
