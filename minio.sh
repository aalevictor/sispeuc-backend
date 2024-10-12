#!/bin/bash

echo "Setting local login and password..."
mc alias set local http://localhost:9000 admin adminadmin

echo "Setting anonymous access to public..."
mc anonymous set public local/sispeuc
