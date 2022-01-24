import { convertToRenderLocation, CustomElement, ICustomElementController, CustomElementDefinition, ViewFactory, ISyntheticView } from "@aurelia/runtime-html";
import { Scope } from '@aurelia/runtime';
import { LifecycleFlags } from "aurelia";

export class MyApp {
  public messages: HTMLDivElement;
  public readonly $controller!: ICustomElementController<this>;
  
  private enhancedElements: Map<Node, ISyntheticView> = new Map();
  private observer: MutationObserver;

  attached() {
    const config = { attributes: true, childList: true, characterData: true };  
    this.observer = new MutationObserver((muts) => {
      muts.forEach(mut => {
        mut.removedNodes.forEach(async (node) => {
          this.observer.disconnect();
          if (mut.previousSibling?.nodeType === Node.COMMENT_NODE &&
            mut.nextSibling?.nodeType === Node.COMMENT_NODE) {
              (mut.previousSibling as CharacterData).remove();
              (mut.nextSibling as CharacterData).remove();
          }

          if (this.enhancedElements.has(node)) {
            const view = this.enhancedElements.get(node);
            await view.deactivate(view, this.$controller, LifecycleFlags.none)
            this.enhancedElements.delete(node);
          }

          this.observer.observe(this.messages, config);
        });
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

            this.enhancedElements.set(node, view);
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
