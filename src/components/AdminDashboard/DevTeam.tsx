import React from 'react';
import { IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonIcon, IonFabButton, IonGrid } from '@ionic/react';
import { logoInstagram, logoGithub, logoLinkedin } from 'ionicons/icons';

const DEV_TEAM = [
  {
    name: 'Vivek Dhiman',
    github: 'https://github.com/DHIMANvivek',
    linkedin: 'https://www.linkedin.com/in/vivek-dhiman01/',
    instagram: 'https://www.instagram.com/_vivek.dhiman_/',
    role: 'Full Stack Developer',
    image: 'https://avatars.githubusercontent.com/u/53940939?s=400&u=b8c675dcfb0654c1ae469c4b77962f8b7de73e7f&v=4',
  },
  {
    name: 'Vishal Maurya',
    github: 'https://github.com/VishalMauriya',
    linkedin: 'https://www.linkedin.com/in/vishal-mauriya/',
    instagram: 'https://www.instagram.com/_vishal79_/',
    role: 'Full Stack Developer',
    image: 'https://avatars.githubusercontent.com/u/54256792?v=4',
  },
  {
    name: 'Yatin Bindra',
    github: 'https://github.com/yatinbindra',
    linkedin: 'https://www.linkedin.com/in/yatin-b-a8b91b13a/',
    instagram: 'https://www.instagram.com/_yatin_bindra_/?next=%2F',
    role: 'Full Stack Developer',
    image: 'https://avatars.githubusercontent.com/u/54256553?v=4',
  },
]

export const DevTeam: React.FC = () => {
  return (
    <IonGrid>
      <IonRow>
        {DEV_TEAM.map((member) => (
          <IonCol key={member.name} sizeXl="4" sizeLg="6" sizeMd="6" sizeSm="6" size="12">
            <IonCard className="ion-activatable ripple-parent">
              <IonCardHeader>
                <IonItem color="transparent" lines="none" className="ion-justify-content-between">
                  <div style={{ "borderRadius": "500px", "height": "110px", "overflow": "hidden", "marginRight": "12px" }}>
                    <img style={{ "height": "110px" }} src={member.image} alt="person"></img>
                  </div>
                  <div>
                    <IonRow style={{ "flexDirection": "column" }} className="ion-justify-self-center">
                      <IonCardTitle style={{ "fontSize": "20px" }}>{member.name}</IonCardTitle>
                      <IonCardSubtitle style={{ "fontSize": "10px" }}>{member.role}</IonCardSubtitle>
                      <IonRow style={{ "marginTop": "8px" }}>
                        <IonFabButton target="_blank" href={member.github} color="dark" className="ion-social-btn" size="small" style={{ "margin": "2px 4px" }}>
                          <IonIcon icon={logoGithub} />
                        </IonFabButton>
                        {member.linkedin &&
                          (<IonFabButton target="_blank" href={member.linkedin} color="dark" className="ion-social-btn" size="small" style={{ "margin": "2px 4px" }}>
                            <IonIcon icon={logoLinkedin} />
                          </IonFabButton>)
                        }
                        {member.instagram &&
                          (
                            <IonFabButton target="_blank" href={member.instagram} color="dark" className="ion-social-btn" size="small" style={{ "margin": "2px 4px" }}>
                              <IonIcon icon={logoInstagram} />
                            </IonFabButton>
                          )}
                      </IonRow>
                    </IonRow>
                  </div>
                </IonItem>
              </IonCardHeader>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid >
  );
};
