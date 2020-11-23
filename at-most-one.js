import { define, XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
export const linkMutObserver = ({ attribute, self }) => {
    self.disconnectObserver();
    if (attribute === undefined)
        return;
    const config = {
        subtree: true,
        attributeFilter: [attribute]
    };
    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            const eTarget = mutation.target;
            if (eTarget === undefined)
                continue;
            if (self.selectedNode === eTarget)
                return;
            if (!eTarget.hasAttribute(attribute))
                return;
            if (self.selectedNode !== undefined) {
                self.selectedNode.removeAttribute(attribute);
            }
            self.selectedNode = eTarget;
        }
    });
    observer.observe(self, config);
    self.mutObserver = observer;
};
const propActions = [linkMutObserver];
export class AtMostOne extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
    }
    disconnectedCallback() {
        this.disconnectObserver();
    }
    disconnectObserver() {
        if (this.mutObserver !== undefined)
            this.mutObserver.disconnect();
    }
}
AtMostOne.is = 'at-most-one';
AtMostOne.attributeProps = ({ attribute }) => ({
    str: [attribute],
    reflect: [attribute]
});
define(AtMostOne);
