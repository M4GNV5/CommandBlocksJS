@echo off

echo Compiling CommandblockJS libraries
cd ".\..\Core"
call compile.bat
cd ".\..\Example"
echo.
echo.
echo.

call run.bat Variables
echo.
echo.
echo.
call run.bat CircleCalculations
echo.
echo.
echo.
call run.bat Blockhandles

pause