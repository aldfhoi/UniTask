@echo off
echo ===================================================
echo [UniTask AI] GitHub Push 를 시작합니다...
echo ===================================================
set PATH=C:\Users\yeseo\.gemini\antigravity\scratch\git\cmd;C:\Users\yeseo\.gemini\antigravity\scratch\nodejs\node-v20.18.0-win-x64;%PATH%
cd /d C:\Users\yeseo\.gemini\antigravity\scratch\unitask-ai
git push -u origin main
echo ===================================================
echo Push 완료! 창을 닫으셔도 됩니다.
echo ===================================================
pause