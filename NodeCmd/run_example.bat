@echo off
color 0A
cd .\out

call "C:\Program Files (x86)\nodejs\nodevars.bat"

echo.

set /p example=What example would you like to run? 
echo Compiling %example%...
tsc -t ES5 .\..\..\Example\%example%.ts

echo.

echo Copying files...
copy ".\..\..\Core\core.js" ".\core.js"
copy ".\..\main.js" ".\main.js"
copy ".\..\..\Example\%example%.js" ".\script.js"

echo.

node main.js --script script.js --ip 127.0.0.1 --port 25575 -x 0 -y 4 -z 0

echo.
pause