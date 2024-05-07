@echo off

:: This build script is for test on windows developing, used to combine the Frontend & Backend

CD ..

:: Clear Production

ECHO Clearing Production directory...
IF EXIST Production RD /s /q Production

:: Build Frontend

ECHO Building Frontend...
CD Frontend
CALL npm install --no-audit --loglevel=error
CALL npm run build
CD ..

:: Build Backend

ECHO Building Backend...
CD Backend
CALL npm install --no-audit --loglevel=error
CALL npm run build
CD ..

:: Assemble Up

ECHO Copying Backend to Production...
IF NOT EXIST Production MKDIR Production

MKDIR Production\dist
XCOPY /E /Y /Q Backend\dist\*.* Production\dist\ 1>nul

MKDIR Production\node_modules
XCOPY /E /Y /Q Backend\node_modules\*.* Production\node_modules\ 1>nul

COPY /Y Backend\package.json Production\ 1>nul
COPY /Y Backend\package-lock.json Production\ 1>nul

ECHO Copying Frontend dist to Production...
XCOPY /E /Y /Q Frontend\dist\*.* Production\dist\public\ 1>nul

ECHO Copying env to Production...
COPY /Y Test\.env Production\ 1>nul

ECHO Build completed.
