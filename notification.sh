#!/bin/bash

MESSAGE=$1

# Mac通知を表示
osascript -e "display notification \"${MESSAGE}\" with title \"Claude Code\" sound name \"Blow\""