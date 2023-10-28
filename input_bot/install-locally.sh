#!/bin/bash

# Define variables
id="input_bot"
description="Input Bot"
vendor="snorreks"
name="com.$vendor.$id"
chrome_extension_id="meefjliobkgnafkfoogkbnfbpakakppp"
install_path="$(pwd)/target/debug/input_bot" # Use relative path from the location of this script

# JSON content
json_content=$(cat <<- EOL
{
  "name": "$name",
  "description": "$description",
  "path": "$install_path",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://$chrome_extension_id/"]
}
EOL
)

# Config directories
config_dirs=( "~/.config/google-chrome/NativeMessagingHosts/" "~/.config/chromium/NativeMessagingHosts/" "~/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/" )

# Create NativeMessagingHosts directory and write the config for each browser
for config_dir in "${config_dirs[@]}"; do
  expanded_dir=$(eval echo $config_dir)
  mkdir -p $expanded_dir
  echo "$json_content" > "$expanded_dir/$name.json"
done

echo "Native messaging host installed locally at: $install_path"
