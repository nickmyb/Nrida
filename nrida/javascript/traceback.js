function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
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
    var class_name_Log = 'android.util.Log'
    var class_Log = Java.use(class_name_Log)
    var class_name_Throwable = 'java.lang.Throwable'
    var class_Throwable = Java.use(class_name_Throwable)


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
