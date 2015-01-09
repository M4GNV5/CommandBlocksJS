@echo off
setlocal enabledelayedexpansion
set ts_files=
for /R %%f in (*.ts) do set ts_files=!ts_files! %%f
tsc --out core.js %ts_files%
pause
exit