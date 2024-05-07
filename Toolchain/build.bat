@echo off

:: This build script is for test on windows developing, used to combine the Frontend & Backend

CD ..

:: Clear Dist

ECHO Clearing Dist directory...
IF EXIST Dist RD /s /q Dist

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

ECHO Copying Backend to Dist...
IF NOT EXIST Dist MKDIR Dist

MKDIR Dist\dist
XCOPY /E /Y /Q Backend\dist\*.* Dist\dist\ 1>nul

MKDIR Dist\node_modules
XCOPY /E /Y /Q Backend\node_modules\*.* Dist\node_modules\ 1>nul

COPY /Y Backend\package.json Dist\ 1>nul
COPY /Y Backend\package-lock.json Dist\ 1>nul

ECHO Copying Frontend dist to Dist...
XCOPY /E /Y /Q Frontend\dist\*.* Dist\dist\public\ 1>nul

ECHO Copying env to Dist...
COPY /Y Test\.env Dist\ 1>nul

ECHO Build completed.
