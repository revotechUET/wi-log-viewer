let BehaviorSubject = require('rxjs').BehaviorSubject;
let dataObsv = new BehaviorSubject([]);


module.exports = {
    getDataFlow: function() {
        return dataObsv;
    },
    putData: function(value) {
        dataObsv.next(value);
    },
    getDataValue: function() {
        return dataObsv.getValue().value
    }
}