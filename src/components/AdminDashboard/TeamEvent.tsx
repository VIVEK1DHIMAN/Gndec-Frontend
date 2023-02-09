import React, { useRef, useState } from "react";
import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonRippleEffect, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToggle, IonToolbar, useIonAlert, useIonToast } from "@ionic/react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { API, GENDER, mapValue, mergeSearch } from "../../constants";
import Axios from "axios";
import { americanFootball, callSharp, checkmarkCircleSharp, closeCircle, closeCircleSharp, } from "ionicons/icons";
import { GenderIcon } from "../../common";
import { groupBy } from "lodash";

export const TeamEvent: React.FC<any> = () => {
  const modalRef = useRef<any>();

  const [showToast] = useIonToast();
  const [showAlert] = useIonAlert();
  const users = useStoreState<any>(({ users }) => users);
  const sports = useStoreState<any>(({ sports }) => sports);
  const allEvents = useStoreState<any>(({ allEvents }) => allEvents);
  const updateModalProfileId = useStoreActions<any>((actions) => actions.updateModalProfileId);
  const deleteEventbyId = useStoreActions<any>((actions) => actions.deleteEventbyId);
  const appendAllEvents = useStoreActions<any>((actions) => actions.appendAllEvents);

  const [filterSport, setFilterSport] = useState('none');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<any>([]);
  const [pSearch, setPSearch] = useState('');

  const teamSports = sports.filter((sport: any) => !(sport.sportType === "field" || sport.sportType === "track"));
  const selectedSport = teamSports.find((sport: any) => sport._id === filterSport);

  const processedUsers: any = {};
  users.forEach((user: any) => { processedUsers[user._id] = user; });
  const processEventTugAndRalay = allEvents
    .map((event: any) => ({ ...event, user: processedUsers[event.userId] }))
    .filter((event: any) => (event?.sportId?.sportType === "tugofwar" || event?.sportId?.sportType === "relay"))
    .filter((event: any) => (event?.sportId?.genderCategory === selectedSport?.genderCategory && event?.sportId?.sportType === selectedSport?.sportType));

  const groupedEventList = groupBy(processEventTugAndRalay, 'user.branch');

  const selectUsers = (userId: string) => {
    const isUser = userList.find((usr: any) => usr === userId);
    if (!isUser) {
      setUserList([...new Set([...userList, userId])])
    } else {
      setUserList(userList.filter((node: string) => node !== userId))
    }
  }

  const deleteEvent = (eventId: string) => {
    setLoading(true);
    Axios.post(API.DELETE_EVENT, { eventIds: [eventId] })
      .then(() => {
        deleteEventbyId(eventId);
        showToast('User removed from team successfully', 3000);
      })
      .catch(() => {
        showToast('Error deleting event', 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const addTeamEvent = () => {
    setLoading(true);
    Axios.post(API.ADD_TEAM, { sportId: selectedSport._id, userIds: userList })
      .then(({ data }) => {
        appendAllEvents(data.teamEvents);
        setUserList([]);
        modalRef.current.dismiss();
        showToast('User removed from team successfully', 3000);
      })
      .catch(() => {
        showToast('Error deleting event', 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <IonLoading
        isOpen={loading}
        message={'Hold on... Enjoy the wheater meanwhile!'}
      />
      <IonGrid>
        <IonRow>
          <IonCol
          // sizeXl="8" sizeLg="6" sizeSm="12" sizeXs="12"
          >
            <IonItem>
              <IonSelect
                interface="alert"
                style={{ width: "100%", maxWidth: "100%" }}
                value={filterSport}
                onIonChange={(e) => setFilterSport(e.detail.value)}
              >
                <IonSelectOption value="none">Select Sport</IonSelectOption>
                {teamSports.map(({ _id, sportName }: any) => (<IonSelectOption key={_id} value={_id}>{sportName}</IonSelectOption>))}
              </IonSelect>
              {filterSport !== "none" && <IonButton slot="start" onClick={(e) => { e.stopPropagation(); setIsOpen(true) }}>Select Users</IonButton>}
            </IonItem>
          </IonCol>
          {/* <IonCol sizeXl="4" sizeLg="6" sizeSm="12" sizeXs="12">
            <IonItem>
              <IonInput
                onIonChange={(e: any) => setSearch(e.detail.value)}
                placeholder="Search"
                value={search}
                clearInput
              />
            </IonItem>
          </IonCol> */}
        </IonRow>
        <IonRow>
          {Object.keys(groupedEventList).map((bKey: string) => (
            <React.Fragment key={bKey}>
              <IonCol size="12"><h1>{mapValue("BRANCH", bKey)}</h1></IonCol>
              {groupedEventList[bKey].map((event: any) => {
                const color = event.isSearched ? "light" : "";
                const isMale = event.user.gender === GENDER[1].value;
                return (
                  <IonCol key={event._id} sizeXl="3" sizeLg="4" sizeMd="6" sizeSm="12" size="12">
                    <IonCard className="ion-activatable ripple-parent" color={color} onClick={() => updateModalProfileId(event.user._id)}>
                      <IonRippleEffect />
                      <IonCardHeader>
                        <IonItem color="transparent" lines="none">
                          <IonCardSubtitle>Jersey {event.user.jerseyNo}</IonCardSubtitle>
                          <IonBadge color={isMale ? "tertiary" : "pink"} slot="end">{mapValue("SPORT_TYPE", event.sportId.sportType)}</IonBadge>
                          <IonIcon
                            slot="end"
                            icon={closeCircle}
                            color="danger"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              showAlert("Remove from Team?", [
                                { text: "Yes", handler: () => deleteEvent(event._id) },
                                { text: "No" }
                              ])
                            }}
                          />
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
              })}
            </React.Fragment>
          ))}
        </IonRow>
      </IonGrid>

      <IonModal ref={modalRef} isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => modalRef.current.dismiss()}>
                <IonIcon slot="icon-only" icon={closeCircle} />
              </IonButton>
            </IonButtons>
            <IonTitle>Enroll Users</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  onIonChange={(e: any) => setPSearch(e.detail.value)}
                  placeholder="Search"
                  value={pSearch}
                  clearInput
                />
              </IonItem>
              {mergeSearch({
                data: users
                  .filter(({ gender }: any) => selectedSport?.genderCategory === gender)
                  .filter(({ _id }: any) => !processEventTugAndRalay.find(({ userId }: any) => userId === _id)),
                search: pSearch,
                options: { keys: ["jerseyNo", "fullName", "email", "universityRoll", "phoneNumber", "gender", "course", "branch", "isVerified"] }
              })
                .map((user: any) => {
                  const color = user.isSearched ? "light" : "";
                  const isMale = user.gender === GENDER[1].value;
                  const isSelected = userList.find((userId: string) => (userId === user._id))
                  return (
                    <IonCard key={user._id} className="ion-activatable ripple-parent" color={color} onClick={() => selectUsers(user._id)}>
                      <IonRippleEffect />
                      <IonCardHeader>
                        <IonItem color="transparent" lines="none">
                          <IonCardSubtitle>Jersey {user.jerseyNo}</IonCardSubtitle>
                          {isSelected ? (
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
                        </IonItem>
                      </IonCardContent>
                    </IonCard>
                  )
                })}
            </IonCol>
          </IonRow>
        </IonContent>
        <IonFooter>
          <IonGrid>
            <IonRow>
              <IonCol>
                {userList.map((userId: any) => {
                  const jerseyNo = processedUsers[userId].jerseyNo;
                  return (<IonBadge key={userId} style={{ margin: 6 }}>Jersey {jerseyNo}</IonBadge>)
                })}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton expand="block" disabled={!userList.length} onClick={addTeamEvent}>Save Result</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonFooter>
      </IonModal>
    </>
  );
};
