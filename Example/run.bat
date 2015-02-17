@echo off

echo Compiling %1%...
tsc -t ES5 %1%.ts
echo Done
echo.

cd ".\..\Cmd\bin\Release"

echo Copying template world and libraries...
xcopy ".\..\..\..\Core\core.js" ".\core.js" /Y /E /Q
xcopy ".\..\..\..\Example\%1%.js" ".\example.js" /Y /E /Q
xcopy "%appdata%\.minecraft\saves\egal" ".\world" /I /Y /E /Q
echo Done
echo.

echo Running %1%...
Cmd.exe -s example.js -w ./world -x 0 -y 4 -z 0
xcopy ".\world" "%appdata%\.minecraft\saves\cbjs-%1%" /I /Y /E /Q
cd ".\..\..\..\Example"
echo Done
