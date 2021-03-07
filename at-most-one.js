import { define } from 'xtal-element/lib/define.js';
import { letThereBeProps } from 'xtal-element/lib/letThereBeProps.js';
import { getSlicedPropDefs } from 'xtal-element/lib/getSlicedPropDefs.js';
import { hydrate } from 'xtal-element/lib/hydrate.js';
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
export class AtMostOne extends HTMLElement {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
        this.self = this;
    }
    get attribute() {
        return this._attribute;
    }
    set attribute(nv) {
        this._attribute = nv;
        linkMutObserver(this);
    }
    disconnectedCallback() {
        this.disconnectObserver();
    }
    disconnectObserver() {
        if (this.mutObserver !== undefined)
            this.mutObserver.disconnect();
    }
    connectedCallback() {
        hydrate(this, slicedPropDefs, {});
    }
    onPropChange(name, prop, newVal) {
        //this.reactor.addToQueue(prop, newVal)
    }
}
AtMostOne.is = 'at-most-one';
const propDefMap = {
    attribute: {
        type: String
    }
};
const slicedPropDefs = getSlicedPropDefs(propDefMap);
letThereBeProps(AtMostOne, slicedPropDefs, 'onPropChange');
define(AtMostOne);
