import React, { useEffect, useState } from "react";
import { Login, Signup } from "../components/Auth";
import Axios from "axios";
import { IonCol, IonGrid, IonLoading, IonRow, useIonRouter, useIonToast } from "@ionic/react";
import { API, REGEX } from "../constants";
import { isEmpty } from "lodash";
import { useStoreActions, useStoreState } from 'easy-peasy';
import { PageLayout } from './Page';
import { SignupData } from "../interfaces";

export const Auth: React.FC<any> = ({ isLogin = false }) => {
  const router = useIonRouter();
  const [showToast] = useIonToast();
  const storeUserData = useStoreActions<any>((actions) => actions.storeUserData);
  const auth = useStoreState<any>(({ auth }) => auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEmpty(auth.token)) {
      router.push("/dashboard", "none", "replace");
    }
  }, [])

  const signup = (userData: SignupData) => {
    const errors = validateData(userData);
    if (!isEmpty(errors)) {
      return errors;
    }
    setLoading(true);
    Axios.post(API.SIGNUP, userData)
      .then(result => {
        router.push("/login", "none", "replace")
        showToast(`You can now login, but you will have to verify your account to enroll in events.`, 10000)
      })
      .catch((e) => {
        switch (e?.response?.data?.message) {
          case "DATA_MISSING":
            showToast("Incorrect password", 10000);
            break;
          case "EMAIL_ALREADY_USED":
            showToast("Email already in use!", 10000);
            break;
          case "URN_ALREADY_USED":
            showToast("University Roll Number already in use!", 10000);
            break;
          default:
            showToast("Please fill your correct information and try again!", 3000)
        }
      })
      .finally(() => {
        setLoading(false);
        return {};
      });
  };

  const login = (userData: object) => {
    setLoading(true);
    Axios.post(API.LOGIN, userData)
      .then(({ data }) => {
        storeUserData({ user: data.user, token: data.token })
        if (data.user.isAdmin) {
          router.push("/admin", "none", "replace");
        } else {
          router.push("/dashboard", "none", "replace");
        }
        if (!data.user.isVerified) {
          showToast("Now login to the app and follow further instructions", 10000)
        }
      })
      .catch((e) => {
        switch (e?.response?.data?.message || e?.message) {
          case "INCORRECT_PASSWORD":
            showToast("Incorrect password", 10000);
            break;
          case "USER_NOT_FOUND":
            showToast("User not found, Sign up!", 10000);
            break;
          case "Network Error":
            alert("Please check your internet connection!");
            break;
          default:
            showToast("Please fill contact us form!", 5000)
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateData = (userData: SignupData) => {
    const error: any = {};
    const { fullName, email, universityRoll, phoneNumber, password, course, branch, year, gender } = userData;
    if (!fullName) {
      error.fullName = "Please enter your name"
    }
    if (!REGEX.EMAIL.test(email)) {
      error.email = "Please use GNDEC college Email"
    }
    if (!REGEX.UNIVERSITY_NO.test(universityRoll)) {
      error.universityRoll = "Please enter valid 7 digit University Roll Number"
    }
    if (!REGEX.PHONE_NUMBER.test(phoneNumber)) {
      error.phoneNumber = "Please enter valid Phone Number"
    }
    if (!REGEX.PASSWORD.test(password)) {
      error.password = "Password must be 8-25 characters long"
    }
    if (!course) {
      error.course = "Please select your Course"
    }
    if (!branch) {
      error.branch = "Please select your Branch"
    }
    if (!year) {
      error.year = "Choose your Year"
    }
    if (!gender) {
      error.gender = "Please select your Gender"
    }
    return error;
  }

  return (
    <PageLayout className="auth">
      <IonLoading
        isOpen={loading}
        message={'Hold on... Enjoy the wheater meanwhile!'}
      />
      <IonGrid className="form-grid">
        <IonRow className="form-container ion-align-items-center ion-justify-content-center">
          <IonCol>
            {isLogin ?
              (<Login onSubmit={login} loading={loading} />)
              : (<Signup onSubmit={signup} loading={loading} />)}
          </IonCol>
        </IonRow>
      </IonGrid>
    </PageLayout>
  );
};
