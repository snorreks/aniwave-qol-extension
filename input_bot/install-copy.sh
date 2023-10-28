#!/bin/bash

# Define variables
id="input_bot"
description="Input Bot"
vendor="snorreks"
name="com.$vendor.$id"
chrome_extension_id="meefjliobkgnafkfoogkbnfbpakakppp"
install_path="$HOME/bin/$id" # Use ~/bin as the install path

# Create ~/bin directory if it doesn't exist
mkdir -p ~/bin

# Copy the binary to the install path
cp $id $install_path

# Ensure the install script is executable
chmod +x $install_path

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