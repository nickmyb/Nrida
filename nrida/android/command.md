adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp'

# uiautomatorviewer
adb shell uiautomator dump /data/local/tmp/app.uix
adb pull /data/local/tmp/app.uix ./app.uix

adb shell screencap -p /data/local/tmp/app.png
adb pull /data/local/tmp/app.png ./app.png
