@echo off

rem define your cbjs directory here (for running from vs)
cd "C:\Users\Agent J\Documents\GitHub\CommandBlocksJS\Example"

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

pause