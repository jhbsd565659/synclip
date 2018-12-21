#!/bin/bash

file=$(python -c 'import uuid; print(uuid.uuid4())')
if [ $(uname) = "Linux" ]; then
	xclip -selection clipboard -t image/png -o > ${file}
else
	pbpaste | uudecode -o ${file}
fi
cat ${file} | openssl base64
rm ${file}
