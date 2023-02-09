import React from "react";
import {
  IonInput,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";

export const IonInputNew: React.FC<any> = ({ type = "text", title, value, required, onChange, error }) => {
  return (
    <>
      <IonItem>
        <IonLabel position='floating'>{title}</IonLabel>
        <IonInput
          type={type}
          required={required}
          value={value}
          onIonChange={(e) => onChange(e.detail.value!)}
        ></IonInput>
      </IonItem>
      <IonText color="danger">{error}</IonText>
    </>
  );
};
