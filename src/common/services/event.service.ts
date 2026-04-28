import { Injectable } from '@nestjs/common';
import { Subject, Observable, interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class EventService {
  private eventSubject = new Subject<string>();
  // 发送事件
  emit(message: string) {
    this.eventSubject.next(message);
  }
  // 获取事件流的 Observable
  getEvents(): Observable<string> {
    return this.eventSubject.asObservable();
  }
  generateTimedMessages(): Observable<string> {
    return interval(1000).pipe(
      map((count) => `这是第${count + 1}条消息`),
      tap((message) => {
        console.log('推送消息：', message);
      }),
    );
  }
}
