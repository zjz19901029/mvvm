import Compile from './compile'
import observe from './observer'
/**
 * @class 双向绑定类 MVVM
 * @param {[type]} options [description]
 */
class MVVM {
    constructor(options){
        this.$options = options || {};
        let data = this._data = this.$options.data;

        Object.keys(data).forEach(key => {
            this._proxyData(key);
        });
        observe(data, this);
        new Compile(options.el || document.body, this);
    }

    /**
     * [属性代理]
     * @param  {[type]} key    [数据key]
     * @param  {[type]} setter [属性set]
     * @param  {[type]} getter [属性get]
     */
    _proxyData(key, setter, getter) {
        let self = this;
        setter = setter ||
            Object.defineProperty(self, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return self._data[key];
                },
                set: function proxySetter(newVal) {
                    self._data[key] = newVal;
                }
            })
    }

    $set(target, key, val){
        if (Array.isArray(target) && typeof key === 'number') {
            target.length = Math.max(target.length, key);
            target.splice(key, 1, val);
            return val;
        }
        if (hasOwn(target, key)) {
            target[key] = val;
            return val;
        }
        let ob = (target).__ob__;
        if (!ob) {
            target[key] = val;
            return val;
        }
        defineReactive$$1(ob.value, key, val);
        ob.dep.notify();
        return val;
    }

    $delete(target, key){
        if (Array.isArray(target) && typeof key === 'number') {
            target.splice(key, 1);
            return;
        }
        let ob = (target).__ob__;
        if (!hasOwn(target, key)) {
            return;
        }
        delete target[key];
        if (!ob) {
            return;
        }
        ob.dep.notify();
    }
}
window.observe = observe
window.MVVM = MVVM
export default MVVM