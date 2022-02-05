var path_dex_r0gson = '/data/local/tmp/r0gson.dex'
var class_name_Gson = 'com.r0ysue.gson.Gson'
var class_Gson = null

var class_name_Log = 'android.util.Log'
var class_Log = null
var class_name_Throwable = 'java.lang.Throwable'
var class_Throwable = null

var class_name_Class = 'java.lang.Class'
var class_Class = null
var class_name_Object = 'java.lang.Object'
var class_Object = null

var class_name_String = 'java.lang.String'
var class_String = null


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}


function get_class_name_4_instance(instance) {
    return class_Class.getName.call(class_Object.getClass.call(instance))
}


function tool_chains() {
    Java.openClassFile(path_dex_r0gson).load()
    class_Gson = Java.use(class_name_Gson)

    class_Log = Java.use(class_name_Log)
    class_Throwable = Java.use(class_name_Throwable)

    class_Class = Java.use(class_name_Class)
    class_Object = Java.use(class_name_Object)

    class_String = Java.use(class_name_String)
}


function java_traceback(tag=null) {
    var splits = '-----------------------------------------------------------------------------------------'
    var log = ''

    log += splits + '\n'
    if (tag != null) {
        log += tag + '\n'
    }
    log += class_Log.getStackTraceString(class_Throwable.$new()) + '\n'
    log += splits + '\n'


    return log
}


function print_java_traceback(tag=null) {
    console.log(java_traceback(tag))
}


function hook_Activity() {
    var class_name_Activity = 'android.app.Activity'
    var class_Activity = Java.use(class_name_Activity)


    class_Activity.startActivity.overload('android.content.Intent').implementation = function(intent) {
        var uuid = uuidv4()
        console.log(uuid, "android.app.Activity.startActivity('android.content.Intent')")

        console.log(uuid, 'intent =', intent)

        var ret = this.startActivity(intent)
        console.log(uuid, 'ret =', ret)

        return ret
    }

    class_Activity.startActivity.overload('android.content.Intent', 'android.os.Bundle').implementation = function(intent, options) {
        var uuid = uuidv4()
        console.log(uuid, "android.app.Activity.startActivity('android.content.Intent', 'android.os.Bundle')")

        console.log(uuid, 'intent =', intent)
        console.log(uuid, 'options =', options)

        var ret = this.startActivity(intent, options)
        console.log(uuid, 'ret =', ret)

        return ret
    }

    class_Activity.startActivityForResult.overload('android.content.Intent', 'int').implementation = function(intent, request_code) {
        var uuid = uuidv4()
        console.log(uuid, "android.app.Activity.startActivityForResult('android.content.Intent', 'int')")

        console.log(uuid, 'intent =', intent)
        console.log(uuid, 'request_code =', request_code)

        var ret = this.startActivityForResult(intent, request_code)
        console.log(uuid, 'ret =', ret)

        return ret
    }

    class_Activity.startActivityForResult.overload('android.content.Intent', 'int', 'android.os.Bundle').implementation = function(intent, request_code, options) {
        var uuid = uuidv4()
        console.log(uuid, "android.app.Activity.startActivityForResult('android.content.Intent', 'int', 'android.os.Bundle')")

        console.log(uuid, 'intent =', intent)
        console.log(uuid, 'request_code =', request_code)
        console.log(uuid, 'options =', options)

        var ret = this.startActivityForResult(intent, request_code, options)
        console.log(uuid, 'ret =', ret)

        return ret
    }

    class_Activity.startActivityForResult.overload('java.lang.String', 'android.content.Intent', 'int', 'android.os.Bundle').implementation = function(who, intent, request_code, options) {
        var uuid = uuidv4()
        console.log(uuid, "android.app.Activity.startActivityForResult('java.lang.String', 'android.content.Intent', 'int', 'android.os.Bundle')")

        console.log(uuid, 'who =', who)
        console.log(uuid, 'intent =', intent)
        console.log(uuid, 'request_code =', request_code)
        console.log(uuid, 'options =', options)

        var ret = this.startActivityForResult(who, intent, request_code, options)
        console.log(uuid, 'ret =', ret)

        return ret
    }
}


function main() {
    if (Java.available) {
        Java.perform(hook_Activity)
    }
}


setImmediate(main)
