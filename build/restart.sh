pkill -9 app
git pull
cmake ..
make
./app > app.log 2>&1 &