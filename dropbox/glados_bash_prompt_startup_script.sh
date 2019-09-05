echo off
clear
tput setab 94
tput setaf 136
clear
tput setab 94
tput setaf 136
echo -e "\033[1mWelcome to $(uname) v$(uname -r) $(id -F)\033[0m"
tput setab 94
tput setaf 136
for i in $(seq 1 $(tput cols )); do
	echo -e -n ¯
done
echo -e "
                                                 ████████████
                                              █ ████████████ ████
                                           ████ █████████ ███████████  
                                        ██████ ████████ ██████████████
                                       ███████ ██████ ██████████████████    
                                      ████████ ████            ███████████
                                      ████████ ██              ██████████
                                     ██ ██████                  ███████████
                                     ███ █████                    ██████████
                                    ██████ ███                     █ ███████
                                    ████████ █                    ███ ██████
                                    ██████████                    █████ ████
                                     ███████████                  ██████ ██
                                      ███████████              █ █████████
                                       ███████████           ███ █████████  
                                        █████████████████ ██████ ████████
                                         █████████████ █████████ ██████
                                           █████████ ███████████ ████
                                             ██████ ████████████ ██
Type 'commands' to see a list of commands       ███ ████████████"
for i in $(seq 1 $(tput cols )); do
	echo -n _
done
while true; do
        echo -n "
>"
	read command
	clear
	for i in $(seq 1 $(expr $(tput lines) - 2)); do
            echo ""
        done
	$command
	for i in $(seq 1 $(tput cols )); do
            echo -n _
        done
done