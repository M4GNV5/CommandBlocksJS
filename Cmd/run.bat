REM Put this in Cmd\bin\Debug for calling CommandblocksJS.Cmd automatically

@echo off

echo Writing all Core Javascript code to ./core.js
echo. > .\core.js
for %%f in (".\..\..\..\Core\*.js") do (
	for /f "usebackq delims=" %%x in ("%%f") do (
		if NOT "%%x"=="" @echo %%x >> .\core.js
	)
)

echo.

xcopy "%appdata%\.minecraft\saves\pvm" ".\world" /E
echo.
Cmd.exe -s example.js -w ./world -x 1 -y 4 -z 16
echo.
xcopy ".\world" "%appdata%\.minecraft\saves\pvm2" /E