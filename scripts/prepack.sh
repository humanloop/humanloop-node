#!/bin/sh
if npm list --global | grep -q yalc; then
    # Local dev environment
    cp -rv dist/. . | awk '{print $3}' | tail -n +2 | cut -c 3- > .yalc.clean;
    echo .yalc.clean >> .yalc.clean;
else
    # CI environment, releasing the package
    cp -rv dist/. .;
fi

