import { fromEvent } from "rxjs";

let clickStream = fromEvent(document, 'click');

export default clickStream;