import React, { useMemo, useState } from "react";
import { IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonRow, IonSelect, IonSelectOption, IonCheckbox, useIonToast, useIonAlert } from "@ionic/react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { SPORT_TYPE, mapValue, GENDER, mergeSearch, API } from "../../constants";
import { accessibility, americanFootball, female, male, megaphone } from "ionicons/icons";
import Axios from "axios";
import { countBy } from "lodash";

export const SportsList: React.FC<any> = () => {
  const [showAlert] = useIonAlert();
  const [showToast] = useIonToast();
  const sports = useStoreState<any>(({ sports }) => sports);
  const allEvents = useStoreState<any>(({ allEvents }) => allEvents);
  const storeSports = useStoreActions<any>((actions) => actions.storeSports);
  const auth = useStoreState<any>(({ auth }) => auth);
  const [filterSportType, setFilterSportType] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);

  const sportsFiltered = sports.filter((sport: any) => {
    const isGender = filterGender === "all" || filterGender === sport.genderCategory;
    const isSportType = filterSportType === "all" || filterSportType === sport.sportType;
    return isGender && isSportType;
  });

  const getSports = () => {
    Axios.get(API.GET_SPORTS)
      .then(result => {
        setLoading(true);
        storeSports(result.data)
      })
      .catch(() => { })
      .finally(() => {
        setLoading(false);
      });;
  }

  const toggleSport = (sportId: string, isActive: boolean) => {
    setLoading(true);
    Axios.post(API.TOGGLE_SPORT, { sportId, isActive })
      .then(() => {
        showToast('Sport status updated successfully!', 3000);
        getSports();
      })
      .catch((error) => {
        console.log(error)
        showToast('Error deleting event', 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const countSportIds: any = useMemo(() => allEvents.map((event: any) => (event?.sportId?._id)), [allEvents]);
  const countSportIdsObject = useMemo(() => countBy(countSportIds), [countSportIds]);
  return (
    <>
      <IonLoading
        isOpen={loading}
        message={'Please wait...'}
      />
      <IonGrid>
        <IonRow>
          <IonCol sizeXl="8" sizeLg="6" sizeSm="12" sizeXs="12">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonSelect
                    interface="alert"
                    value={filterSportType}
                    onIonChange={(e) => setFilterSportType(e.detail.value)}
                  >
                    <IonSelectOption value="all">All</IonSelectOption>
                    {SPORT_TYPE.map(({ title, value }) => (<IonSelectOption key={value} value={value}>{title}</IonSelectOption>))}
                  </IonSelect>
                </IonCol>
                <IonCol>
                  <IonSelect
                    interface="alert"
                    value={filterGender}
                    onIonChange={(e) => setFilterGender(e.detail.value)}
                  >
                    <IonSelectOption value="all">All</IonSelectOption>
                    {GENDER.map(({ title, value }) => (<IonSelectOption key={value} value={value}>{title}</IonSelectOption>))}
                  </IonSelect>
                </IonCol>
              </IonRow>
            </IonGrid>
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
        <IonRow>
          {mergeSearch({
            data: sportsFiltered,
            search,
            options: { keys: ["sportName", "sportType", "genderCategory"] }
          })
            .map((sport: any) => {
              const color = sport.isSearched ? "light" : "";
              const isMale = sport.genderCategory === GENDER[1].value
              return (
                <IonCol key={sport._id} sizeXl="4" sizeLg="6" sizeMd="6" sizeSm="12" size="12">
                  <IonCard color={color}>
                    <IonCardContent color={color}>
                      <IonItem color={color} lines="none">
                        <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={americanFootball} />
                        <IonLabel >
                          {sport.sportName}
                        </IonLabel>
                      </IonItem>
                      <IonItem color={color} lines="none">
                        <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={megaphone} />
                        <IonLabel >
                          {mapValue("SPORT_TYPE", sport.sportType)}
                        </IonLabel>
                      </IonItem>
                      <IonItem color={color} lines="none">
                        <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={sport.genderCategory === GENDER[1].value ? male : female} />
                        <IonLabel >
                          {sport.genderCategory}
                        </IonLabel>
                      </IonItem>
                      <IonItem color={color} lines="none">
                        <IonIcon color={isMale ? "tertiary" : "pink"} slot="start" icon={accessibility} />
                        <IonLabel >
                          {countSportIdsObject[sport._id] || 0} Users
                        </IonLabel>
                        {[1].includes(auth?.user?.adminLevel) &&
                          <IonCheckbox slot="end" checked={sport.isActive}
                            onClick={() => {
                              showAlert(`${!sport.isActive ? "Enable" : "Disable"} ${sport.sportName}`, [
                                { text: "Yes", handler: () => toggleSport(sport._id, !sport.isActive) },
                                { text: "No", handler: () => getSports() }
                              ])
                            }} />}
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              )
            })}
        </IonRow>
      </IonGrid>
    </>
  );
};




