import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonModal,
  useIonRouter,
} from "@ionic/react";

export const Login: React.FC<any> = ({ onSubmit }) => {
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instructionModal, setInstructionModal] = useState(false);

  return (
    <>
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
      <div className="card-container">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Login</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <form method="post" onSubmit={(e) => { e.preventDefault(); onSubmit({ email: email.trim(), password }) }}>
              <IonItem>
                <IonInput
                  type="email"
                  placeholder="Email"
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  required
                  value={email}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  type="password"
                  placeholder="Password"
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  required
                  value={password}
                ></IonInput>
              </IonItem>
              <IonButton
                type="submit"
                className="item-text-wrap"
                color="primary"
                expand="full"
                shape="round"
              >
                Login
              </IonButton>
              <IonButton
                onClick={() => router.push('/signup')}
                buttonType="clear"
                color="secondary"
                expand="block"
                className="item-text-wrap"
                style={{ textDecoration: "underline" }}
              >
                Don't have account? Signup!
              </IonButton>
            </form>

          </IonCardContent>
        </IonCard>
        <IonCard slot="end">
          <IonCardHeader>
            <IonCardTitle>Important Links</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonButton size="small" color="danger" expand="block" href="https://mail.gndec.ac.in" target="_blank" rel="noreferrer"> Go to mail.gndec.ac.in</IonButton>
            <IonButton size="small" color="danger" expand="block" href="https://forms.gle/cJYcxvhAH1eR3NGcA" target="_blank" rel="noreferrer"> Need help? Click here to contact!</IonButton>
            <IonButton
              expand="block"
              onClick={() => setInstructionModal(true)}
              color="danger"
              size="small"
            >
              Issues with Verification Email!
            </IonButton>
          </IonCardContent>
        </IonCard>
      </div>
    </>
  );
};
