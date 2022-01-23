import { convertToRenderLocation, CustomElement, ICustomElementController, CustomElementDefinition, ViewFactory } from "@aurelia/runtime-html";
import { Scope } from '@aurelia/runtime';
import { LifecycleFlags } from "aurelia";

export class MyApp {
  public messages: HTMLDivElement;

  private observer: MutationObserver;
  public readonly $controller!: ICustomElementController<this>;

  attached() {
    const config = { attributes: true, childList: true, characterData: true };  
    this.observer = new MutationObserver((muts) => {
      muts.forEach(mut => {
        mut.addedNodes.forEach(async (node) => {
          this.observer.disconnect();

          if (node.nodeType === Node.ELEMENT_NODE) {
            const controller = this.$controller;
            const loc = convertToRenderLocation(node);
            const ceDfn = CustomElementDefinition.create({
              name: CustomElement.generateName(),
              template: node,
            });
            const factory = new ViewFactory(this.$controller.container, ceDfn);
            const view = factory.create(controller).setLocation(loc);

            await view.activate(
              view,
              controller,
              LifecycleFlags.none,
              Scope.create({})
            );

            this.observer.observe(this.messages, config);
          }
        })
      });
    });

    this.observer.observe(this.messages, config);
  }

  detaching() {
    this.observer.disconnect();
  }
}
