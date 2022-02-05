/**
 * 原版代码是 陈总@r0ysue 那边嫖来的 hookEvent.js
 * 陈总github: https://github.com/r0ysue
 * 原理解释: https://www.jiangkang.tech/2020/07/25/android/hook-dian-ji-shi-jian/
 */


function get_class_name_4_instance(instance) {
    var class_Class_name = 'java.lang.Class'
    var class_Class = Java.use(class_Class_name)
    var class_Object_name = 'java.lang.Object'
    var class_Object = Java.use(class_Object_name)
    return class_Class.getName.call(class_Object.getClass.call(instance))
}


function overload_method_by_instance(instance, method_name) {
    var class_x_name = get_class_name_4_instance(instance)
    var class_x = Java.use(class_x_name)
    // 实例的类不存在或者实例没有指定方法
    if (!class_x || !(method_name in class_x)) {
        return
    }
    class_x[method_name].overloads.forEach(function(overload) {
        overload.implementation = function() {
            var class_name = get_class_name_4_instance(this)
            console.log('overload', class_name + '.' + method_name)
            return this[method_name].apply(this, arguments)
        }
    })
}


function on_click() {
    Java.perform(function() {
        var class_View_name = 'android.view.View'
        var class_View = Java.use(class_View_name)
        var class_View$ListenerInfo_name = 'android.view.View$ListenerInfo'

        // 以spawn启动进程的模式来attach的话
        class_View.setOnClickListener.implementation = function(view_on_click_listener) {
            if (view_on_click_listener != null) {
                var class_name = get_class_name_4_instance(view_on_click_listener)
                console.log("set_on_click_listener =", class_name)
                overload_method_by_instance(view_on_click_listener, 'onClick')
            }
            return this.setOnClickListener(view_on_click_listener)
        }

        // 如果frida以attach的模式进行attch的话
        Java.choose(class_View$ListenerInfo_name, {
            onMatch: function(instance) {
                var m_on_click_listener = instance.mOnClickListener.value
                if (m_on_click_listener) {
                    var class_name = get_class_name_4_instance(m_on_click_listener)
                    console.log("m_on_click_listener =", class_name)
                    overload_method_by_instance(m_on_click_listener, 'onClick')
                }
            },
            onComplete: function() {}
        })
    })
}
