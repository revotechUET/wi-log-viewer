import {BehaviorSubject} from 'rxjs';

export default class DataFlow {
    constructor(init) {
        this.dataObsv = new BehaviorSubject(init);
    }

    getDataFlow() {
        return this.dataObsv;
    }
    putData(value) {
        this.dataObsv.next(value);
    }
    getDataValue() {
        return this.dataObsv.getValue();
    }
}