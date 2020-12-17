import { Component, ViewChild } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-observable-mergemap';

  //inner observable
  srcObservable = of(1, 2, 3, 4)
  innerObservable = of('A', 'B', 'C', 'D')
  obs = of(1, 2, 3, 4)

  ngOnInit() {
    this.srcObservable.pipe(
      mergeMap(val => {
        console.log('Source value ' + val)
        console.log('starting new observable')
        return this.innerObservable
      })
    )
      .subscribe(ret => {
        console.log('Recd ' + ret);
      })

    this.obs.pipe(
      mergeMap(val => {
        return of(val * 2)  //Returning observable
      })
    )
      .subscribe(ret => {
        console.log('Recd from mergeMap : ' + ret);
      })
  }

  //button example
  count = 0;
  @ViewChild('btn', { static: true }) button;
  clicks$: Observable<any>;

  ngAfterViewInit() {
    this.clicks$ = fromEvent(this.button.nativeElement, 'click');
    this.mergeMapExample();
  }

  delayedObs(count: number) {
    return new Observable((observer) => {
      setTimeout(() => { observer.next(count + " A") }, 1000);
      setTimeout(() => { observer.next(count + " B") }, 2000);
      setTimeout(() => { observer.next(count + " C") }, 3000);
      setTimeout(() => { observer.next(count + " D") }, 4000);
      setTimeout(() => { observer.next(count + " E"); observer.complete() }, 5000);
    })
  }
  mergeMapExample() {

    let obs =
      this.clicks$
        .pipe(
          mergeMap(() => {
            this.count = this.count + 1;
            return this.delayedObs(this.count)
          })
        )
        .subscribe(val => console.log(val));
  }

}
