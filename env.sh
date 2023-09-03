#!/bin/bash

env_config=/usr/local/share/html/env.js

if [[ -n $1 ]]; then
  echo 'const RELEASE_TYPE="'$1'"' >${env_config}
else
  echo dev >${env_config}
fi

echo  $1

cd /usr/sbin
./nginx
