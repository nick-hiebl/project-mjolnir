@echo off

ECHO. > INDEX.txt
ECHO. > READER.txt

for /r %%a in (*.tmx) do (

echo    ^<script type=^"text/javascript^" src=^"./levels/%%~na.js^"^>^</script^>

) >> INDEX.txt

for /r %%a in (*.tmx) do (
echo LVL_%%~na,

) >> READER.txt

for /r %%a in (*.tmx) do (
REM call convert.bat %%~na%%~xa
) 
