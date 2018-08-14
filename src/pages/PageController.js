import React from 'react';
import RequiresLogin from './RequiresLogin';

// External pages
import Home from './external/Home';
import Calendar from './external/Calendar';
import Contact from './external/Contact';
import ApplyForMembership from './external/ApplyForMembership';
import Conductor from './external/Conductor';
import GDPR from './external/GDPR';

// Internal pages
import Information from './internal/Information';
import InternalCalendar from './internal/Calendar';
import Documents from './internal/Documents';
import File from './internal/File';
import Members from './internal/Members';
import Member from './internal/Member';

export default class PageController {
    constructor(loggedIn, user) {
        this.loggedIn = loggedIn;
        this.user = user;

        // Internal Pages
        this.InformationPage = this.InformationPage.bind(this);
        this.InternalCalendarPage = this.InternalCalendarPage.bind(this);
        this.DocumentsPage = this.DocumentsPage.bind(this);
        this.FilePage = this.FilePage.bind(this);
        this.MembersPage = this.MembersPage.bind(this);
        this.MemberPage = this.MemberPage.bind(this);
        this.Conductor = this.Conductor.bind(this);
        // External Pages
        this.HomePage = this.HomePage.bind(this);
        this.CalendarPage = this.CalendarPage.bind(this);
        this.ContactPage = this.ContactPage.bind(this);
        this.ApplyForMembershipPage = this.ApplyForMembershipPage.bind(this);
        this.GDPR = this.GDPR.bind(this);
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
    FilePage(options) {
        return this.loggedIn 
            ? (<File user={this.user} fullPath={options.match.params.fullPath} />)
            : (<RequiresLogin />);
    }
    MembersPage() {
        return this.loggedIn 
            ? (<Members loggedIn={this.loggedIn} user={this.user} />)
            : (<RequiresLogin />);
    }
    MemberPage(options) {
        return this.loggedIn 
            ? (<Member user={this.user} memberId={options.match.params.memberId} />)
            : (<RequiresLogin />);
    }

    // External pages
    HomePage() {
        return (
            <Home />
        );
    }
    CalendarPage() {
        return (
            <Calendar />
        );
    }
    ContactPage() {
        return (
            <Contact />
        );
    }
    ApplyForMembershipPage() {
        return (
            <ApplyForMembership />
        );
    }
    Conductor() {
        return (
            <Conductor />
        );
    }
    GDPR() {
        return (
            <GDPR />
        )
    }
}