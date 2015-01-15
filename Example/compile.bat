@echo off
for %%f in (".\*.ts") do (
	tsc -t ES5 %%f
)
pause