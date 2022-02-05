function hook() {
    console.log('hook()')
    var class_name = 'android.app.Activity'
    var function_name = 'startActivityForResult'
    var c = Java.use(class_name)
    c[function_name].overload('nickmyb').implementation = function() {}
}


function main() {
    console.log('main')
    if (Java.available) {
        Java.perform(hook)
    }
}


setImmediate(main)
