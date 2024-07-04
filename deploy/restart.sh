#!/bin/bash

#--------------------- 自定配置项 ----------------
# 项目的路径
projectPath="/www/wwwroot/xxxxx"
# 生产环境变量路径，因为git上不会提交生产环境.env文件
proEnvPath="/www/wwwroot/configs/xxxxx"
# ------------------- 自定义配置项结束 --------------

echo "1.进入项目目录: $projectPath"
# 进入项目目录
cd $projectPath

echo "3.复制生产环境变量到项目下"
/bin/cp -rf  $proEnvPath/.env.production $projectPath

echo "4.编译项目"
pnpm install --registry https://registry.npmmirror.com/

echo "5.编译项目"
pnpm run build
