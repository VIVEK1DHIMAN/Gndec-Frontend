import React, { useEffect, useState } from "react";
import { IonBadge, IonButton, IonCard, IonContent, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonRippleEffect, IonRow, IonSelect, IonSelectOption, IonText, IonToggle, useIonToast, IonSegment, IonSegmentButton } from "@ionic/react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { API, GENDER, mapValue, mergeSearch, } from "../../constants";
import Axios from "axios";
import { americanFootball, callSharp, megaphone, trophyOutline } from "ionicons/icons";
import { GenderIcon } from "../../common";
import { Virtuoso } from "react-virtuoso";

export const PromoteEvent: React.FC<any> = () => {
  const [sourceSport, setSourceSport] = useState('none');
  const [targetSport, setTargetSport] = useState('none');
  const [search, setSearch] = useState('');

  const [showToast] = useIonToast();
  const users = useStoreState<any>(({ users }) => users);
  const sports = useStoreState<any>(({ sports }) => sports);
  const allEvents = useStoreState<any>(({ allEvents }) => allEvents);
  const appendAllEvents = useStoreActions<any>(({ appendAllEvents }) => appendAllEvents);
  const updateModalProfileId = useStoreActions<any>((actions) => actions.updateModalProfileId);

  const processedUsers: any = {};
  users.forEach((user: any) => { processedUsers[user._id] = user; });
  const processData = allEvents
    .map((event: any) => ({ ...event, user: processedUsers[event.userId] }))
    .filter((event: any) => {
      return event.attendance === "present" && event.position > 3; // Qualified
    })
    .filter((event: any) => sourceSport === "all" || event.sportId._id === sourceSport);

  useEffect(() => {
    setTargetSport('none');
  }, [sourceSport])

  const promoteUsers = () => {
    Axios.post(API.PROMOTE_EVENTS, { sourceSport, targetSport })
      .then(({ data }) => {
        appendAllEvents(data.promotedEvents);
        showToast("Successfully users successfully promoted!", 3000);
      })
      .catch(() => {
        showToast("Something went wrong!", 3000);
      })
  }

  const currentSourceSport = sports.find((sport: any) => sport._id === sourceSport);

  const sortedData = mergeSearch({
    data: processData,
    search,
    options: {
      keys: [
        "user.jerseyNo", "sportId.sportName", "sportId.sportType", "user.fullName", "user.year",
        "user.universityRoll", "user.phoneNumber", "user.gender", "user.course", "user.branch", "event.position"
      ]
    }
  });

  return (
    <IonGrid className="h-full flex-column">
      <IonRow>
        <IonCol sizeXl="4" sizeLg="3" sizeSm="12" sizeXs="12">
          <IonItem>
            <IonSelect
              interface="alert"
              style={{ width: "100%", maxWidth: "100%" }}
              value={sourceSport}
              onIonChange={(e) => setSourceSport(e.detail.value)}
            >
              <IonSelectOption value="none">Select Source Sport</IonSelectOption>
              {sports
                .filter((sport: any) => !sport.isEndGame)
                .map(({ _id, sportName }: any) => (<IonSelectOption key={_id} value={_id}>{sportName}</IonSelectOption>))}
            </IonSelect>
          </IonItem>
        </IonCol>
        <IonCol sizeXl="4" sizeLg="3" sizeSm="12" sizeXs="12">
          <IonItem>
            <IonSelect
              interface="alert"
              style={{ width: "100%" }}
              value={targetSport}
              onIonChange={(e) => setTargetSport(e.detail.value)}
            >
              <IonSelectOption value="none">Select Target Sport</IonSelectOption>
              {sports
                .filter((sport: any) => {
                  return !sport.isPublic && currentSourceSport?.genderCategory === sport.genderCategory
                })
                .map(({ _id, sportName }: any) => (<IonSelectOption key={_id} value={_id}>{sportName}</IonSelectOption>))}
            </IonSelect>
          </IonItem>
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
              const event = sortedData[index];
              const color = event.isSearched ? "light" : "";
              const isMale = event.user.gender === GENDER[1].value;
              return (
                <IonCol key={event._id} sizeXl="3" sizeLg="4" sizeMd="6" sizeSm="12" size="12">
                  <IonCard className="ion-activatable ripple-parent" color={color} onClick={() => updateModalProfileId(event.user._id)}>
                    <IonRippleEffect />
                    <IonCardHeader>
                      <IonItem color="transparent" lines="none">
                        <IonCardSubtitle>Jersey {event.user.jerseyNo}</IonCardSubtitle>
                        <IonChip style={{ padding: 0, margin: 0 }} color="transparent" slot="end">
                          {[...Array.from({ length: event.position }, (_, i) => i + 1)].map((node) => (
                            <IonIcon style={{ margin: 3, marginRight: 0 }} color="success" key={node} icon={trophyOutline}></IonIcon>
                          ))}
                        </IonChip>
                      </IonItem>
                      <IonItem color="transparent" lines="none">
                        <IonCardTitle>{event.user.fullName}</IonCardTitle>
                        <GenderIcon gender={event.user.gender} slot="end" />
                      </IonItem>
                    </IonCardHeader>
                    <IonCardContent color={color}>
                      <IonItem color="transparent" lines="none">
                        <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={americanFootball} />
                        <IonLabel>{event.sportId.sportName}</IonLabel>
                      </IonItem>
                      <IonItem color="transparent" lines="none">
                        <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={megaphone} />
                        <IonLabel>{mapValue("SPORT_TYPE", event.sportId.sportType)}</IonLabel>
                      </IonItem>
                      <IonItem color="transparent" lines="none">
                        <IonBadge color={isMale ? "tertiary" : "pink"} slot="start">URN</IonBadge>
                        <IonLabel>{event.user.universityRoll}</IonLabel>
                      </IonItem>
                      <IonItem color="transparent" lines="none">
                        <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={callSharp} />
                        <IonLabel>{event.user.phoneNumber}</IonLabel>
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              )
            }}
          ></Virtuoso>
        </IonContent>
      </IonRow>
      <IonGrid>
        {sourceSport === "none" && <IonText color="danger">Please select a source sport to view the list</IonText>}
        {sourceSport !== "none" && processData.length === 0 && <IonText color="danger">No records found</IonText>}
      </IonGrid>
      <IonButton
        expand="block"
        onClick={promoteUsers}
        disabled={!(sourceSport !== "none" && targetSport !== "none")}
      >
        Promote Users
      </IonButton>
    </IonGrid >
  );
};
