import { useEffect } from 'react';
import Axios from 'axios';
import { useStoreActions } from 'easy-peasy';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { Menu } from './components';
import { Auth, Dashboard, AdminDashboard } from './pages';
import { API } from './constants';
import { ENV } from './environment';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './styles/index.scss';

Axios.defaults.baseURL = ENV.API_ENDPOINT;
Axios.defaults.headers.post['Content-Type'] = 'application/json';

const App: React.FC = () => {
  const storeSports = useStoreActions<any>((actions) => actions.storeSports);
  useEffect(() => {
    Axios.get(API.GET_SPORTS)
      .then(result => storeSports(result.data))
      .catch(() => { });
  }, []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true} component={() => (<Redirect to="/signup" />)} />
            <Route path="/login" component={(props: any) => <Auth {...props} isLogin />} />
            <Route path="/signup" component={(props: any) => <Auth {...props} />} />
            <Route path="/dashboard/:page?" component={(props: any) => <Dashboard {...props} />} />
            <Route path="/admin/:page?" component={(props: any) => <AdminDashboard {...props} />} />
            <Redirect to="/login" />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
