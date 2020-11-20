import { define, XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
export const watchAttrib = ({ attribute, self }) => {
    self.disconnectAttrObservers();
    if (attribute === undefined)
        return;
    const config = {
        childList: true,
    };
    const childObserver = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            self.nodesToMonitor = mutation.addedNodes;
        }
    });
    childObserver.observe(self, config);
    self.nodesToMonitor = self.childNodes;
    self.childObservers = childObserver;
};
export const addAttribMutObserver = ({ attribute, self, nodesToMonitor }) => {
    if (nodesToMonitor === undefined || attribute === undefined)
        return;
    const attribConfig = {
        attributeFilter: [attribute],
    };
    nodesToMonitor.forEach(node => {
        const attrObserver = new MutationObserver((attrMutationList, attrObserver) => {
            for (const attrMutation of attrMutationList) {
                debugger;
            }
        });
        attrObserver.observe(node, attribConfig);
    });
    self.nodesToMonitor = undefined;
};
const propActions = [watchAttrib, addAttribMutObserver];
export class AtMostOne extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
        this.attrObservers = new WeakMap();
    }
    disconnectedCallback() {
        this.disconnectAttrObservers();
        if (this.childObservers !== undefined)
            this.childObservers.disconnect();
    }
    disconnectAttrObservers() {
        Array.from(this.childNodes).forEach(node => {
            var observer = this.attrObservers.get(node);
            if (observer !== undefined)
                observer.disconnect();
        });
    }
}
AtMostOne.is = 'at-most-one';
AtMostOne.attributeProps = ({ attribute, nodesToMonitor }) => ({
    str: [attribute],
    obj: [nodesToMonitor],
    reflect: [attribute]
});
define(AtMostOne);
//# sourceMappingURL=at-most-one.js.map