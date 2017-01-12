export class People {
    constructor(
        public avatar: string,
        public fullName: string,
        public company: string,
        public country?: string,
        public title?: string) { }
}