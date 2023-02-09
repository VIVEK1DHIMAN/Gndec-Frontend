import React, { useState } from "react";
import { IonBadge, IonCard, IonCardContent, IonContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonRow, IonRippleEffect, IonChip } from "@ionic/react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { GENDER, mergeSearch } from "../../constants";
import { callSharp, checkmarkCircleSharp, closeCircleSharp } from "ionicons/icons";
import { GenderIcon } from "../../common";
import { Virtuoso } from 'react-virtuoso';

export const UsersList: React.FC<any> = () => {
  const { users, allEvents } = useStoreState<any>((store) => store);
  const [search, setSearch] = useState('');

  const updateModalProfileId = useStoreActions<any>((actions) => actions.updateModalProfileId);
  const sortedData = mergeSearch({
    data: users,
    search,
    sort: (a: any, b: any) => {
      return a?.jerseyNo - b?.jerseyNo;
    },
    options: { keys: ["jerseyNo", "fullName", "email", "universityRoll", "phoneNumber", "gender", "course", "branch", "isVerified"] }
  });

  return (
    <IonGrid className="h-full flex-column">
      <IonRow>
        <IonCol sizeXl="8" sizeLg="6" sizeSm="12" sizeXs="12">
          {/* {filters} */}
        </IonCol>
        <IonCol sizeXl="4" sizeLg="6" sizeSm="12" sizeXs="12">
          <IonItem>
            <IonInput
              onIonChange={(e: any) => setSearch(e.detail.value)}
              placeholder="Search"
              clearInput
            />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow className="h-full">
        <IonContent className="h-full">
          <Virtuoso
            style={{ height: '100%' }}
            totalCount={sortedData.length}
            itemContent={index => {
              const user = sortedData[index];
              const color = user.isSearched ? "light" : "";
              const isMale = user.gender === GENDER[1].value;
              const userEvents = allEvents.filter((node: any) => (user?._id === node?.userId));
              return (
                <IonCard className="ion-activatable ripple-parent" color={color} onClick={() => updateModalProfileId(user._id)}>
                  <IonRippleEffect />
                  <IonCardHeader>
                    <IonItem color="transparent" lines="none">
                      <IonCardSubtitle>Jersey {user.jerseyNo}</IonCardSubtitle>
                      {user.isVerified ? (
                        <IonIcon title="Verified" color="success" icon={checkmarkCircleSharp} slot="end" />
                      ) : (
                        <IonIcon title="Not Verified" color="danger" icon={closeCircleSharp} slot="end" />
                      )}
                    </IonItem>
                    <IonItem color="transparent" lines="none">
                      <IonCardTitle>{user.fullName}</IonCardTitle>
                      <GenderIcon gender={user.gender} slot="end" />
                    </IonItem>
                  </IonCardHeader>
                  <IonCardContent color={color}>
                    <IonItem color="transparent" lines="none">
                      <IonBadge color={isMale ? "tertiary" : "pink"} slot="start">URN</IonBadge>
                      <IonLabel>{user.universityRoll}</IonLabel>
                    </IonItem>
                    <IonItem color="transparent" lines="none">
                      <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={callSharp} />
                      <IonLabel>{user.phoneNumber}</IonLabel>
                      <IonChip color={userEvents?.length < 4 ? "primary" : "danger"} slot="end">{userEvents?.length}</IonChip>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              )
            }}
          />
        </IonContent>
      </IonRow>
    </IonGrid>
  );
};




