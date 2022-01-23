import { bindable } from "aurelia";

export class MyMessage {
    @bindable() id;
    @bindable() title;
    @bindable() body;
}