import {PropAction, PropDef, PropDefMap} from 'xtal-element/types.d.js';
import {define} from 'xtal-element/lib/define.js';
import {letThereBeProps} from 'xtal-element/lib/letThereBeProps.js';
import {getSlicedPropDefs} from 'xtal-element/lib/getSlicedPropDefs.js';
import {hydrate} from 'xtal-element/lib/hydrate.js';
import {AtMostOneProps} from './types.d.js';


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

const propActions = [linkMutObserver] as PropAction[];

export class AtMostOne extends HTMLElement {

    static is = 'at-most-one';

    propActions = propActions;

    //reactor = new Reactor(this);

    _attribute: string | undefined;
    get attribute(){
        return this._attribute;
    }
    set attribute(nv){
        this._attribute = nv;
        linkMutObserver(this);
    }

    mutObserver : MutationObserver | undefined;

    self = this;

    disconnectedCallback(){
        this.disconnectObserver();
    }

    disconnectObserver(){
        if(this.mutObserver !== undefined) this.mutObserver.disconnect();
    }

    connectedCallback(){
        hydrate<AtMostOneProps>(this, slicedPropDefs, {});
    }

    onPropChange(name: string, prop: PropDef, newVal: any){
        //this.reactor.addToQueue(prop, newVal)
    }

    selectedNode: HTMLElement | undefined;
}

const propDefMap: PropDefMap<AtMostOne> = {
    attribute: {
        type: String
    }
}
    
const slicedPropDefs = getSlicedPropDefs(propDefMap);
letThereBeProps(AtMostOne, slicedPropDefs, 'onPropChange');
define(AtMostOne);
declare global {
    interface HTMLElementTagNameMap {
        "at-most-one": AtMostOne,
    }
}
