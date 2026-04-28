import { Observable } from 'rxjs';
const observable = new Observable((subscriber) => {
  console.log('observable被订阅了');
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});
observable.subscribe({
  next: (value) => {
    console.log('收到数据', value);
  },
  error: (error) => {
    console.log('出错了', error);
  },
  complete: () => {
    console.log('所有数据都接收完成');
  },
});
