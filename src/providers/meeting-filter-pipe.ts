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
