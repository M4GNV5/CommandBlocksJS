@echo off

setlocal enabledelayedexpansion
set ts_files=
set count=0

echo CommandblocksJS compile script
echo.

for /R %%f in (*.ts) do  (
	set ts_files=!ts_files! "%%f"
	set /A count += 1
)
echo Found %count% files
echo Compiling...

tsc --declaration --target ES5 --out core.js %ts_files%

echo.
echo Done!
pause
title