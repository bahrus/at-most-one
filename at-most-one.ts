import {define, AttributeProps, XtallatX} from 'xtal-element/xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js';


export const watchAttrib = ({attribute, self}: AtMostOne) => {
    self.disconnectAttrObservers();
    if(attribute === undefined) return;
    const config : MutationObserverInit = {
        childList: true,
    };
    const childObserver = new MutationObserver((mutationList, observer) => {
        for(const mutation of mutationList){
            self.nodesToMonitor = mutation.addedNodes;
        }
    });
    childObserver.observe(self, config);
    self.nodesToMonitor = self.childNodes;
    self.childObservers = childObserver;
}

export const addAttribMutObserver = ({attribute, self, nodesToMonitor}: AtMostOne) => {
    if(nodesToMonitor === undefined || attribute === undefined) return;
    const attribConfig: MutationObserverInit = {
        attributeFilter: [attribute],
    };
    nodesToMonitor.forEach(node => {
        const attrObserver = new MutationObserver((attrMutationList, attrObserver) =>{
            for(const attrMutation of attrMutationList){
                const target = attrMutation.target as HTMLElement;
                if(self.selectedNode === target) continue;
                if(!target.hasAttribute(attribute)) continue;
                if(self.selectedNode !== undefined){
                   (self.selectedNode as HTMLElement).removeAttribute(attribute);
                }
                self.selectedNode = target;
            }
        });
        attrObserver.observe(node, attribConfig);
    });
    self.nodesToMonitor = undefined;
}

const propActions = [watchAttrib, addAttribMutObserver];



export class AtMostOne extends XtallatX(hydrate(HTMLElement)) {

    static is = 'at-most-one';

    static attributeProps = ({attribute, nodesToMonitor}: AtMostOne) => ({
        str: [attribute],
        obj:  [nodesToMonitor],
        reflect: [attribute]
    } as AttributeProps);

    propActions = propActions;

    attribute: string | undefined;

    attrObservers = new WeakMap<Node, MutationObserver>();

    childObservers : MutationObserver | undefined;

    nodesToMonitor: NodeList | undefined;

    disconnectedCallback(){
        this.disconnectAttrObservers();
        if(this.childObservers !== undefined) this.childObservers.disconnect();
    }

    disconnectAttrObservers(){
        Array.from(this.childNodes).forEach(node => {
            var observer = this.attrObservers.get(node);
            if(observer !== undefined) observer.disconnect();
        })
    }

    selectedNode: Node | undefined;
}

define(AtMostOne);
