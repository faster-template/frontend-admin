#!/bin/bash

#--------------------- 自定配置项 ----------------
# 项目的路径
projectPath="/www/wwwroot/xxxx"
# 生产环境变量路径，因为git上不会提交生产环境.env文件
proEnvPath="/www/wwwroot/xxxxxx"
# nodePath
nodePath=/www/server/nodejs/v20.12.2/bin
# ------------------- 自定义配置项结束 --------------

echo "1.进入项目目录: $projectPath"
# 进入项目目录
cd $projectPath
export PATH=$PATH:$nodePath

# 删除项目的dist文件节哀
rm -rf dist

echo "3.复制生产环境变量到项目下"
/bin/cp -rf  $proEnvPath/.env.production $projectPath

echo "4.编译项目"
pnpm install --registry https://registry.npmmirror.com/

echo "5.编译项目"
pnpm run build

# 危险的操作
# 这一步按需使用，会删除文件
# echo "6.删除除了dist文件夹的的所有文件"
# shopt -s extglob
# rm -rf !(dist)
# shopt -s dotglob
# rm -rf !(dist)