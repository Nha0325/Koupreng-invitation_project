import { useBackendMessages } from "./useBackendMessages";

export function useT() {
    const { text: nav } = useBackendMessages("nav");
    const { text: auth } = useBackendMessages("authUI");
    const { text: common } = useBackendMessages("common");
    const createProxy = (textFn) => new Proxy(textFn, {
        get: (target, prop) => {
            if (prop in target) return target[prop];
            return typeof prop === 'string' ? textFn(prop) : undefined;
        }
    });

    return { 
        nav: createProxy(nav), 
        auth: createProxy(auth), 
        common: createProxy(common) 
    };
}
