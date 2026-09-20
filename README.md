# 大冯老师的网盘助手

油猴（Tampermonkey）用户脚本，批量解析**六大网盘**的真实直链下载地址，配合 IDM / Xdown / Aria2 / Curl / 比特彗星 等下载工具高效拉取文件。

> 本脚本基于开源项目 [syhyz1990/baiduyun](https://github.com/syhyz1990/baiduyun) 改造，保留其 **AGPL-3.0-or-later** 许可证（强 copyleft，衍生作品须同样以 AGPL 开源）。

## 支持网盘

| 网盘 | 直链获取 |
|------|----------|
| 百度网盘 | ✅ |
| 阿里云盘 | ✅ |
| 天翼云盘 | ✅ |
| 迅雷云盘 | ✅ |
| 夸克网盘 | ✅ |
| 移动云盘 | ✅ |

- 适配 Chrome、Edge、FireFox、360、QQ、搜狗、百分、遨游、星愿、Opera、猎豹、Vivaldi、Yandex、Kiwi 等 18 种浏览器。
- 可在无法安装客户端的环境下使用。

## 安装方法

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2. 将 `大冯老师的网盘助手.js` 全文粘贴新建脚本保存；或把该 `.js` 文件拖入 Tampermonkey 管理页完成安装。
3. 打开对应网盘页面（如 `pan.baidu.com/disk/home`、`www.aliyundrive.com/drive` 等），页面注入下载面板即可使用。

## 使用说明

- 在各网盘文件列表页勾选文件，点击面板中的「获取直链」，脚本会解析出真实下载地址，复制后交给下载工具即可。

## 安全说明

- 已做基础安全扫描：脚本**不含任何硬编码的密钥或密码**。其中百度 OAuth 授权用到的是公开 `client_id`（隐式授权 flow，本就不含 client_secret），属功能必需、非私密凭据。
- 验证码、网盘 access_token 均在本地/浏览器端按需获取，不上送任何第三方私密服务。

## 版本

- v7.0.0 — 当前发布版本（基于上游改造成「大冯老师」定制版）。

## 许可证

本仓库以 **AGPL-3.0-or-later** 许可证发布（LICENSE 由 GitHub 依 AGPL 模板自动生成）。衍生修改同样须以 AGPL 开源。
