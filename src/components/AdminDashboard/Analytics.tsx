import React, { useMemo } from "react";
import { IonCol, IonGrid, IonItem, IonLabel, IonRow, IonTitle, IonChip, IonItemDivider, IonItemGroup } from "@ionic/react";
import { useStoreState } from "easy-peasy";
import { countBy } from "lodash";

export const Analytics: React.FC<any> = () => {
  const { users, allEvents } = useStoreState<any>((state) => state);

  const isVerifiedStatus = useMemo(() => countBy(users, "isVerified"), [users])
  const genderStatus = useMemo(() => countBy(users, "gender"), [users])
  const enrollmentGenderStatus = useMemo(() => countBy(allEvents, "sportId.genderCategory"), [allEvents])
  const eventAttendanceStatus = useMemo(() => countBy(allEvents, "attendance"), [allEvents])
  const maleEvents = useMemo(() => allEvents.filter((event: any) => event?.sportId?.genderCategory === "Male"), [allEvents])
  const femaleEvents = useMemo(() => allEvents.filter((event: any) => event?.sportId?.genderCategory === "Female"), [allEvents])
  const maleEventType = useMemo(() => countBy(maleEvents, "sportId.sportType"), [maleEvents])
  const femaleEventType = useMemo(() => countBy(femaleEvents, "sportId.sportType"), [femaleEvents])

  const DATA = [
    {
      group: "User Analytics",
      ANALYTICS: [
        { title: "Total Users", value: users.length || 0, color: "primary" },
        { title: "Verified Users", value: isVerifiedStatus.true || 0, color: "green" },
        { title: "Unverified Users", value: isVerifiedStatus.false || 0, color: "danger" },
        { title: "Male Users", value: genderStatus.Male || 0, color: "tertiary" },
        { title: "Female Users", value: genderStatus.Female || 0, color: "pink" }
      ]
    },
    {
      group: "Enrollment Analytics",
      ANALYTICS: [
        { title: "Total Enrollments", value: allEvents.length || 0, color: "primary" },
        { title: "Male Enrollments", value: enrollmentGenderStatus.Male || 0, color: "tertiary" },
        { title: "Female Enrollments", value: enrollmentGenderStatus.Female || 0, color: "pink" },
        { title: "Track Male Enrollments", value: maleEventType.track || 0, color: "tertiary" },
        { title: "Field Male Enrollments", value: maleEventType.field || 0, color: "tertiary" },
        { title: "Track Female Enrollments", value: femaleEventType.track || 0, color: "pink" },
        { title: "Field Female Enrollments", value: femaleEventType.field || 0, color: "pink" },
      ]
    },
    {
      group: "Attendance Analytics",
      ANALYTICS: [
        { title: "Present", value: eventAttendanceStatus.present || 0, color: "green" },
        { title: "Absent", value: eventAttendanceStatus.absent || 0, color: "danger" },
        { title: "Not Marked", value: eventAttendanceStatus.not_marked || 0 },
      ]
    }
  ]

  return (
    <IonGrid className="h-full flex-column">
      <IonRow>
        <IonCol>
          {DATA.map(({ group, ANALYTICS }) => (
            <IonItemGroup key={group} style={{ marginBottom: "24px" }}>
              <IonItemDivider style={{ paddingLeft: 0 }}>
                <IonTitle color="primary" style={{ paddingLeft: 0 }}>
                  {group}
                </IonTitle>
              </IonItemDivider>
              {ANALYTICS.map(({ title, value, color = "" }) => (
                <IonItem key={title}>
                  <IonLabel>{title}</IonLabel>
                  <IonChip slot="end" color={color}>{value}</IonChip>
                </IonItem>
              ))}
            </IonItemGroup>
          ))}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};




