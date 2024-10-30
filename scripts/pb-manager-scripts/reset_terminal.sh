#!/bin/bash
# reset_terminal.sh

# Clear the screen
clear

# Reset environment variables
unset HISTFILE

# Set permissions for the current directory and its contents
chmod -R 755 .

# Reset current directory
cd "$(dirname "$0")" || exit 1

# Kill current terminal and start a new one
# Note: This should be the last command as it will terminate the script
if [[ "$TERM_PROGRAM" == "Apple_Terminal" ]]; then
    osascript -e 'tell application "Terminal" to do script "cd \"$PWD\""'
    kill -9 $PPID
elif [[ "$TERM_PROGRAM" == "gnome-terminal" ]]; then
    gnome-terminal --working-directory="$PWD" &
    kill -9 $PPID
else
    # Generic approach for other terminals
    x-terminal-emulator &
    kill -9 $PPID
fi
