/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  IonCol,
  IonGrid,
  IonRow,
  IonTitle,
  IonSelect,
  IonSelectOption,
  IonItem,
} from "@ionic/react";
import { useStoreState } from "easy-peasy";
import { Excel } from "../../common";
import { ATTENDANCE, COURSE, BRANCH, M_COMPUTER_APPLICATION, B_COMPUTER_APPLICATION, B_BUSINESS_ADMINISTRATION, M_BUSINESS_ADMINISTRATION, ARCHITECTURE } from "../../constants";
import { mapValue } from "../../constants";

export const ExcelExport: React.FC<any> = () => {
  const { allEvents, users, sports } = useStoreState<any>((state) => state);

  const [filterSport, setFilterSport] = useState('all');
  const [attendanceStatus, setAttendanceStatus] = useState('all');

  const [filterCourse, setFilterCourse] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  useEffect(() => setFilterBranch("all"), [filterCourse])

  const getBranchCourse = (selectedCourse: any) => {
    switch (selectedCourse) {
      case 'b_tech':
      case 'm_tech':
        return BRANCH;
      case 'mca':
        return M_COMPUTER_APPLICATION;
      case 'bca':
        return B_COMPUTER_APPLICATION;
      case 'bba':
        return B_BUSINESS_ADMINISTRATION;
      case 'mba':
        return M_BUSINESS_ADMINISTRATION;
      case 'b_arch':
        return ARCHITECTURE;
      default:
        return [];
    }
  }

  const objectifiedUsers: any = {};
  users.forEach((user: any) => { objectifiedUsers[user._id] = user; });

  const eventList = allEvents
    .map((event: any) => ({ ...event, user: objectifiedUsers[event.userId] }))
    .filter((event: any) => filterSport === event?.sportId?._id || filterSport === 'all')
    .filter((event: any) => attendanceStatus === event?.attendance || attendanceStatus === 'all')
    .map(({
      attendance,
      position,
      user,
      sportId: { sportName, sportType }
    }: any) => {
      const { jerseyNo, fullName, universityRoll, branch, course, gender, email, phoneNumber } = user || {};
      return {
        jerseyNo,
        fullName,
        universityRoll,
        branch: mapValue("BRANCH", branch),
        course,
        gender,
        email,
        phoneNumber,
        eventAttendance: attendance,
        eventPosition: position,
        sportName,
        sportType,
        empty: ""
      }
    })
    .sort((a: any, b: any) => a?.jerseyNo - b?.jerseyNo);

  const departmentList = users
    .map((user: any) => ({ ...user }))
    .filter((user: any) => filterCourse === user?.course || filterCourse === 'all')
    .filter((user: any) => filterBranch === user?.branch || filterBranch === 'all')
    .map((user: any) => {
      let participation = "";
      const userEvents = allEvents
        .filter((event: any) => event.userId === user._id)
        .filter((event: any) => event.attendance === "present")
      userEvents.forEach((event: any, index: number) => {
        participation += `${event.sportId.sportName}`;
        // if (event.attendance === "present") {
        //   participation += ` - ${mapValue("ATTENDANCE", event.attendance)}`;
        // }
        if (event.position) {
          participation += `(${mapValue("USER_RESULT", event.position)})`;
        }
        if (userEvents.length !== index + 1) {
          participation += ", "
        }
      });
      return { ...user, participation };
    })
    .map(({
      jerseyNo, fullName, universityRoll, branch, course, gender, email, phoneNumber, participation, year
    }: any) => ({
      jerseyNo,
      fullName,
      universityRoll,
      branch: mapValue("BRANCH", branch),
      year: mapValue("YEARS", year),
      course,
      gender,
      email,
      phoneNumber,
      participation,
      empty: ""
    }))
    .filter(({ participation }: any) => participation)
    .sort((a: any, b: any) => a?.jerseyNo - b?.jerseyNo);

  const currentSport = sports.filter((sport: any) => sport._id === filterSport);
  const sportName = currentSport?.[0]?.sportName || "All Sports";
  const genderCategory = currentSport?.[0]?.genderCategory || "All Genders";
  const currentAttendance = mapValue("ATTENDANCE", attendanceStatus) || "All Attendance";

  const currentBranch = mapValue("BRANCH", filterBranch) || "All Branches";
  const currentCourse = mapValue("COURSE", filterCourse) || "All Courses";

  const eventFileName = `${sportName} - ${currentAttendance} - ${mapValue("GENDER", genderCategory)}`;
  const departmentFileName = `${currentCourse} - ${currentBranch}`

  const eventFileLayout = [
    { label: "Jersey No.", value: "jerseyNo" },
    { label: "Name", value: "fullName" },
    { label: "Branch", value: "branch" },
    { label: "URN", value: "universityRoll" },
    { label: "Attendance", value: "empty" },
  ]

  const departmentFileLayout = [
    { label: "Name", value: "fullName" },
    { label: "URN", value: "universityRoll" },
    { label: "Year", value: "year" },
    { label: "Branch", value: "branch" },
    { label: "Participation", value: "participation" },
    { label: "Marks", value: "empty" },
  ]

  return (
    <IonGrid>

      <IonRow>
        <IonCol size="12">
          <IonTitle style={{ padding: 0 }}>Events List</IonTitle>
        </IonCol>
        <IonCol size="12">
          <IonItem>
            <IonSelect
              interface="alert"
              style={{ width: "100%", maxWidth: "100%" }}
              value={filterSport}
              onIonChange={(e) => setFilterSport(e.detail.value)}
            >
              <IonSelectOption value="all">All Sports</IonSelectOption>
              {sports.map(({ _id, sportName }: any) => (<IonSelectOption key={_id} value={_id}>{sportName}</IonSelectOption>))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect
              interface="alert"
              style={{ width: "100%", maxWidth: "100%" }}
              value={attendanceStatus}
              onIonChange={(e) => setAttendanceStatus(e.detail.value)}
            >
              <IonSelectOption value="all">All Attendance</IonSelectOption>
              {ATTENDANCE.map(({ title, value }: any) => (<IonSelectOption key={value} value={value}>{title}</IonSelectOption>))}
            </IonSelect>
          </IonItem>
          <Excel fileName={eventFileName} dataSet={eventList} dataLayout={eventFileLayout} />
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12">
          <IonTitle style={{ padding: 0 }}>Department List</IonTitle>
        </IonCol>
        <IonCol size="12">
          <IonItem>
            <IonSelect
              interface="alert"
              style={{ width: "100%", maxWidth: "100%" }}
              value={filterCourse}
              onIonChange={(e) => setFilterCourse(e.detail.value)}
            >
              <IonSelectOption value="all">All Courses</IonSelectOption>
              {COURSE.map(({ title, value }: any) => (<IonSelectOption key={value} value={value}>{title}</IonSelectOption>))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect
              interface="alert"
              style={{ width: "100%", maxWidth: "100%" }}
              value={filterBranch}
              onIonChange={(e) => setFilterBranch(e.detail.value)}
            >
              <IonSelectOption value="all">All Branches</IonSelectOption>
              {getBranchCourse(filterCourse).map(({ title, value }: any) => (<IonSelectOption key={value} value={value}>{title}</IonSelectOption>))}
            </IonSelect>
          </IonItem>
          <Excel fileName={departmentFileName} dataSet={departmentList} dataLayout={departmentFileLayout} />
        </IonCol>
      </IonRow>

    </IonGrid>
  );
};
