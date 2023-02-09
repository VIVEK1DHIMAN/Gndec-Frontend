import React from "react";
import {
  IonIcon,
} from "@ionic/react";
import { female, male } from "ionicons/icons";
import { GENDER } from "../constants";

export const GenderIcon: React.FC<any> = ({ gender, slot }) => {
  const isMale = gender === GENDER[1].value
  return (
    isMale ? (
      <IonIcon title="Male" color="tertiary" icon={male} slot={slot} />
    ) : (
      <IonIcon title="Female" color="pink" icon={female} slot={slot} />
    )
  );
};
