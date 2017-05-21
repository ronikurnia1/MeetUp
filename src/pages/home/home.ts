import { Component } from '@angular/core';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    menus: any[] = [
        {
            title: "Profile"
        },
        {
            title: "Technologies"
        },
        {
            title: "Meetings"
        },
        {
            title: "Favorites"
        },
        {
            title: "Agenda"
        },
        {
            title: "Notifications"
        },
        {
            title: "Announcements"
        },
        {
            title: "Chat"
        },
        {
            title: "Venue"
        },
        {
            title: "Logout"
        }
    ];

    constructor() {

    }
}