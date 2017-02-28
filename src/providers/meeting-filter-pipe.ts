import { Injectable, PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'meetingFilter',
  pure: false
})
@Injectable()
export class MeetingFilterPipe implements PipeTransform {
  transform(items: Array<any>, date: string): Array<any> {
    return items.filter(item => item.date === date);
  }
}


@Pipe({
  name: 'meetingStatusFilter',
  pure: false
})
@Injectable()
export class MeetingStatusFilterPipe implements PipeTransform {
  transform(items: Array<any>, status: string): Array<any> {
    return items.filter(item => item.meetingStatus.toLowerCase() === status || status === "all");
  }
}

