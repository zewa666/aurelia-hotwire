import { bindable } from "aurelia";

export class MyMessage {
    @bindable() ident;
    @bindable() title;
    @bindable() body;
}