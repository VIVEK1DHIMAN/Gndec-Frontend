import React from "react";
import {
  IonGrid,
  IonItem,
  IonLabel,
  IonNote,
  IonRow,
  IonCol,
  IonChip,
} from "@ionic/react";
import QRCode from "react-qr-code";
import { useStoreState } from "easy-peasy";
import { mapValue } from "../../constants";

export const Profile: React.FC<any> = () => {
  const auth = useStoreState<any>(({ auth }) => auth);
  const userEvents = useStoreState<any>(({ userEvents }) => userEvents);

  const profileData = [
    { title: 'Name', value: auth?.user?.fullName },
    { title: 'Course', value: mapValue("COURSE", auth?.user?.course) },
    { title: 'Branch', value: mapValue("BRANCH", auth?.user?.branch) },
    { title: 'Year', value: mapValue("YEARS", auth?.user?.year) },
    { title: 'URN', value: auth?.user?.universityRoll },
    { title: 'Email', value: auth?.user?.email },
    { title: 'Gender', value: auth?.user?.gender },
    { title: 'Jersey Number', value: auth?.user?.jerseyNo },
    { title: 'Phone Number', value: auth?.user?.phoneNumber },
    { title: 'Verification', value: auth?.user?.isVerified ? "Yes" : "No", color: auth?.user?.isVerified ? "success" : "danger" },
    { title: 'Events Enrolled', value: userEvents?.length || 0, color: userEvents?.length !== 0 ? "success" : "danger" }
  ];

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          {profileData.map(({ title, value, color = "" }) => (
            <IonItem key={title}>
              <IonLabel>{title}</IonLabel>
              {color ? (
                <IonChip color={color} slot="end">{value}</IonChip>
              ) : (
                <IonNote slot="end">{value}</IonNote>
              )}
            </IonItem>
          ))}
          <IonItem style={{ padding: "24px 0" }}>
            <div style={{ display: "flex", flexDirection: "column", margin: "auto" }}>
              <h2 style={{ textAlign: 'center' }}>Chest Number QR</h2>
              <QRCode size={256} value={`${auth?.user?.jerseyNo}`} style={{ margin: "24px auto" }}></QRCode>
            </div>
          </IonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
