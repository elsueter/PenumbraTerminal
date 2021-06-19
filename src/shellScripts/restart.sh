pkill -9 penNet
git pull
cmake ..
make
./penNet > penNet.log 2>&1 &