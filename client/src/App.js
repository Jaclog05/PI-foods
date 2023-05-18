import React from 'react'
import { Route } from 'react-router-dom'
import CreateRecipe from './views/CreateRecipe/CreateRecipe.jsx'
import DetailsRecipe from './views/DetailsRecipe/DetailsRecipe.jsx'
import Home from './views/Home/Home.jsx'
import LandingPage from './views/LandingPage/LandingPage.jsx'
import NavBar from './components/NavBar/NavBar.jsx'

function App() {
  return (
      <React.Fragment>
            <NavBar />
            <Route exact path = '/' component = { LandingPage } />
            <Route path = '/home' component = { Home } />
            <Route path = '/create' component = { CreateRecipe } />
            <Route path = '/recipe/:id' render = {({match}) => <DetailsRecipe id={match.params.id} /> } />
      </React.Fragment>
  );
}

export default App;
