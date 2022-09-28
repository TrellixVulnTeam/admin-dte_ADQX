# server 측 shell script
cd /home/ubuntu/conaz-admin-dte

git fetch

local=$(git rev-parse HEAD)
echo $local


target=$(git rev-parse origin/main)
echo $target

if [ $local != $target ]
then
        git stash
        git pull origin main
        echo '풀 완료'
        npm install
        npm run start
        pm2 restart 3
fi
