@echo off

setlocal enabledelayedexpansion
set ts_files=
set count=0

echo Compiling...

tsc --target ES5 --out core.js API.ts

echo Done!
pause
title