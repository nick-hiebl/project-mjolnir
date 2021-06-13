@echo off
setlocal enabledelayedexpansion

echo %1
set "csv=0"
set "out="
for /f "delims==" %%a in (%1) do (
  if "%%~a"=="</data>" set "csv=0"
  if "!csv!"=="1" set "out=!out!%%a-"
  if "%%~a"=="  <data encoding" set "csv=1"
)

echo %out:~0,-1% 

convertor.py %out:~0,-1% %~n1 > EXPORT\%~n1.js