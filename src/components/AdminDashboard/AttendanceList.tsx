/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import {
  IonBadge, IonCard, IonCardContent, IonSegment,
  IonSegmentButton, IonContent, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonCol, IonGrid,
  IonIcon, IonInput, IonItem, IonLabel,
  IonRippleEffect, IonRow, IonSelect, IonSelectOption,
  IonText, useIonToast, IonFab, IonFabButton, IonFabList, IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonList, IonListHeader, useIonAlert
} from "@ionic/react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { API, GENDER, mapValue, ATTENDANCE, mergeSearch } from "../../constants";
import Axios from "axios";
import {
  americanFootball, callSharp, caretUp, closeCircle,
  ellipseSharp, megaphone, qrCodeOutline, reader, skull
} from "ionicons/icons";
import { GenderIcon } from "../../common";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Virtuoso } from "react-virtuoso";

export const AttendanceList: React.FC<any> = ({ view = false }) => {
  const modalRef = useRef<any>();
  const [isModal, setIsModal] = useState(false);
  const [filterSport, setFilterSport] = useState('none');

  const [showAlert] = useIonAlert();
  const [showToast, dismissToast] = useIonToast();
  const auth = useStoreState<any>(({ auth }) => auth);
  const users = useStoreState<any>(({ users }) => users);
  const sports = useStoreState<any>(({ sports }) => sports);
  const allEvents = useStoreState<any>(({ allEvents }) => allEvents);
  const storeAllEvents = useStoreActions<any>(({ storeAllEvents }) => storeAllEvents);
  const updateModalProfileId = useStoreActions<any>((actions) => actions.updateModalProfileId);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const currentSport = sports?.find((sport: any) => sport?._id === filterSport);

  const objectifiedUsers: any = {};
  users.forEach((user: any) => { objectifiedUsers[user._id] = user; });

  const processEvents = allEvents
    .map((event: any) => ({ ...event, user: objectifiedUsers[event.userId] }))
    .filter((event: any) => event?.sportId?._id === filterSport);

  const markAttendance = (attendance: any, id: string) => {
    dismissToast();
    setIsLoading(true);
    const attendanceData = {
      eventId: id,
      attendance
    }
    Axios.post(API.MARK_ATTENDANCE, attendanceData)
      .then(() => {
        const updatedAllEvents: any = allEvents.map((event: any) => {
          if (event._id === attendanceData.eventId) {
            event.attendance = attendanceData.attendance;
          }
          return event;
        });
        storeAllEvents(updatedAllEvents);
        let color = "";
        if (attendanceData.attendance === 'present') {
          color = "success";
        } else if (attendanceData.attendance === 'absent') {
          color = "danger";
        } else {
          color = "warning";
        }
        showToast({ color, message: `Attendance is marked as ${mapValue("ATTENDANCE", attendanceData.attendance)}!`, duration: 5000 });
      })
      .catch(() => {
        showToast("Something went wrong!", 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const markAllUnmarkedAbsent = () => {
    Axios.post(API.MARK_UNMARKED_ABSENT, { sportId: filterSport })
      .then(({ data }) => {
        const absentEventIds = data.eventIds.map((event: any) => event._id);
        const updatedAllEvents: any = allEvents.map((event: any) => {
          if (absentEventIds.includes(event._id)) {
            event.attendance = "absent";
          }
          return event;
        });
        storeAllEvents(updatedAllEvents);
        showToast("Successfully updated `Not Marked` students to `Absent`!", 3000);
      })
      .catch(() => {
        showToast("Something went wrong!", 3000);
      })
  }

  const onQRScan = (jerseyNo: string) => {
    dismissToast();
    if (processEvents.length) {
      const event = processEvents.find((event: any) => Number(event.user.jerseyNo) === Number(jerseyNo));
      if (event) {
        showToast({ color: "success", message: `Jersey No ${jerseyNo} marked present for ${currentSport?.sportName}!`, duration: 1500 });
        markAttendance('present', event?._id);
      } else {
        showToast({ color: "warning", message: `Jersey No ${jerseyNo} has not enrolled in ${currentSport?.sportName}!`, duration: 1500 });
      }
    }
  }
  const sortedData = mergeSearch({
    data: processEvents,
    search,
    sort: (a: any, b: any) => {
      return a?.user?.jerseyNo - b?.user?.jerseyNo;
    },
    options: {
      keys: ["user.jerseyNo", "sportId.sportName", "sportId.sportType", "user.fullName", "user.universityRoll", "user.year",
        "user.phoneNumber", "user.gender", "user.course", "user.branch", "attendance"],
    }
  });

  const attendanceColor: any = { present: "success", absent: "danger", not_marked: "medium" };
  return (
    <IonGrid className="h-full flex-column">
      <IonRow>
        <IonCol sizeXl="8" sizeLg="6" sizeSm="12" sizeXs="12">
          <IonItem>
            <IonSelect
              interface="alert"
              style={{ width: "100%", maxWidth: "100%" }}
              value={filterSport}
              onIonChange={(e) => setFilterSport(e.detail.value)}
            >
              <IonSelectOption value="none">Select Sport</IonSelectOption>
              {sports.map(({ _id, sportName }: any) => (<IonSelectOption key={_id} value={_id}>{sportName}</IonSelectOption>))}
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
            {(filterSport !== "none" && !view) && (
              <IonIcon icon={qrCodeOutline}
                onClick={async () => {
                  const data = await BarcodeScanner.scan();
                  if (data.format === "QR_CODE") {
                    onQRScan(data.text)
                  }
                }}
              />
            )}
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
              const isMale = event?.user?.gender === GENDER[1].value;
              return (
                <IonCol key={event._id} sizeXl="3" sizeLg="4" sizeMd="6" sizeSm="12" size="12">
                  <IonCard className="ion-activatable ripple-parent" color={color} onClick={() => updateModalProfileId(event?.user?._id)}>
                    <IonRippleEffect />
                    <IonCardHeader>
                      <IonItem color="transparent" lines="none">
                        <IonCardSubtitle>Jersey {event?.user?.jerseyNo}</IonCardSubtitle>
                        {view && <IonBadge color={attendanceColor[event.attendance]} slot="end">{mapValue("ATTENDANCE", event.attendance)}</IonBadge>}
                      </IonItem>
                      <IonItem color="transparent" lines="none">
                        <IonCardTitle>{event?.user?.fullName}</IonCardTitle>
                        <GenderIcon gender={event?.user?.gender} slot="end" />
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
                        <IonLabel>{event?.user?.universityRoll}</IonLabel>
                      </IonItem>
                      <IonItem color="transparent" lines="none">
                        <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={callSharp} />
                        <IonLabel>{event?.user?.phoneNumber}</IonLabel>
                      </IonItem>
                    </IonCardContent>
                    {!view && (
                      <IonCardHeader>
                        <IonSegment
                          mode="ios"
                          onClick={(e) => e.stopPropagation()}
                          value={event.attendance}
                          disabled={isLoading}

                        >
                          {ATTENDANCE.map((attendance: any) => (
                            <IonSegmentButton
                              key={attendance.value}
                              value={attendance.value}
                              onClick={() => markAttendance(attendance.value, event._id)}
                            >
                              <IonLabel color={attendanceColor[attendance.value]}>{attendance.title}</IonLabel>
                            </IonSegmentButton>
                          ))}
                        </IonSegment>
                      </IonCardHeader>
                    )}
                  </IonCard>
                </IonCol>
              )
            }}
          />
          {filterSport !== "none" && (
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton>
                <IonIcon icon={caretUp} />
              </IonFabButton>
              <IonFabList side="top">
                <IonFabButton onClick={() => setIsModal(true)}><IonIcon icon={reader} /></IonFabButton>
                {[1].includes(auth?.user?.adminLevel) &&
                  <IonFabButton
                    onClick={() => showAlert("Update all `Not Marked` students to Absent for this sport event?", [
                      { text: "Yes", handler: () => markAllUnmarkedAbsent() },
                      { text: "No", handler: () => { } }
                    ])}>
                    <IonIcon icon={skull} />
                  </IonFabButton>}
              </IonFabList>
            </IonFab>
          )}
        </IonContent>
      </IonRow>
      <IonGrid>
        {filterSport === "none" && <IonText color="danger">Please select an event to view the list</IonText>}
        {filterSport !== "none" && processEvents.length === 0 && <IonText color="danger">No records found</IonText>}
      </IonGrid>

      <IonModal ref={modalRef} isOpen={isModal} onDidDismiss={() => setIsModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => modalRef.current.dismiss()}>
                <IonIcon slot="icon-only" icon={closeCircle} />
              </IonButton>
            </IonButtons>
            <IonTitle style={{ textAlign: "center" }}>
              {`Attendance ${currentSport?.sportName} (${mapValue("GENDER", currentSport?.genderCategory)})`}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
          <IonInput
            onIonChange={(e: any) => setSearch(e.detail.value)}
            placeholder="Search"
            clearInput
          />
          {(filterSport !== "none" && !view) && (
            <IonIcon icon={qrCodeOutline}
              onClick={async () => {
                dismissToast();
                const data = await BarcodeScanner.scan();
                if (data.format === "QR_CODE") {
                  onQRScan(data.text)
                }
              }}
            />
          )}
        </IonItem>
        <IonContent className="h-full">
          <IonList className="h-full" style={{ padding: 0 }}>
            <Virtuoso
              style={{ height: '100%' }}
              totalCount={sortedData.length}
              itemContent={index => {
                const event = sortedData[index];
                return (
                  <IonItem
                    style={{ display: "flex", flexDirection: "column" }}
                    onClick={() => updateModalProfileId(event?.user?._id)}
                  >
                    <IonListHeader>
                      <IonLabel style={{ padding: "12px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <h2 style={{ marginRight: "24px", fontWeight: "bold" }}>Jersey {event?.user?.jerseyNo}</h2>
                          <h2 style={{ textTransform: "capitalize" }}>{event?.user?.fullName}</h2>
                        </div>
                        {!view && (
                          <IonSegment
                            mode="ios"
                            onClick={(e) => e.stopPropagation()}
                            value={event.attendance}
                            disabled={isLoading}
                            style={{ marginTop: "12px" }}
                          >
                            {ATTENDANCE.map((attendance: any) => (
                              <IonSegmentButton
                                key={attendance.value}
                                value={attendance.value}
                                onClick={() => markAttendance(attendance.value, event._id)}
                              >
                                <IonLabel>{attendance.title}</IonLabel>
                              </IonSegmentButton>
                            ))}
                          </IonSegment>
                        )}
                      </IonLabel>
                    </IonListHeader>
                    {view && (<IonIcon color={attendanceColor[event.attendance]} icon={ellipseSharp} slot="end" />)}
                  </IonItem>
                )
              }}
            />
          </IonList>
        </IonContent>
      </IonModal>

    </IonGrid >
  );
};


