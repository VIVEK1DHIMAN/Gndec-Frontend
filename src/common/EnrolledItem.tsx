import PropTypes from "prop-types"
import React, { useState } from "react";
import {
  IonIcon, IonItem, IonLabel, IonLoading, IonCol, IonCard, IonCardHeader, useIonAlert, useIonToast, IonButton, IonCardContent
} from "@ionic/react";
import { closeCircle, americanFootball, sad, medal, ribbon, create } from "ionicons/icons";
import { ATTENDANCE_COLOR, mapValue, API } from "../constants";
import Axios from "axios";
import { useStoreActions, useStoreState } from "easy-peasy";

export const EnrolledItem: React.FC<any> = ({ sportType, branch, sportName, genderCategory, position, attendance, eventId }) => {
  const [loading, setLoading] = useState(false);
  const deleteEventbyId = useStoreActions<any>((actions) => actions.deleteEventbyId);
  const auth = useStoreState<any>(({ auth }) => auth);
  const [showToast] = useIonToast();
  const [showAlert] = useIonAlert();

  const genderWiseColor = genderCategory === "Male" ? "tertiary" : "pink";

  const PositionEventComponent = (icon: string | undefined, varColor: string, position: any) => {
    return (
      <>
        <IonIcon slot="start" icon={icon} color={varColor} />
        <IonLabel>{position}</IonLabel>
      </>
    )
  }

  const deleteEvent = (deleteEventId: string) => {
    setLoading(true);
    Axios.post(API.DELETE_EVENT, { eventIds: [deleteEventId] })
      .then(() => {
        deleteEventbyId(deleteEventId);
        showToast('User removed from team successfully', 3000);
      })
      .catch(() => {
        showToast('Error deleting event', 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const bakePosition = (pos: any) => {
    let theme = genderWiseColor;
    let icon = pos === 0 ? sad : medal;
    switch (pos) {
      case 1:
        theme = "gold";
        break;
      case 2:
        theme = "silver";
        break;
      case 3:
        theme = "bronze";
        break;
      case 4:
        theme = genderWiseColor;
        break;
      default:
        theme = genderWiseColor;
        break;
    }
    return PositionEventComponent(icon, theme, mapValue("USER_RESULT", pos))
  }

  return (
    <>
      <IonLoading
        isOpen={loading}
        message={'Hold on... Enjoy the wheater meanwhile!'}
      />
      <IonItem>
        <IonCol size="12">
          {(sportType === "relay" || sportType === "tugofwar") &&
            <h2 color="primary">Team: {mapValue("BRANCH", branch)}</h2>
          }
          <IonCard className="ion-activatable ripple-parent">
            <IonCardContent>
              <IonItem color="transparent" lines="none">
                <IonIcon slot="start" icon={americanFootball} color={genderWiseColor} />
                <IonLabel>{mapValue("SPORT_TYPE", sportType)}</IonLabel>
                {(mapValue("ATTENDANCE", attendance) !== "Present" && [1, 2].includes(auth?.user?.adminLevel)) && (
                  <IonButton
                    slot="end"
                    color="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      showAlert(`Do you want to remove user enrollment from event ${sportName}?`, [
                        { text: "Yes", handler: () => deleteEvent(eventId) },
                        { text: "No" }
                      ])
                    }}>
                    Remove
                    <IonIcon
                      slot="end"
                      icon={closeCircle}
                      style={{ cursor: "pointer" }}
                    />
                  </IonButton>
                )}
              </IonItem>
              <IonItem color="transparent" lines="none">
                <IonIcon slot="start" icon={ribbon} color={genderWiseColor} />
                <IonLabel>{sportName}</IonLabel>
              </IonItem>
              <IonItem color="transparent" lines="none">
                <IonIcon slot="start" icon={create} color={genderWiseColor} />
                <IonLabel color={ATTENDANCE_COLOR[attendance]}>{mapValue("ATTENDANCE", attendance)}</IonLabel>
              </IonItem>
              {mapValue("ATTENDANCE", attendance) !== 'Not Marked' && (
                <IonItem color="transparent" lines="none">
                  {bakePosition(position)}
                </IonItem>
              )}
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonItem >
    </>
  );
};

EnrolledItem.propTypes = {
  attendance: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  genderCategory: PropTypes.string.isRequired,
  position: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  sportName: PropTypes.string.isRequired,
  sportType: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
}
