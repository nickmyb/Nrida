prefix = """
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


function process_id_and_thread_id(tag=null) {
    var process_id = Process.id
    var thread_id = Process.getCurrentThreadId()
    return tag + ' Process.Thread = ' + '[' + process_id + ']' + '(' + thread_id + ')'
}


function print_process_id_and_thread_id(tag=null) {
    var _process_id_and_thread_id = process_id_and_thread_id(tag)
    console.log(_process_id_and_thread_id)
}


function java_traceback(tag=null) {
    var splits = '-----------------------------------------------------------------------------------------'
    var log = ''

    log += splits + '\n'
    var _process_id_and_thread_id = process_id_and_thread_id(tag)
    log += _process_id_and_thread_id + '\n'
    log += class_Log.getStackTraceString(class_Throwable.$new()) + '\n'
    log += splits + '\n'

    return log
}


function print_java_traceback(tag=null) {
    console.log(java_traceback(tag))
}


"""


template_a = """
function hook_{_class_name}() {{
    var class_name_{_class_name} = '{class_name}'
    var class_{_class_name} = Java.use(class_name_{_class_name})

"""
template_b = """
    class_{_class_name}.{method_name}.{overload}.implementation = function({args}) {{
        var uuid = uuidv4()
        console.log(uuid, "{class_name}.{method_name}({signature})")

"""
template_c = """        console.log(uuid, '{arg} =', {arg})\n"""
template_d = """
        var ret = this.{method_name}({args})
        console.log(uuid, 'ret =', ret)

        return ret
    }}
"""
template_e = """}"""


def calculate_params_count(overload):
    quote_count = 0
    for i in overload:
        if i == "'":
            quote_count += 1
    return int(quote_count / 2)


def formatter(class_name, traceback):
    _class_name = class_name.split('.')[-1]
    traceback_line_list = [l for l in traceback.strip().split('\n')]
    method_name = traceback_line_list[0].split('(', maxsplit=1)[0].split(' ')[1]
    if method_name == '<init>':
        method_name = '$init'
    overload_lines = [l.strip()[1:] for l in traceback_line_list[1:] if 'overload' in l]
    template = template_a.format(class_name=class_name, _class_name=_class_name)
    for overload in overload_lines:
        params_count = calculate_params_count(overload)
        arg_list = ['arg' + str(i) for i in range(params_count)]
        args = ', '.join(arg_list)
        signature = overload[9:-1]
        template += template_b.format(class_name=class_name, _class_name=_class_name, method_name=method_name, overload=overload, args=args, signature=signature)
        for arg in arg_list:
            template += template_c.format(arg=arg)
        _template_d = template_d.lstrip('\n') if len(arg_list) == 0 else template_d
        template += _template_d.format(method_name=method_name, args=args)
    template += template_e
    return template


if __name__ == '__main__':
    class_name = 'android.app.Activity'
    traceback = """
    Error: startActivityForResult(): has more than one overload, use .overload(<signature>) to choose from:
            .overload('android.content.Intent', 'int')
            .overload('android.content.Intent', 'int', 'android.os.Bundle')
            .overload('java.lang.String', 'android.content.Intent', 'int', 'android.os.Bundle')
        at throwOverloadError (frida/node_modules/frida-java-bridge/lib/class-factory.js:1963:1)
        at Function.throwAmbiguousError (frida/node_modules/frida-java-bridge/lib/class-factory.js:1352:1)
        at hook (/hello_world.js:6:37)
        at VM.perform (frida/node_modules/frida-java-bridge/lib/vm.js:40:1)                                                                                                                                              
        at performPending (frida/node_modules/frida-java-bridge/index.js:346:1)                                                                                                                                          
        at frida/node_modules/frida-java-bridge/index.js:298:1                                                                                                                                                           
        at VM.perform (frida/node_modules/frida-java-bridge/lib/vm.js:40:1)                                                                                                                                              
        at Runtime.perform (frida/node_modules/frida-java-bridge/index.js:286:1)                                                                                                                                         
        at main (/hello_world.js:13:14)                                                                                                                                                                                  
        at frida/runtime/core.js:55:14 
    """
    f = formatter(class_name, traceback)
    print(f)
