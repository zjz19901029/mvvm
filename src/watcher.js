import Sub from './sub'
/**
 * @class 观察类
 * @param {[type]}   vm      [vm对象]
 * @param {[type]}   expOrFn [属性表达式]
 * @param {Function} cb      [回调函数(一半用来做view动态更新)]
 */
class Watcher {
    constructor(vm, expOrFn, cb){
        this.vm = vm
        expOrFn = expOrFn.trim()
        this.expOrFn = expOrFn
        this.cb = cb
        this.subIds = {}

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        } else {
            this.getter = this.parseGetter(expOrFn)
        }
        this.value = this.getVal()
    }
    update() {
        this.run()
    }
    run() {
        let newVal = this.getVal()
        let oldVal = this.value
        if (newVal === oldVal) {
            return
        }
        this.value = newVal
        // 将newVal, oldVal挂载到MVVM实例上
        this.cb.call(this.vm, newVal, oldVal)
    }
    getVal() {
        Sub.target = this // 将当前订阅者指向自己
        let value = this.getter.call(this.vm, this.vm) // 触发getter，将自身添加到Sub中
        Sub.target = null // 添加完成 重置
        return value
    }
    // 添加Watcher to Sub.subs[]
    addSub(sub) {
        if (!this.subIds.hasOwnProperty(sub.id)) {
            sub.addSub(this)
            this.subIds[sub.id] = sub
        }
    }
    parseGetter(exp) {
        if (/[^\w.$]/.test(exp)) return

        let exps = exp.split('.')

        // 简易的循环依赖处理
        return function(obj) {
            exps.forEach((key)=>{
                if (!obj) return
                obj = obj[key] 
            })
            return obj
        }
    }

}

export default Watcher