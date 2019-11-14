import {Observable} from 'rxjs';

export function findFilteredDataFn(observable) {
    return new Observable(observer => {
    // this function will called each time this
    // Observable is subscribed to.
        const subscription = observable.subscribe({
            next: function (value) {
                observer.next({
                    type: value[0].type,
                    value: value[0].value.filter((e) => JSON.stringify(e).toLowerCase().includes(value[1].toLowerCase()))
                });
            },
            error: function (err) {
                observer.error(err);
            },
            complete: function () {
                observer.complete();
            }
        });
    // the return value is the teardown function,
    // which will be invoked when the new
    // Observable is unsubscribed from.
        return () => {
            subscription.unsubscribe();
        }
    });
}

export function createFilterFunction(functions) {
    return new Observable(observer => {
        // this function will called each time this
        // Observable is subscribed to.
        const subscription = observable.subscribe({
            next: function (value) {
                if (functions.next) {
                    observer.next(functions.next(value));
                } else {
                    observer.next(value);
                }
            },
            error: function (err) {
                if (functions.error) {
                    observer.error(functions.error(value));
                } else {
                    observer.error(value);
                }
            },
            complete: function () {
                if (functions.complete) {
                    functions.complete(observer);
                } else {
                    observer.complete();
                }
            }
        });
        // the return value is the teardown function,
        // which will be invoked when the new
        // Observable is unsubscribed from.
        return () => {
            subscription.unsubscribe();
        }
    });
}


