@REM author: Giuseppe Iacobucci

@REM ----------------------------------------------------------------------------
@REM Applica Framework Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - your JDK 8 Home
@REM M2_HOME - your Maven installation directory
@REM APPLICAFRAMEWORK_HOME - path of framework cloned directory
@REM
@REM ----------------------------------------------------------------------------

@echo off

set APPLICAFRAMEWORK_VERSION="2.1.2-RELEASE"


@REM set %HOME% to equivalent of $HOME
if "%HOME%" == "" (set "HOME=%HOMEDRIVE%%HOMEPATH%")


@REM set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" @setlocal
if "%OS%"=="WINNT" @setlocal

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

echo.
echo Error: JAVA_HOME not found in your environment. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:OkJHome
if exist "%JAVA_HOME%\bin\java.exe" goto chkMHome

echo.
echo Error: JAVA_HOME is set to an invalid directory. >&2
echo JAVA_HOME = "%JAVA_HOME%" >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:chkMHome
if not "%M2_HOME%"=="" goto valMHome

if "%OS%"=="Windows_NT" SET "M2_HOME=%~dp0.."
if "%OS%"=="WINNT" SET "M2_HOME=%~dp0.."
if not "%M2_HOME%"=="" goto valMHome

echo.
echo Error: M2_HOME not found in your environment. >&2
echo Please set the M2_HOME variable in your environment to match the >&2
echo location of the Maven installation. >&2
echo.
goto error



:valMHome

:stripMHome
if not "_%M2_HOME:~-1%"=="_\" goto checkMBat
set "M2_HOME=%M2_HOME:~0,-1%"
goto stripMHome

:checkMBat
if exist "%M2_HOME%\bin\mvn" goto okMHome

echo.
echo Error: M2_HOME is set to an invalid directory. >&2
echo M2_HOME = "%M2_HOME%" >&2
echo Please set the M2_HOME variable in your environment to match the >&2
echo location of the Maven installation >&2
echo.
goto error

:okMHome
if not "%APPLICAFRAMEWORK_HOME%" == "" goto OkAFHome

echo.
echo Error: APPLICAFRAMEWORK_HOME not found in your environment. >&2
echo Please set the APPLICAFRAMEWORK_HOME variable in your environment to match the >&2
echo location of your Applica Framework installation. >&2
echo.
goto error

:OkAFHome
if exist "%APPLICAFRAMEWORK_HOME%\scripts\target\scripts-%APPLICAFRAMEWORK_VERSION%.jar" goto init

echo.
echo Error: APPLICAFRAMEWORK_HOME is set to an invalid directory. >&2
echo APPLICAFRAMEWORK_HOME = "%APPLICAFRAMEWORK_HOME%" >&2
echo Please set the APPLICAFRAMEWORK_HOME variable in your environment to match the >&2
echo location of your Applica Framework installation. >&2
echo.
goto error
@REM ==== END VALIDATION ====

:init
@REM Decide how to startup depending on the version of windows

@REM -- Windows NT with Novell Login
if "%OS%"=="WINNT" goto WinNTNovell

@REM -- Win98ME
if NOT "%OS%"=="Windows_NT" goto Win9xArg

:WinNTNovell

@REM -- 4NT shell
if "%@eval[2+2]" == "4" goto 4NTArgs

@REM -- Regular WinNT shell
set AF_CMD_LINE_ARGS=%*
goto endInit

@REM The 4NT Shell from jp software
:4NTArgs
set AF_CMD_LINE_ARGS=%$
goto endInit

:Win9xArg
@REM Slurp the command line arguments.  This loop allows for an unlimited number
@REM of agruments (up to the command line limit, anyway).
set AF_CMD_LINE_ARGS=
:Win9xApp
if %1a==a goto endInit
set AF_CMD_LINE_ARGS=%AF_CMD_LINE_ARGS% %1
shift
goto Win9xApp

@REM Reaching here means variables are defined and arguments have been captured
:endInit
SET AF_JAR="%APPLICAFRAMEWORK_HOME%\scripts\target\lib\*;%APPLICAFRAMEWORK_HOME%\scripts\target\scripts-%APPLICAFRAMEWORK_VERSION%.jar"
SET AF_JAVA_EXE="%JAVA_HOME%\bin\java.exe"

@REM -- 4NT shell
SETLOCAL EnableDelayedExpansion
if "%@eval[2+2]" == "4" goto 4NTCWJars

@REM -- Regular WinNT shell
for %%i in ("%APPLICAFRAMEWORK_HOME%"scripts\target\lib\*.jar) do ( set CLASSWORLDS_JAR=!CLASSWORLDS_JAR!;"%%i")
goto runm2

@REM The 4NT Shell from jp software
:4NTCWJars
for %%i in ("%APPLICAFRAMEWORK_HOME%scripts\target\lib\*.jar") do ( set CLASSWORLDS_JAR=!CLASSWORLDS_JAR!;"%%i")
goto runm2

@REM Start APPLICAFRAMEWORK
:runm2
set CLASSWORLDS_JAR=%AF_JAR%!CLASSWORLDS_JAR!
set CLASSWORLDS_LAUNCHER=applica.framework.Applica
%AF_JAVA_EXE% -classpath %CLASSWORLDS_JAR% %CLASSWORLDS_LAUNCHER% %AF_CMD_LINE_ARGS%
if ERRORLEVEL 1 goto error
goto end

:error
if "%OS%"=="Windows_NT" @endlocal
if "%OS%"=="WINNT" @endlocal
set ERROR_CODE=1

:end
@REM set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" goto endNT
if "%OS%"=="WINNT" goto endNT

@REM For old DOS remove the set variables from ENV - we assume they were not set
@REM before we started - at least we don't leave any baggage around
set AF_JAVA_EXE=
set AF_CMD_LINE_ARGS=
goto postExec

:endNT
@endlocal & set ERROR_CODE=%ERROR_CODE%

:postExec



cmd /C exit /B %ERROR_CODE%
