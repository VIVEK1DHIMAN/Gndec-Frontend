import React, { useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonInput,
  useIonToast,
  IonGrid,
  IonRow,
  useIonAlert,
  IonSelect,
  IonSelectOption,
  IonCardHeader,
} from "@ionic/react";
import { pencil, checkmarkSharp } from "ionicons/icons";
import QRCode from "react-qr-code";
import { mapValue, API } from "../constants";
import { closeCircle } from "ionicons/icons";
import { useStoreActions, useStoreState } from "easy-peasy";
import { EnrolledItem } from ".";
import Axios from "axios";

export const ProfileModal: React.FC<any> = () => {
  const modalRef = useRef<any>();
  const [showAlert] = useIonAlert();
  const [isUpdating, setIsUpdating] = useState<any>(false);
  const updateModalProfileId = useStoreActions<any>((actions) => actions.updateModalProfileId);
  const [showToast] = useIonToast();

  const [filterSport, setFilterSport] = useState('none');

  const users = useStoreState<any>(({ users }) => users);
  const auth = useStoreState<any>(({ auth }) => auth);
  const sports = useStoreState<any>(({ sports }) => sports);
  const { storeUsers, appendAllEvents } = useStoreActions<any>((actions) => actions);
  const [loading, setLoading] = useState(false);
  const allEvents = useStoreState<any>(({ allEvents }) => allEvents);
  const modalProfileId = useStoreState<any>(({ modalProfileId }) => modalProfileId);

  const objectifiedUsers: any = {};
  users.forEach((user: any) => { objectifiedUsers[user._id] = user; });

  const foundUser = objectifiedUsers[modalProfileId];
  const [password, setPassword] = useState<any>("");

  const profileData = [
    { title: 'Name', value: foundUser?.fullName },
    { title: 'Course', value: mapValue("COURSE", foundUser?.course) },
    { title: 'Branch', value: mapValue("BRANCH", foundUser?.branch) },
    { title: 'Year', value: mapValue("YEARS", foundUser?.year) },
    { title: 'URN', value: foundUser?.universityRoll },
    { title: 'Email', value: foundUser?.email },
    { title: 'Gender', value: foundUser?.gender },
    { title: 'Jersey Number', value: foundUser?.jerseyNo },
    { title: 'Phone Number', value: foundUser?.phoneNumber }
  ];

  const verifyUser = () => {
    setLoading(true);
    Axios.post(API.VERIFY_USER, { userId: foundUser?._id })
      .then(() => {
        const updatedUsers: any = users.map((user: any) => {
          if (user._id === foundUser?._id) {
            user.isVerified = true;
          }
          return user;
        });
        storeUsers(updatedUsers);
        showToast({ color: "primary", message: "User is now verified!", duration: 3000 });
      })
      .catch(() => {
        showToast({ color: "danger", message: "Something went wrong verifying user!", duration: 3000 });
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const setUpdate = () => {
    if (isUpdating && password.length > 0) {
      if (password.length > 7 && password.length < 26) {
        setLoading(true);
        Axios.post(API.UPDATE_USER, { userId: foundUser?._id, password })
          .then(() => {
            showToast({ color: "primary", message: "Password has been changed!", duration: 3000 });
          })
          .catch(() => {
            showToast({ color: "danger", message: "Something went wrong changing password!", duration: 3000 });
          })
          .finally(() => {
            setLoading(false);
            setPassword("");
          });
      }
      else {
        showToast({ color: "danger", message: "Password must be 8 to 25 characters long!", duration: 3000 });
        setPassword("");
      }
    }
    setIsUpdating(!isUpdating);
  }

  const enrollUserToEvent = async () => {
    if (filterSport === "none") {
      showToast({ color: "danger", message: "Please select a sport!", duration: 3000 });
    } else {
      try {
        setLoading(true);
        Axios.post(API.ENROLL_EVENT_ADMIN, { sportId: filterSport, userId: foundUser?._id })
          .then(({ data }) => {
            appendAllEvents(data.events);
            showToast("Successfully enrolled the event!", 3000)
          })
          .catch(() => {
            showToast("Already Enrolled!", 3000)
          }).finally(() => {
            setLoading(false)
          });
      } catch (error) {
        console.log(error)
        setLoading(false);
        showToast("Something went wrong!", 3000)
      }
    }
  }

  const userEvents = allEvents.filter((node: any) => (foundUser?._id === node?.userId));
  return (
    <>
      <IonLoading
        isOpen={loading}
        message={'Hold on... Enjoy the wheater meanwhile!'}
      />
      <IonModal ref={modalRef} isOpen onDidDismiss={() => updateModalProfileId("")}>
        <IonContent>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton onClick={() => modalRef.current.dismiss()}>
                  <IonIcon slot="icon-only" icon={closeCircle} />
                </IonButton>
              </IonButtons>
              <IonTitle>Profile</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonCardHeader>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <h1 style={{ textAlign: "center", fontWeight: "bold", margin: "0" }}>Personal Information</h1>

              {[1, 2, 3].includes(auth?.user?.adminLevel) && <IonFabButton size="small" color="danger" onClick={setUpdate}>
                {isUpdating ? (
                  <IonIcon icon={checkmarkSharp}></IonIcon>
                ) : (
                  <IonIcon icon={pencil}></IonIcon>
                )}
              </IonFabButton>
              }
            </div>
          </IonCardHeader>
          <IonGrid>
            <IonRow>
              <IonCol>
                {profileData.map(({ title, value }) => (
                  <IonItem key={title}>
                    <IonLabel>{title}</IonLabel>
                    <IonNote slot="end">{value}</IonNote>
                  </IonItem>
                ))}
                <IonItem>
                  <IonLabel>Verified</IonLabel>
                  {!foundUser?.isVerified ? (
                    <IonButton color="danger" size="small" onClick={() => {
                      showAlert(`Do you want to verify ${foundUser?.fullName}?`, [
                        { text: "Yes", handler: () => verifyUser() },
                        { text: "No" },
                      ]);
                    }}>Verify Now!</IonButton>
                  ) : (
                    <IonNote slot="end">{foundUser?.isVerified ? 'Yes' : 'No'}</IonNote>
                  )}
                </IonItem>
                {isUpdating && (
                  <>
                    <IonItem>
                      <IonLabel slot="start">Add Event</IonLabel>
                      <IonSelect
                        interface="alert"
                        style={{ width: "100%", maxWidth: "100%" }}
                        value={filterSport}
                        onIonChange={(e) => setFilterSport(e.detail.value)}
                      >
                        <IonSelectOption value="none">Select Sport</IonSelectOption>
                        {sports
                          .filter((sport: any) => sport.genderCategory === foundUser?.gender)
                          .map(({ _id, sportName }: any) => (<IonSelectOption key={_id} value={_id}>{sportName}</IonSelectOption>))}
                      </IonSelect>
                    </IonItem>
                    <IonItem>
                      <IonButton style={{ width: "100%" }} onClick={(e) => { e.stopPropagation(); enrollUserToEvent() }}>Add</IonButton>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Password</IonLabel>
                      <IonInput placeholder="New Password" slot="end" value={password} onIonChange={e => setPassword(e.detail.value)} />
                    </IonItem>
                  </>
                )}
                {!!userEvents.length && <h1 style={{ textAlign: "center", fontWeight: "bold" }}>Enrolled Events</h1>}
                {userEvents.map((node: any) => (
                  <EnrolledItem
                    key={node?._id}
                    sportType={node?.sportId?.sportType}
                    branch={foundUser?.branch}
                    sportName={node?.sportId?.sportName}
                    genderCategory={node?.sportId?.genderCategory}
                    position={node?.position}
                    attendance={node?.attendance}
                    eventId={node?._id}
                  />
                ))}
                <h1 style={{ textAlign: "center", fontWeight: "bold" }}>Jersy QR Code</h1>
                <IonItem style={{ padding: "24px 0" }}>
                  <QRCode size={256} value={`${foundUser?.jerseyNo}`} style={{ margin: "24px auto" }}></QRCode>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </>
  );
};
