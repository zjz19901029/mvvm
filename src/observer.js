import Sub from './sub'


// Define Property
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        configurable: true,
        writable: true
    })
}

//获取原始数组的属性列表
let arrayPro = Array.prototype
//创建一个新的对象存储原始数组的属性
let arrayMethods = Object.create(arrayPro)

new Array(
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
).forEach((method)=>{//遍历不会产生响应的数组方法
    //记录原始方法
    let originMethod = arrayMethods[method]
    //重新定义不支持响应的数组方法
    def(arrayMethods,method,function(...args){
        //先执行原始方法，获取结果
        let result = originMethod.apply(this,args)
        //获取当前observer实例
        let ob = this.__ob__
        //记录新增的数组元素
        let newObj
        switch(method){
            case "push":
                newObj = args
                break
            case "unshift":
                newObj = args
                break
            case "splice":
                //第三个参数是新增元素
                newObj = args.slice(2)
                break
        }
        //如果有新增元素，则对新元素进行监听
        if(mewObj){
            ob.observeArray(newObj)
        }
        return result
    })
    
})

//监听数据变化
function defineObjectProperty(obj, key, val) {
    let sub = new Sub()
    let childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            if (Sub.target) {
                sub.depend()
                if (childOb) {
                    childOb.sub.depend();
                }
            }
            console.log("get:",val)
            return val
        },
        set: function(newVal) {
            if (val === newVal || (newVal !== newVal && val !== val)) {
                return;
            }
            val = newVal;
            // 监听子属性
            childOb = observe(newVal)
            console.log("set:",val)
            // 通知数据变更
            sub.notify()
        }
    })
}

/**
 *  @class 发布类 Observer that are attached to each observed
 *  @param {[type]} value [vm参数]
 */
class Observer{
    constructor(value) {
        this.value = value
        this.sub = new Sub()
        if(Array.isArray(value)){//监听数组
            this.observeArray(value)
        }
        def(value, '__ob__', this)
        this.walk(value)
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineObjectProperty(obj, key, obj[key])
        })
    }

    observeArray(arr) {
        arr.forEach((obj)=>{
            observe(obj)
        })
    }
}

//监听初始方法
function observe(value) {
    if (!value || typeof value !== 'object') {
        return
    }
    let ob
    if (value.hasOwnProperty("__ob__") && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else {
        ob = new Observer(value)
    }
    return ob
}
export default observe