import React, { Component } from 'react';
import { Route, NavLink, BrowserRouter } from 'react-router-dom';
import Home from './Official/Home';
import Calendar from './Official/Calendar';
import Contact from './Official/Contact';
import ApplyForMembership from './Official/ApplyForMembership';
import Authentication from './components/Authentication';
//import { Editor } from '@tinymce/tinymce-react';

class Main extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <h1>Välkommen till KFUM Voxette!</h1>
                    <ul className="menu">
                        <li><NavLink exact to="/">Hem</NavLink></li>
                        <li><NavLink to="/kalender">Kalender</NavLink></li>
                        <li><NavLink to="/kontakt">Kontakt</NavLink></li>
                        <li><NavLink to="/ansokan">Ansökan</NavLink></li>
                        <li><Authentication /></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route path="/kalender" component={Calendar}/>
                        <Route path="/kontakt" component={Contact}/>
                        <Route path="/ansokan" component={ApplyForMembership}/>
                    </div>
                </div>				
            </BrowserRouter>
        );
    }
}

export default Main;