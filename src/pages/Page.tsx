import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useStoreActions } from 'easy-peasy';
import { logOutOutline } from 'ionicons/icons';
import { useLocation } from 'react-router';
// import { RefresherEventDetail } from '@ionic/core';

const TOOLBAR_TITLE: any = {
  "/dashboard": "Dashboard",
  "/dashboard/profile": "Profile",
  "/dashboard/announcements": "Announcements",
  "/dashboard/dev-team": "Dev Team",

  '/admin/analytics': "Analytics",
  "/admin": "Admin Dashboard",
  "/admin/enrolled": "Enrolled Users",
  "/admin/mark-attendance": "Mark Attendance",
  "/admin/view-attendance": "View Attendance",
  "/admin/mark-result": "Mark Result",
  "/admin/view-result": "View Result",
  // "/admin/promote-event": "Promote Event",
  "/admin/excel": "Export",
  "/admin/sports": "Sports List",
  "/admin/announcements": "Announcements",
  "/admin/team": "Team Events",
  "/admin/dev-team": "Dev Team",
}

export const PageLayout: React.FC<any> = ({ children, className = "" }) => {
  const location = useLocation();
  const router = useIonRouter();
  const logout = useStoreActions<any>((actions) => actions.logOut);

  const pathname = location.pathname;
  const logOut = () => {
    logout();
    router.push("/login", "none", "replace")
  }
  return (
    <IonPage className={className}>
      <IonHeader hidden={pathname === "/login" || pathname === "/signup"}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton autoHide={true} />
          </IonButtons>
          <IonButtons slot="primary">
            <IonButton onClick={logOut} color="danger" fill="outline">
              Logout
              <IonIcon slot="end" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{TOOLBAR_TITLE[pathname]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {children}
      </IonContent>
    </IonPage>
  );
};
