/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  IonItem,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  IonCol,
  IonCard,
  IonRippleEffect,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonFooter,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonTextarea,
  useIonAlert,
  useIonToast,
  IonInput,
  IonLabel,
  IonLoading,
} from "@ionic/react";
import { API } from "../../constants";
import { add, closeCircle } from "ionicons/icons";
import { useStoreActions, useStoreState } from "easy-peasy";

export const AnnouncementList: React.FC<any> = ({ isPublic }) => {
  const modalRef = useRef<any>();
  const [showAlert] = useIonAlert();
  const [showToast] = useIonToast();

  const storeAnnouncement = useStoreActions<any>((actions) => actions.storeAnnouncement);
  const announcements = useStoreState<any>(({ announcements }) => announcements);
  const auth = useStoreState<any>(({ auth }) => auth);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementText, setAnnouncementText] = useState("");

  const createAnnouncement = () => {
    setLoading(true);
    axios.post(`${API.CREATE_ANNOUNCEMENTS}`, {
      announcementText, announcementTitle
    }).then(({ data }) => {
      storeAnnouncement([...announcements, data.announcement]);
      setIsOpen(false);
      fetchAnnouncements();
      showToast("Announcement Added", 3000);
    }).catch(() => {
      showToast("Something went wrong!", 3000);
    }).finally(() => {
      setLoading(false);
    });
  };

  // const updateAnnouncement = async (announcement: any) => {
  //   const response = await Axios.put(
  //     `${API.UPDATE_ANNOUNCEMENTS}`,
  //     announcement
  //   );
  //   console.log(response);
  //   setAnnouncements(response.data);
  // };

  const hideAnnouncement = (announcementId: any) => {
    axios.put(
      `${API.DELETE_ANNOUNCEMENTS}`,
      { announcementId }
    ).then(({ data }) => {
      storeAnnouncement(announcements.filter((ann: any) => {
        return ann._id !== data.updatedAnnouncement._id
      }));
      showToast("Announcement Deleted", 3000);
    }).catch(() => {
      showToast("Something went wrong!", 3000);
    });
  };

  const handleDelete = (announcementId: { _id: any }) => {
    showAlert("Remove Announcement?", [
      { text: "Yes", handler: () => hideAnnouncement(announcementId) },
      { text: "No" },
    ]);
  };

  const fetchAnnouncements = async () => {
    axios.get(API.GET_ANNOUNCEMENTS).then((res) => {
      storeAnnouncement(res.data.allAnnouncements);
      console.log(res.data);
    });
  };

  return (
    <>
      <IonLoading
        isOpen={loading}
        message={'Hold on... Enjoy the wheater meanwhile!'}
      />
      {!isPublic && [1].includes(auth?.user?.adminLevel) && (
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setIsOpen(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      )}
      <IonGrid>
        <IonRow>
          <IonCol>
            {announcements.sort((a: any, b: any) => (Number(new Date(b.addedAt)) - Number(new Date(a.addedAt)))).map((announcement: any) => (
              <IonCard className="ion-activatable ripple-parent" key={announcement._id}>
                <IonRippleEffect />
                <IonCardHeader>
                  <IonItem color="transparent" lines="none">
                    <IonCardTitle>{announcement.announcementTitle}</IonCardTitle>
                    {!isPublic && [1].includes(auth?.user?.adminLevel) && (
                      <>
                        <IonIcon
                          slot="end"
                          color="danger"
                          icon={closeCircle}
                          onClick={() => handleDelete(announcement._id)}
                        />
                      </>
                    )}
                  </IonItem>
                  <IonItem color="transparent" lines="none">
                    <IonLabel>{moment(announcement.addedAt).format("MMMM Do YYYY, h:mm a")}</IonLabel>
                  </IonItem>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>{announcement.announcementText}</IonText>
                </IonCardContent>
              </IonCard>
            ))}
          </IonCol>
        </IonRow>
      </IonGrid>
      {!isPublic && (
        <IonModal
          ref={modalRef}
          isOpen={isOpen}
          onDidDismiss={() => setIsOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createAnnouncement();
            }}
          >
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="end">
                  <IonButton onClick={() => modalRef.current.dismiss()}>
                    <IonIcon slot="icon-only" icon={closeCircle} />
                  </IonButton>
                </IonButtons>
                <IonTitle>Announcement</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position='floating'>Announcement Title</IonLabel>
                    <IonInput
                      placeholder="Announcement title..."
                      value={announcementTitle}
                      onIonChange={(e) => setAnnouncementTitle(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position='floating'>Announcement Details</IonLabel>
                    <IonTextarea
                      rows={15}
                      placeholder="Add announcement details..."
                      value={announcementText}
                      onIonChange={(e) => setAnnouncementText(e.detail.value!)}
                    ></IonTextarea>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonFooter>
              <IonButton type="submit" expand="block">Save Announcement</IonButton>
            </IonFooter>
          </form>
        </IonModal>
      )}
    </>
  );
};
