import {define, AttributeProps, XtallatX} from 'xtal-element/xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js';

export const linkMutObserver = ({attribute, self}: AtMostOne) => {
    self.disconnectObserver();
    if(attribute === undefined) return;
    const config = {
        subtree: true,
        attributeFilter: [attribute]
    } as MutationObserverInit;
    const observer = new MutationObserver((mutationList, observer) => {
        for(const mutation of mutationList){
            const eTarget = mutation.target as HTMLElement
            if(eTarget === undefined) continue;
            if(self.selectedNode === eTarget) return;
            if(!eTarget.hasAttribute(attribute)) return;
            if(self.selectedNode !== undefined){
                self.selectedNode.removeAttribute(attribute);
            }
            self.selectedNode = eTarget;
        }
    });
    observer.observe(self, config);
    self.mutObserver = observer;
}

const propActions = [linkMutObserver];

export class AtMostOne extends XtallatX(hydrate(HTMLElement)) {

    static is = 'at-most-one';

    static attributeProps = ({attribute}: AtMostOne) => ({
        str: [attribute],
        reflect: [attribute]
    } as AttributeProps);

    propActions = propActions;

    attribute: string | undefined;

    mutObserver : MutationObserver | undefined;

    disconnectedCallback(){
        this.disconnectObserver();
    }

    disconnectObserver(){
        if(this.mutObserver !== undefined) this.mutObserver.disconnect();
    }

    selectedNode: HTMLElement | undefined;
}

define(AtMostOne);
