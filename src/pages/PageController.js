import React, { Component } from 'react';

// External pages
import Home from './external/Home';
import Calendar from './external/Calendar';
import Contact from './external/Contact';
import ApplyForMembership from './external/ApplyForMembership';
import RequiresLogin from './RequiresLogin';

// Internal pages
import Information from './internal/Information';
import InternalCalendar from './internal/Calendar';
import Documents from './internal/Documents';
import Members from './internal/Members';

export default class PageController {
    constructor(loggedIn, user) {
        this.loggedIn = loggedIn;
        this.user = user;

        // Internal Pages
        this.InformationPage = this.InformationPage.bind(this);
        this.InternalCalendarPage = this.InternalCalendarPage.bind(this);
        this.DocumentsPage = this.DocumentsPage.bind(this);
        this.MembersPage = this.MembersPage.bind(this);
        // External Pages
        this.HomePage = this.HomePage.bind(this);
        this.CalendarPage = this.CalendarPage.bind(this);
        this.ContactPage = this.ContactPage.bind(this);
        this.ApplyForMembershipPage = this.ApplyForMembershipPage.bind(this);
    }

    loggedIn = false;
    user = null;

    // Internal pages
    InformationPage() {
        return this.loggedIn 
            ? (<Information loggedIn={this.loggedIn} user={this.user} />)
            : (<RequiresLogin />);
    }
    InternalCalendarPage() {
        return this.loggedIn 
            ? (<InternalCalendar loggedIn={this.loggedIn} user={this.user} />)
            : (<RequiresLogin />);
    }
    DocumentsPage() {
        return this.loggedIn 
            ? (<Documents loggedIn={this.loggedIn} user={this.user} />)
            : (<RequiresLogin />);
    }
    MembersPage() {
        return this.loggedIn 
            ? (<Members loggedIn={this.loggedIn} user={this.user} />)
            : (<RequiresLogin />);
    }

    // External pages
    HomePage() {
        return (
            <Home loggedIn={this.loggedIn} user={this.user} />
        );
    }
    CalendarPage() {
        return (
            <Calendar loggedIn={this.loggedIn} user={this.user} />
        );
    }
    ContactPage() {
        return (
            <Contact loggedIn={this.loggedIn} user={this.user} />
        );
    }
    ApplyForMembershipPage() {
        return (
            <ApplyForMembership loggedIn={this.loggedIn} user={this.user} />
        );
    }
}