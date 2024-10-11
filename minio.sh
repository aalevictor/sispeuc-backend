#!/bin/bash
 
echo "Setting download policy..."
mc policy set download minio_alias/sispeuc

echo "Setting local login and password..."
mc alias set local http://localhost:9000 admin adminadmin

echo "Setting anonymous access to public..."
mc anonymous set download local/sispeuc
mc anonymous set public local/sispeuc
