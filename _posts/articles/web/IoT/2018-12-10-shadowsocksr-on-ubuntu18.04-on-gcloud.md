

https://bmao.tech/blog/shadowsocksr/

https://www.tipsforchina.com/how-to-setup-a-fast-shadowsocks-server-on-vultr-vps-the-easy-way.html

```
anypossible_w@instance-1:~$ sudo su
anypossible_w@instance-1:~$ wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/ssrmu.sh && chmod +x ssrmu.sh && ./ssrmu.sh
Last-modified header missing -- time-stamps turned off.
2018-12-10 09:57:42 (127 MB/s) - ‘ssrmu.sh’ saved [78733/78733]

  ShadowsocksR MuJSON一键管理脚本 [v1.0.26]
  ---- Toyo | doub.io/ss-jc60 ----

  1. 安装 ShadowsocksR
  2. 更新 ShadowsocksR
  3. 卸载 ShadowsocksR
  4. 安装 libsodium(chacha20)
————————————
  5. 查看 账号信息
  6. 显示 连接信息
  7. 设置 用户配置
  8. 手动 修改配置
  9. 配置 流量清零
————————————
 10. 启动 ShadowsocksR
 11. 停止 ShadowsocksR
 12. 重启 ShadowsocksR
 13. 查看 ShadowsocksR 日志
————————————
 14. 其他功能
 15. 升级脚本
 
 当前状态: 未安装

请输入数字 [1-15]：1
[信息] 开始设置 ShadowsocksR账号配置...
请输入用户配置中要显示的 服务器IP或域名 (当服务器有多个IP时，可以指定用户配置中显示的IP或者域名)
(默认自动检测外网IP):

——————————————————————————————
        IP或域名 : 35.198.219.20
——————————————————————————————

请输入要设置的用户 用户名(请勿重复, 用于区分, 不支持中文、空格, 会报错 !)
(默认: doubi):anypossiblew

——————————————————————————————
        用户名 : anypossiblew
——————————————————————————————

请输入要设置的用户 端口(请勿重复, 用于区分)
(默认: 2333):6445

——————————————————————————————
        端口 : 6445
——————————————————————————————

请输入要设置的用户 密码
(默认: doub.io):String0int@gmail.com

——————————————————————————————
        密码 : String0int@gmail.com
——————————————————————————————

请选择要设置的用户 加密方式

  1. none
 [注意] 如果使用 auth_chain_* 系列协议，建议加密方式选择 none (该系列协议自带 RC4 加密)，混淆随意
 
  2. rc4
  3. rc4-md5
  4. rc4-md5-6
 
  5. aes-128-ctr
  6. aes-192-ctr
  7. aes-256-ctr
 
  8. aes-128-cfb
  9. aes-192-cfb
 10. aes-256-cfb
 
 11. aes-128-cfb8
 12. aes-192-cfb8
 13. aes-256-cfb8
 
 14. salsa20
 15. chacha20
 16. chacha20-ietf
 [注意] salsa20/chacha20-*系列加密方式，需要额外安装依赖 libsodium ，否则会无法启动ShadowsocksR !

(默认: 5. aes-128-ctr):1

...

===================================================

 用户 [anypossiblew] 的配置信息：

 I  P       : 35.198.219.20
 端口       : 6445
 密码       : String0int@gmail.com
 加密       : none
 协议       : auth_chain_a
 混淆       : tls1.2_ticket_auth
 设备数限制 : 0(无限)
 单线程限速 : 0 KB/S
 用户总限速 : 0 KB/S
 禁止的端口 : 无限制 

 已使用流量 : 上传: 0 B + 下载: 0 B = 0 B
 剩余的流量 : 819.21 TB 
 用户总流量 : 819.21 TB 

 SSR   链接 : ssr://MzUuMTk4LjIxOS4yMDo2NDQ1OmF1dGhfY2hhaW5fYTpub25lOnRsczEuMl90aWNrZXRfYXV0aDpVM1J5YVc1bk1HbHVkRUJuYldGcGJDNWpiMjA 
 SSR 二维码 : http://doub.pw/qr/qr.php?text=ssr://MzUuMTk4LjIxOS4yMDo2NDQ1OmF1dGhfY2hhaW5fYTpub25lOnRsczEuMl90aWNrZXRfYXV0aDpVM1J5YVc1bk1HbHVkRUJuYldGcGJDNWpiMjA 
 
  提示: 
 在浏览器中，打开二维码链接，就可以看到二维码图片。
 协议和混淆后面的[ _compatible ]，指的是 兼容原版协议/混淆。

===================================================
root@instance-1:/home/anypossible_w# 
```
