import React from "react";
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { ConstantData } from "../constants";

interface IProps {
  title?: string,
  value: string,
  error?: string
  onChange: Function,
  data: ConstantData[],
}

export const IonSelectNew: React.FC<IProps> = ({ title, value, onChange, data, error }) => {
  return (
    <>
      <IonItem>
        <IonLabel position='floating'>{title}</IonLabel>
        <IonSelect
          interface="alert"
          value={value}
          onIonChange={(e) => onChange(e.detail.value)}
        >
          {data.map(({ title, value }) => (<IonSelectOption key={value} value={value}>{title}</IonSelectOption>))}
        </IonSelect>
      </IonItem>
      <IonText color="danger">{error}</IonText>
    </>
  );
};
