import { People } from "./people";

export class Meeting {
    public meetingWith: People;
    public isExpanded: boolean;
    constructor(
        public id: string,
        public subject: string,
        public type: string,
        public location: string,
        public date: Date,
        public time: string,
        meetWith: any,
        public remarks?: string) {
        if (meetWith) {
            this.meetingWith = new People(
                meetWith.avatar,
                meetWith.fullName,
                meetWith.company,
                meetWith.country,
                meetWith.title
            );
        }
    }
}
