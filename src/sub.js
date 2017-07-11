/**
 * @class 发布者类
 */
let uid = 0

class Sub {
    constructor() {
        // dep id
        this.id = uid++
        // array 存储Watcher
        this.subs = []
    }
    /**
     * [添加订阅者]
     * @param  {[Watcher]} sub [订阅者]
     */
    addSub(sub) {
        this.subs.push(sub)
    }
    /**
     * [移除订阅者]
     * @param  {[Watcher]} sub [订阅者]
     */
    removeSub(sub) {
        let index = this.subs.indexOf(sub)
        if (index !== -1) {
            this.subs.splice(index, 1)
        }
    }
    // 通知数据变更
    notify() {
        this.subs.forEach(sub => {
            // 执行sub的update更新函数
            sub.update()
        })
    }
    // add Watcher
    depend() {
        Sub.target.addSub(this)
    }
}
Sub.target = null

export default Sub