import React, {useContext} from 'react';
import Auth from "./components/Auth";
import {AuthContext} from "./components/context/auth-context";
import Ingredients from "./components/Ingredients/Ingredients";


const App = props => {

  const appContext = useContext(AuthContext);

  let content = <Auth/>

  if(appContext.isAuth) {
    content = <Ingredients/>
  }
  return content;
};

export default App;
