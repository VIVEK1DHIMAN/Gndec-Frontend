import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonLoading,
  IonRow,
  useIonToast,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonModal,
  IonCardSubtitle,
} from "@ionic/react";
import { API } from "../../constants";
import Axios from "axios";
import { EnrolledItem } from "../../common";
import { isEqual } from "lodash";

interface SportsData {
  _id: string,
  sportName: string,
  sportType: string,
  genderCategory: string,
  isActive: boolean,
}

export const SelectEvents: React.FC<any> = ({ fetchAll }) => {
  const [showToast] = useIonToast();
  const [accept, setAccept] = useState(false);
  const [instructionModal, setInstructionModal] = useState(false);

  const SPORTS: SportsData[] = useStoreState<any>(({ sports }) => sports);
  const auth = useStoreState<any>(({ auth }) => auth);
  const userEvents = useStoreState<any>(({ userEvents }) => userEvents);
  const storeUserEvents = useStoreActions<any>((actions) => actions.storeUserEvents);

  const [selectedEvents, setSelectedEvents] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const allSelectedSports: SportsData[] = selectedEvents
    .map((eve: string) => SPORTS.find((node) => (node._id === eve)));
  const fieldSportCount = allSelectedSports.filter((sport) => sport?.sportType === "field").length;
  const trackSportCount = allSelectedSports.filter((sport) => sport?.sportType === "track").length;

  const disableOn = (fieldSportCount === 2 && trackSportCount === 1) || (fieldSportCount === 1 && trackSportCount === 2)
  const disableFieldOn2 = fieldSportCount === 2;
  const disableTrackOn2 = trackSportCount === 2;

  const savedEventsIds = userEvents.map((node: any) => (node.sportId._id)).filter((node: any) => node);
  const newEnrollSports: any = selectedEvents.filter((x: string) => !savedEventsIds.includes(x));

  useEffect(() => {
    setSelectedEvents(userEvents.map((event: any) => (event.sportId._id)))
  }, [SPORTS, userEvents])

  const enrollUserToEvents = async () => {
    try {
      setLoading(true)
      const serverSports = await (await Axios.get(API.GET_SPORTS)).data;
      const serverUserEvents = await (await Axios.get(API.ME)).data.events;
      if (isEqual(serverSports, SPORTS) && isEqual(serverUserEvents, userEvents)) {
        const newEnrollSports: any = selectedEvents.filter((x: string) => !savedEventsIds.includes(x));
        if (!newEnrollSports.length) {
          showToast("Please select atleast one event!", 3000);
          setLoading(false)
          return;
        }
        Axios.post(API.ENROLL_EVENTS, { sportIds: newEnrollSports })
          .then(({ data }) => {
            storeUserEvents(data.events);
            showToast("Successfully enrolled the events!", 3000)
          })
          .catch(() => {
            showToast("Something went wrong", 3000)
          }).finally(() => {
            setLoading(false)
          });
      } else {
        fetchAll();
        setLoading(false);
        showToast("Server and local data sync error! Updating...", 3000)
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
      showToast("Something went wrong!", 3000)
    }
  }

  const putSelectedEvents = (value: string) => {
    if (!selectedEvents.includes(value)) {
      setSelectedEvents([...selectedEvents, value])
    } else {
      setSelectedEvents(selectedEvents.filter((node: string) => node !== value))
    }
  }

  return (
    <>
      <IonLoading
        isOpen={loading}
        message={'Hold on... Enjoy the wheater meanwhile!'}
      />
      <IonModal
        isOpen={instructionModal}
      >
        <IonCardHeader>
          <h1 style={{ textAlign: "center" }}>Important Instructions ⚠️</h1>
          <IonCardHeader>
            <ol>
              <li style={{ margin: "8px 0" }}>These instrctions are for you if you have not received verification email on your college email account.</li>
              <li style={{ margin: "8px 0" }}>Go to Help form <a href="https://docs.google.com/forms/d/e/1FAIpQLSdPs3yGoOmDWzEaA-E9eygKaXhBQpZd-9wGe5WeTjB73toxNQ/viewform?usp=pp_url" target="_blank" rel="noreferrer">https://docs.google.com/forms/d/e/1FAIpQLSdPs3yGoOmDWzEaA-E9eygKaXhBQpZd-9wGe5WeTjB73toxNQ/viewform?usp=pp_url</a></li>
              <li style={{ margin: "8px 0" }}>Fill the option <code style={{ background: "rgba(255,0,0,0.2)" }}>Have you signed up in the Sports Application</code> as Yes</li>
              <li style={{ margin: "8px 0" }}>Upload the Image of your College ID card or Library card.</li>
              <li style={{ margin: "8px 0" }}>Sit back and relax. We will get you verified. 🥳</li>
            </ol>
          </IonCardHeader>
          <IonButton onClick={() => setInstructionModal(false)} expand="block">Got it!</IonButton>
        </IonCardHeader>
      </IonModal>
      <IonGrid>
        {userEvents.length > 0 && <h1>Enrolled Events</h1>}
        {userEvents.map((node: any) => (
          <IonRow key={node._id}>
            <IonCol>
              <EnrolledItem
                key={node._id}
                sportType={node.sportId.sportType}
                branch={auth?.user?.branch}
                sportName={node.sportId.sportName}
                genderCategory={node.sportId.genderCategory}
                position={node.position}
                attendance={node.attendance}
              />
            </IonCol>
          </IonRow>
        ))}
      </IonGrid>
      <IonGrid>
        {!auth?.user?.isVerified ? (
          <>
            <IonCardHeader>
              <IonCardTitle>Uh Oh! Your account is not verified</IonCardTitle>
              <IonCardSubtitle>Either you can verify your account with the link sent to your college email or you can verify your account with college ID, Library card. You cannot enroll into any event before verifying your account.</IonCardSubtitle>
            </IonCardHeader>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Important Links</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton size="small" color="danger" expand="block" href="https://mail.gndec.ac.in" target="_blank" rel="noreferrer"> Go to mail.gndec.ac.in</IonButton>
                <IonButton size="small" color="danger" expand="block" href="https://docs.google.com/forms/d/e/1FAIpQLSdPs3yGoOmDWzEaA-E9eygKaXhBQpZd-9wGe5WeTjB73toxNQ/viewform?usp=pp_url" target="_blank" rel="noreferrer"> Need help? Click here to contact!</IonButton>
                <IonButton
                  expand="block"
                  onClick={() => setInstructionModal(true)}
                  color="danger"
                  size="small"
                >
                  Verify with ID, Library Card!
                </IonButton>
              </IonCardContent>
            </IonCard>
          </>
        ) : (
          <>
            <h3 style={{ fontWeight: "bold" }}>Field Events</h3>
            <IonRow>
              {SPORTS.filter(({ sportType, genderCategory }) => sportType === "field" && genderCategory === auth.user?.gender).map((node) => (
                <IonCol key={node._id}>
                  <IonItem>
                    <IonLabel>{node.sportName}: &nbsp;</IonLabel>
                    <IonCheckbox
                      value={node._id}
                      checked={selectedEvents.includes(node._id)}
                      onClick={() => putSelectedEvents(node._id)}
                      disabled={
                        ((disableOn || disableFieldOn2) && !selectedEvents.includes(node._id))
                        || savedEventsIds.includes(node._id)
                        || !node.isActive}
                    />
                  </IonItem>
                </IonCol>
              ))}
            </IonRow>
            <h3 style={{ fontWeight: "bold" }}>Track Events</h3>
            <IonRow>
              {SPORTS.filter(({ sportType, genderCategory }) => sportType === "track" && genderCategory === auth.user?.gender).map((node) => (
                <IonCol key={node._id}>
                  <IonItem lines="full">
                    <IonLabel>{node.sportName}: &nbsp;</IonLabel>
                    <IonCheckbox
                      value={node._id}
                      checked={selectedEvents.includes(node._id)}
                      onClick={() => putSelectedEvents(node._id)}
                      disabled={
                        ((disableOn || disableTrackOn2) && !selectedEvents.includes(node._id))
                        || savedEventsIds.includes(node._id)
                        || !node.isActive}
                    />
                  </IonItem>
                </IonCol>
              ))}
            </IonRow>
            <IonCard>
              <IonCardTitle>
                <p style={{ color: 'red', marginLeft: '10px' }}>IMPORTANT:</p>
                <ul style={{ fontSize: "16px", paddingRight: "20px", textAlign: "justify" }}>
                  <li>You can select 3 events atmost. It can be either 2 field events and 1 track events or 1 field event and 2 track events.</li>
                  <li>Choose carefully. You will have to contact sports branch to change events later on.</li>
                  <li>Keep watching Announcements for live updates of sports.</li>
                </ul>
                <div style={{ padding: "0 20px 10px 20px" }}>
                  <input type="checkbox" checked={accept} onChange={() => setAccept(!accept)} /> I understand and agree to the above terms and conditions.
                  <IonButton
                    expand="block"
                    slot="end"
                    onClick={enrollUserToEvents}
                    disabled={!accept || !newEnrollSports.length || loading}
                  >Enroll</IonButton>
                </div>
              </IonCardTitle>
            </IonCard>
          </>)}
      </IonGrid>
    </>
  );
};
