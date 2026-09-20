// ==UserScript==
// @name              大冯老师的网盘助手
// @namespace         https://github.com/syhyz1990/baiduyun
// @version           7.0.0
// @author            大冯老师
// @description       👆👆👆👆👆👆👆 - 支持批量获取 ✅百度网盘 ✅阿里云盘 ✅天翼云盘 ✅迅雷云盘 ✅夸克网盘 ✅移动云盘 六大网盘的直链下载地址，配合 IDM，Xdown，Aria2，Curl，比特彗星等工具高效🚀🚀🚀下载，完美适配 Chrome，Edge，FireFox，360，QQ，搜狗，百分，遨游，星愿，Opera，猎豹，Vivaldi，Yandex，Kiwi 等 18 种浏览器。可在无法安装客户端的环境下使用，助手免费开源。😎【使用前请先扫码关注「数智化教学大冯老师」获取验证码】
// @license           AGPL-3.0-or-later
// @homepage          https://www.youxiaohou.com/install.html
// @supportURL        https://github.com/syhyz1990/baiduyun
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/disk/main*
// @match             *://yun.baidu.com/disk/main*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @match             *://www.aliyundrive.com/s/*
// @match             *://www.aliyundrive.com/drive*
// @match             *://www.alipan.com/s/*
// @match             *://www.alipan.com/drive*
// @match             *://cloud.189.cn/web/*
// @match             *://pan.xunlei.com/*
// @match             *://pan.quark.cn/*
// @match             *://yun.139.com/*
// @match             *://caiyun.139.com/*
// @require           https://registry.npmmirror.com/jquery/3.7.0/files/dist/jquery.min.js
// @require           https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.all.min.js
// @require           https://registry.npmmirror.com/js-md5/0.7.3/files/build/md5.min.js
// @connect           baidu.com
// @connect           baidupcs.com
// @connect           aliyundrive.com
// @connect           alipan.com
// @connect           189.cn
// @connect           xunlei.com
// @connect           quark.cn
// @connect           youxiaohou.com
// @connect           yun.139.com
// @connect           caiyun.139.com
// @connect           localhost
// @connect           *
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_registerMenuCommand
// @grant             GM_cookie
// @icon              https://pan.quark.cn/favicon.ico
// ==/UserScript==

(function () {
    'use strict';

    let pt = '', selectList = [], params = {}, mode = '', width = 800, pan = {}, color = '',
        doc = $(document), progress = {}, request = {}, ins = {}, idm = {};
    const scriptInfo = GM_info.script;
    const version = scriptInfo.version;
    const author = scriptInfo.author;
    const name = scriptInfo.name;
    const customClass = {
        popup: 'pl-popup',
        header: 'pl-header',
        title: 'pl-title',
        closeButton: 'pl-close',
        content: 'pl-content',
        input: 'pl-input',
        footer: 'pl-footer'
    };

    const terminalType = {
        wc: "Windows CMD",
        wp: "Windows PowerShell",
        lt: "Linux 终端",
        ls: "Linux Shell",
        mt: "MacOS 终端",
    };

    // ==== 大冯老师授权模块：扫码验证码门禁 ====
    // 关注公众号「数智化教学大冯老师」→ 发送「初始化」→ 获得验证码 AGPL3
    // 未通过验证前，任何下载项点击都不会发起解析请求。
    const AUTH_CODE = "AGPL3";                       // 唯一有效验证码
    const AUTH_STORE_KEY = "df_auth_passed";         // 通过标记（存于本机）
    const AUTH_CODE_KEY = "df_auth_code";            // 已提交的验证码
    const MP_NAME = "数智化教学大冯老师";
    const MP_TIP = "扫码关注数智化教学大冯老师，发送“初始化”即可开启加速下载";
    const MP_GUIDE = '未关注公众号或未通过验证，脚本无法解析直链。请用微信扫码关注 <b>' + MP_NAME + '</b>，发送 <b>“初始化”</b> 获取验证码后在此填写。';
    // 公众号二维码（内嵌 base64，离线可用，不依赖任何图床）
    const QR_IMG = "data:image/jpeg;base64,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";

    let toast = Swal.mixin({        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    const message = {
        success: (text) => {
            toast.fire({title: text, icon: 'success'});
        },
        error: (text) => {
            toast.fire({title: text, icon: 'error'});
        },
        warning: (text) => {
            toast.fire({title: text, icon: 'warning'});
        },
        info: (text) => {
            toast.fire({title: text, icon: 'info'});
        },
        question: (text) => {
            toast.fire({title: text, icon: 'question'});
        }
    };

    let base = {

        getCookie(name) {
            let cname = name + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i].trim();
                if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
            }
            return "";
        },

        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },

        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        getStorage(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        },

        setStorage(key, value) {
            if (this.isType(value) === 'object' || this.isType(value) === 'array') {
                return localStorage.setItem(key, JSON.stringify(value));
            }
            return localStorage.setItem(key, value);
        },

        setClipboard(text) {
            GM_setClipboard(text, 'text');
        },

        e(str) {
            return btoa(unescape(encodeURIComponent(str)));
        },

        d(str) {
            return decodeURIComponent(escape(atob(str)));
        },

        getExtension(name) {
            const reg = /(?!\.)\w+$/;
            if (reg.test(name)) {
                let match = name.match(reg);
                return match[0].toUpperCase();
            }
            return '';
        },

        sizeFormat(value) {
            if (value === +value) {
                let unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
                let index = Math.floor(Math.log(value) / Math.log(1024));
                let size = value / Math.pow(1024, index);
                size = size.toFixed(1);
                return size + unit[index];
            }
            return '';
        },

        sortByName(arr) {
            const handle = () => {
                return (a, b) => {
                    const p1 = a.filename ? a.filename : a.server_filename;
                    const p2 = b.filename ? b.filename : b.server_filename;
                    return p1.localeCompare(p2, "zh-CN");
                };
            };
            arr.sort(handle());
        },

        fixFilename(name) {
            return name.replace(/[!?&|`"'*\/:<>\\]/g, '_');
        },

        blobDownload(blob, filename) {
            if (blob instanceof Blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
        },

        post(url, data, headers, type) {
            if (this.isType(data) === 'object') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        get(url, headers, type, extra) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 204) {
                            requestObj.abort();
                            idm[extra.index] = true;
                        }
                        if (type === 'blob') {
                            res.status === 200 && base.blobDownload(res.response, extra.filename);
                            resolve(res);
                        } else {
                            resolve(res.response || res.responseText);
                        }
                    },
                    onprogress: (res) => {
                        if (extra && extra.filename && extra.index) {
                            res.total > 0 ? progress[extra.index] = (res.loaded * 100 / res.total).toFixed(2) : progress[extra.index] = 0.00;
                        }
                    },
                    onloadstart() {
                        extra && extra.filename && extra.index && (request[extra.index] = requestObj);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        getFinalUrl(url, headers) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    onload: (res) => {
                        resolve(res.finalUrl);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        stringify(obj) {
            let str = '';
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    if (Array.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            str += encodeURIComponent(key) + '=' + encodeURIComponent(value[i]) + '&';
                        }
                    } else {
                        str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                    }
                }
            }
            return str.slice(0, -1); // 去掉末尾的 "&"
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.getElementsByTagName('head')[0].appendChild(style);
        },

        sleep(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },

        findReact(dom, traverseUp = 0) {
            const key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            const domFiber = dom[key];
            if (domFiber == null) return null;

            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }

            const GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (typeof parentFiber.type == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
        },

        initDefaultConfig() {
            let value = [{
                name: 'setting_rpc_domain',
                value: 'http://localhost'
            }, {
                name: 'setting_rpc_port',
                value: '16800'
            }, {
                name: 'setting_rpc_path',
                value: '/jsonrpc'
            }, {
                name: 'setting_rpc_token',
                value: ''
            }, {
                name: 'setting_rpc_dir',
                value: 'D:'
            }, {
                name: 'setting_terminal_type',
                value: 'wc'
            }, {
                name: 'setting_theme_color',
                value: '#09AAFF'
            }, {
                name: 'setting_init_code',
                value: ''
            }, {
                name: 'license',
                value: ''
            }];

            value.forEach((v) => {
                base.getValue(v.name) === undefined && base.setValue(v.name, v.value);
            });

            // ==== 大冯老师补丁：本地授权（原联网激活已停摆，此处仅作占位）====
            // 注意：这一段只让按钮"能显示出来"，不再等于"可以使用"。
            // 真正的使用权限由下面的扫码验证码门禁（isAuthed / requireAuth）控制。
            const LOCAL_CODE = "DAFENG-FREE";
            const curCode = base.getValue('setting_init_code');
            const curLic = base.getValue('license');
            if (!curCode || curCode === 'free' || curCode === '') {
                base.setValue('setting_init_code', LOCAL_CODE);
                console.log('[大冯老师] 已写入本地占位码（按钮显示用）');
            }
            if (!curLic || curLic === 'free' || curLic === '') {
                base.setValue('license', LOCAL_CODE);
            }
        },

        // ==== 大冯老师授权：扫码验证码门禁 ====
        // 设计要点：
        //  1) 状态只认 AUTH_STORE_KEY 这一个标记，验证码始终是 AGPL3；
        //  2) 所有下载项点击入口统一走 base.requireAuth()，未通过则弹二维码框并 return false；
        //  3) 通过后本机记住（localStorage），刷新页面不再重复要求，可在设置里手动退出。
        isAuthed() {
            try {
                return String(base.getValue(AUTH_STORE_KEY)) === '1'
                    && String(base.getValue(AUTH_CODE_KEY)) === AUTH_CODE;
            } catch (e) {
                return false;
            }
        },

        setAuthed(code) {
            base.setValue(AUTH_STORE_KEY, '1');
            base.setValue(AUTH_CODE_KEY, code);
            console.log('[大冯老师] 验证码校验通过，已开启直链解析权限');
        },

        // 退出验证（清空标记），供设置面板调用
        clearAuth() {
            base.setValue(AUTH_STORE_KEY, '');
            base.setValue(AUTH_CODE_KEY, '');
            console.log('[大冯老师] 已清除验证状态');
        },

        /**
         * 授权门禁：已验证返回 true；未验证弹出二维码引导框并返回 false。
         * @param {string} reason 触发场景说明（会显示在弹窗副标题）
         * @returns {Promise<boolean>}
         */
        async requireAuth(reason) {
            if (base.isAuthed()) return true;
            return await base.showAuthDialog(reason || '');
        },

        /**
         * 扫码 + 验证码对话框（循环重试，不用递归，避免栈增长与死循环）。
         * 输错可重试；点取消/关闭直接返回 false（调用方必须中止解析）。
         * @returns {Promise<boolean>}
         */
        async showAuthDialog(reason) {
            const sub = reason
                ? `<div style="font-size:12px;color:#9ca3af;margin:-4px 0 12px;">触发位置：${reason}</div>`
                : '';
            const html =
                '<div style="text-align:center;">'
                + '<img src="' + QR_IMG + '" alt="公众号二维码" '
                + 'style="width:200px;height:200px;border-radius:10px;border:1px solid #e5e7eb;padding:6px;background:#fff;box-sizing:border-box;">'
                + '<div style="margin:12px 0 4px;font-size:15px;font-weight:700;color:#059669;line-height:1.5;">'
                + MP_TIP
                + '</div>'
                + '<div style="font-size:12px;color:#6b7280;line-height:1.7;margin:6px 0 14px;">'
                + MP_GUIDE
                + '</div>'
                + sub
                + '<input class="swal2-input" id="df-auth-code" type="text" placeholder="请输入验证码" '
                + 'style="margin:0;width:78%;letter-spacing:2px;font-weight:700;text-align:center;text-transform:uppercase;">'
                + '<div id="df-auth-msg" style="font-size:12px;color:#ef4444;height:16px;margin-top:8px;"></div>'
                + '</div>';

            // 最多尝试 5 次，防止任何异常情况下无限弹窗
            for (let attempt = 0; attempt < 5; attempt++) {
                const result = await Swal.fire({
                    title: attempt === 0 ? '扫码关注后使用' : '验证码不正确',
                    html: html,
                    width: 460,
                    allowOutsideClick: false,
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: '验证并开始解析',
                    cancelButtonText: '暂不验证',
                    confirmButtonColor: '#059669',
                    cancelButtonColor: '#9ca3af',
                });

                if (!result || !result.isConfirmed) return false;

                const input = (document.getElementById('df-auth-code') || {}).value || '';
                const val = String(input).trim().toUpperCase();

                if (val === AUTH_CODE) {
                    base.setAuthed(AUTH_CODE);
                    message.success('验证成功，已开启加速下载！');
                    return true;
                }

                const msg = document.getElementById('df-auth-msg');
                if (msg) {
                    msg.textContent = val === '' ? '请输入验证码后再提交' : '验证码错误，请重新输入';
                }
                // 输错 → 继续下一轮，用户随时可取消
            }
            message.error('提示：验证码连续输入错误，请确认已关注公众号后重试。');
            return false;
        },

        showSetting() {
            let dom = '', btn = '',
                colorList = ['#09AAFF', '#cc3235', '#526efa', '#518c17', '#ed944b', '#f969a5', '#bca280'];
            dom += `<label class="pl-setting-label"><div class="pl-label">RPC主机</div><input type="text"  placeholder="主机地址，需带上http(s)://" class="pl-input listener-domain" value="${base.getValue('setting_rpc_domain')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">RPC端口</div><input type="text" placeholder="端口号，例如：Motrix为16800" class="pl-input listener-port" value="${base.getValue('setting_rpc_port')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">RPC路径</div><input type="text" placeholder="路径，默认为/jsonrpc" class="pl-input listener-path" value="${base.getValue('setting_rpc_path')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">RPC密钥</div><input type="text" placeholder="无密钥无需填写" class="pl-input listener-token" value="${base.getValue('setting_rpc_token')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">保存路径</div><input type="text" placeholder="文件下载后保存路径，例如：D:" class="pl-input listener-dir" value="${base.getValue('setting_rpc_dir')}"></label>`;

            colorList.forEach((v) => {
                btn += `<div data-color="${v}" style="background: ${v};border: 1px solid ${v}" class="pl-color-box listener-color ${v === base.getValue('setting_theme_color') ? 'checked' : ''}"></div>`;
            });
            dom += `<label class="pl-setting-label"><div class="pl-label">终端类型</div><select class="pl-input listener-terminal">`;
            Object.keys(terminalType).forEach(k => {
                dom += `<option value="${k}" ${base.getValue('setting_terminal_type') === k ? 'selected' : ''}>${terminalType[k]}</option>`;
            });
            dom += `</select></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">主题颜色</div> <div class="pl-color">${btn}<div></label>`;
            // ==== 大冯老师：验证状态显示 + 重新验证 / 退出验证 ====
            const authed = base.isAuthed();
            dom += `<label class="pl-setting-label"><div class="pl-label">验证状态</div>`
                + `<div class="pl-auth-row" style="display:flex;align-items:center;gap:8px;">`
                + `<span style="font-size:12px;font-weight:700;color:${authed ? '#059669' : '#ef4444'};">`
                + `${authed ? '✅ 已通过（可解析直链）' : '❌ 未通过（请扫码验证）'}</span>`
                + `<span style="flex:1 1 0%;"></span>`
                + `<a href="javascript:;" class="pl-a listener-reauth" style="font-size:12px;color:#059669;font-weight:700;">重新验证</a>`
                + `<a href="javascript:;" class="pl-a listener-deauth" style="font-size:12px;color:#9ca3af;font-weight:700;">退出验证</a>`
                + `</div></label>`;
            dom = '<div>' + dom + '</div>';

            Swal.fire({
                title: '助手配置',
                html: dom,
                icon: 'info',
                showCloseButton: true,
                showConfirmButton: false,
                footer: pan.footer,
            }).then(() => {
                message.success('设置成功！');
                history.go(0);
            });

            doc.on('click', '.listener-color', async (e) => {
                base.setValue('setting_theme_color', e.target.dataset.color);
                message.success('设置成功！');
                history.go(0);
            });
            doc.on('input', '.listener-domain', async (e) => {
                base.setValue('setting_rpc_domain', e.target.value);
            });
            doc.on('input', '.listener-port', async (e) => {
                base.setValue('setting_rpc_port', e.target.value);
            });
            doc.on('input', '.listener-path', async (e) => {
                base.setValue('setting_rpc_path', e.target.value);
            });
            doc.on('input', '.listener-token', async (e) => {
                base.setValue('setting_rpc_token', e.target.value);
            });
            doc.on('input', '.listener-dir', async (e) => {
                base.setValue('setting_rpc_dir', e.target.value);
            });
            doc.on('change', '.listener-terminal', async (e) => {
                base.setValue('setting_terminal_type', e.target.value);
            });
            // ==== 大冯老师：设置面板里的验证状态操作 ====
            doc.on('click', '.listener-reauth', async (e) => {
                e.preventDefault();
                base.clearAuth();
                await base.showAuthDialog('设置面板 · 重新验证');
            });
            doc.on('click', '.listener-deauth', async (e) => {
                e.preventDefault();
                base.clearAuth();
                Swal.close();
                message.success('已退出验证，如需使用请重新扫码');
                history.go(0);
            });
        },

        // ==== 大冯老师补丁：离线兜底（原作者配置接口已停摆）====
        // 统一取工具栏容器：QUARK_AUTO 走缓存元素，其余走选择器
        getToolbarFor(sel) {
            if (sel === "QUARK_AUTO") {
                return base._quarkToolbar || base.resolveQuarkToolbar();
            }
            // 夸克：官方选择器优先，命中即用；未命中则自动回落到探测
            const el = document.querySelector(sel);
            if (el) { base._quarkToolbar = el; return el; }
            if (/pan\.quark\.cn/.test(location.host)) {
                if (base._quarkAutoTried !== sel) {
                    base._quarkAutoTried = sel;
                    console.warn('[大冯老师] 官方选择器未命中(' + sel + ')，启用自动探测');
                }
                return base.resolveQuarkToolbar();
            }
            return null;
        },

        // 统一取 jQuery 包装好的工具栏容器
        // 返回 JQ 对象；取不到返回 null。避免下游再写 $(sel) 变成非法选择器。
        getToolbarWrap(sel) {
            const el = base.getToolbarFor(sel);
            if (!el) {
                base._quarkRetry = (base._quarkRetry || 0) + 1;
                if (base._quarkRetry % 12 === 1) {
                    console.warn('[大冯老师] 工具栏容器暂不可用，第 ' + base._quarkRetry + ' 次重试');
                    if (base._quarkRetry === 13) base.reportToolbarCandidates();
                }
                return null;
            }
            base._quarkRetry = 0;
            return $(el);
        },

        // 幂等注入：按钮已在目标容器内（或页面上已存在同类按钮）就跳过。
        // 关键：listenElement 每 500ms 回调一次，重复 prepend 同一个元素
        // 会把它从原位"拔起再插回"，导致按钮永远显示不出来。
        injectButton($wrap, $btn, marker) {
            if (!$wrap || !$btn || $wrap.length === 0) return false;
            const btnEl = $btn[0] || ($btn.items && $btn.items[0]);
            const wrapEl = $wrap[0] || ($wrap.items && $wrap.items[0]);
            if (btnEl && wrapEl && btnEl.parentElement === wrapEl) return false; // 已在容器内
            if ($(marker).length > 0) return false;                              // 页面已有同类按钮
            $wrap.prepend($btn);
            return true;
        },
        // ==== 夸克工具栏自动探测（应对页面改版）====
        // 优先用候选选择器；都失败则用启发式：定位含"上传文件"文本的容器
        resolveQuarkToolbar() {
            if (base._quarkToolbar) return base._quarkToolbar;
            const candidates = [
                ".toolbar", ".file-toolbar", ".file-list-toolbar", ".operation-bar",
                "[class*=toolbar]", "[class*=Toolbar]", "[class*=operation]",
                "[class*=Operation]", "[class*=action-bar]", "[class*=actionBar]",
                "[class*=top-bar]", "[class*=topBar]", "[class*=header-actions]"
            ];
            for (const sel of candidates) {
                try {
                    const el = document.querySelector(sel);
                    if (el) { console.log("[大冯老师] 候选命中: " + sel); base._quarkToolbar = el; return el; }
                } catch (e) {}
            }
            // 启发式：找包含"上传文件"文本且层级最深的可点击容器
            const all = document.querySelectorAll("div, span, button, a");
            const keys = ["上传文件", "新建文件夹", "添加备份"];
            let best = null;
            for (const el of all) {
                const txt = (el.textContent || "").trim();
                if (txt.length > 80) continue;
                if (keys.some(k => txt.includes(k))) {
                    // 向上找 3~5 层，拿到工具栏这种宽度合适的容器
                    let p = el;
                    for (let i = 0; i < 4 && p && p.parentElement; i++) p = p.parentElement;
                    if (p && p.children && p.children.length >= 2) { best = p; break; }
                }
            }
            if (best) { console.log("[大冯老师] 启发式命中工具栏（含上传文件按钮）"); base._quarkToolbar = best; return best; }
            return null;
        },

        // 生成探测报告，打印页面上所有可能的工具栏容器，供人工校准
        reportToolbarCandidates() {
            const found = [];
            document.querySelectorAll("div").forEach(el => {
                const cls = typeof el.className === "string" ? el.className : "";
                if (!cls) return;
                if (/toolbar|Toolbar|operation|Operation|action|Action|header|Header/.test(cls)) {
                    const txt = (el.textContent || "").trim().slice(0, 40);
                    if (el.children.length >= 1) found.push("." + cls.split(/\s+/).slice(0, 2).join(".") + "  |  " + txt);
                }
            });
            console.log("[大冯老师] ===== 页面候选容器清单（共 " + found.length + " 个）=====");
            found.slice(0, 25).forEach((f, i) => console.log("  [" + (i + 1) + "] " + f));
            console.log("[大冯老师] ===== 清单结束，请把上面内容截图反馈 =====");
        },
        getOfflinePan() {
            // 本地授权码：作者服务端已停摆，激活校验无法完成，
            // 故内置一个本地通过码，首次进入自动写入，跳过联网激活。
            const LOCAL_CODE = "DAFENG-FREE";
            // 各网盘真实 API 端点 / 选择器 / UA 来自 LinkSwift 官方备份配置
            // https://github.com/hmjz100/LinkSwift/tree/main/config
            // （即原脚本服务器不可用时的官方降级配置，字段与结构完全兼容）
            const common = {
                code: 200,
                img: "https://pic.rmb.bdstatic.com/bjh/8b9e14345b3cdf96aedac2f3971adcb02681.png",
                assistant: "https://www.crxsoso.com/addon/detail/mphijdmblaalbakceeadippfkbgfgaaa",
                version: "6.2.3",
                num: LOCAL_CODE,
                license: LOCAL_CODE,
                init: {
                    0: "请输入初始化暗号",
                    1: "请输入暗号点亮按钮，扫二维码免费获取",
                    2: "暗号正确！【下载助手】点亮成功！",
                    3: "暗号不正确！",
                    4: "试试用微信扫码回复暗号来点亮按钮吧！",
                    5: "请先安装网盘万能助手，安装后请刷新本页！！！"
                },
                api: {
                    0: 'API下载<span style="font-size:14px;font-weight:400;opacity:.8;">（适用于 IDM、NDM 及浏览器自带下载）</span>',
                    1: "点击链接直接下载，若未唤起 IDM，请手动复制链接。"
                },
                aria: {
                    0: 'Aria下载<span style="font-size:14px;font-weight:400;opacity:.8;">（适用于 XDown 及 Linux Shell 命令行）</span>',
                    1: "点击复制链接到剪切板，粘贴到支持 aria2c 协议的下载器中。"
                },
                rpc: {
                    0: 'RPC下载<span style="font-size:14px;font-weight:400;opacity:.8;">（适用于 Motrix、Aria2 Tools、AriaNgGUI）</span>',
                    1: "点击按钮发送链接至 RPC 服务，需先在设置中填写 RPC 地址与端口。"
                },
                curl: {
                    0: 'cURL下载<span style="font-size:14px;font-weight:400;opacity:.8;">（适用于 Windows / Linux / MacOS 终端）</span>',
                    1: "点击复制命令到剪切板，粘贴到终端执行，支持断点续传。"
                },
                bc: {
                    0: 'BC下载<span style="font-size:14px;font-weight:400;opacity:.8;">（适用于比特彗星）</span>',
                    1: "点击复制链接到剪切板，粘贴到比特彗星下载器中。"
                },
                footer: '<div style="text-align:center;">大冯老师助你搞网盘 · 本地增强版</div>'
            };
            // 夸克必须伪装成官方桌面客户端，否则下载接口拒绝访问
            const QUARK_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch";
            const PC_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

            const cfg = {
                baidu: Object.assign({}, common, {
                    ua: "pan.baidu.com",
                    pcs: {
                        0: "https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1",
                        1: "https://pan.baidu.com/api/sharedownload?channel=chunlei&clienttype=12&web=1&app_id=250528",
                        2: "https://pan.baidu.com/share/tplconfig?fields=sign,timestamp&channel=chunlei&web=1&app_id=250528&clienttype=0",
                        3: "https://openapi.baidu.com/oauth/2.0/authorize?client_id=IlLqBbU3GjQ0t46TRwFateTprHWl39zF&response_type=token&redirect_uri=oob&confirm_login=0&scope=basic,netdisk"
                    },
                    btn: { home: ".tcuLAu", main: ".wp-s-agile-tool-bar__header", share: ".module-share-top-bar .x-button-box" }
                }),
                ali: Object.assign({}, common, {
                    ua: PC_UA,
                    pcs: {
                        0: "https://api.aliyundrive.com/v2/file/get_share_link_download_url",
                        1: "https://api.aliyundrive.com/v2/file/get_download_url"
                    },
                    btn: { home: ".actions--M9Np-", share: ".right--x0Z1g" },
                    dom: {
                        list: '[class^="node-list-table-view--"]',
                        grid: '[class^="node-list-grid-view--"]',
                        switch: '[class^="switch-wrapper--"]'
                    }
                }),
                tianyi: Object.assign({}, common, {
                    ua: PC_UA,
                    pcs: {
                        0: "https://cloud.189.cn/api/open/file/getFileDownloadUrl.action",
                        1: "https://api.cloud.189.cn/open/oauth2/ssoH5.action",
                        2: "https://api.cloud.189.cn/open/file/getFileDownloadUrl.action"
                    },
                    btn: { home: ".nav-opea", share: ".nav-opea" }
                }),
                xunlei: Object.assign({}, common, {
                    ua: PC_UA,
                    pcs: { 0: "https://api-pan.xunlei.com/drive/v1/files/" },
                    btn: { home: ".FileMenu__menu--XBFEH", share: ".Share__batchActionBox--VKPyR" }
                }),
                quark: Object.assign({}, common, {
                    ua: QUARK_UA,
                    pcs: { 0: "https://drive.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc" },
                    // 优先用官方选择器；失效时回落到 QUARK_AUTO 自动探测
                    btn: { home: ".btn-operate .btn-main", share: ".file-info-share-buttom" }
                }),
                yidong: Object.assign({}, common, {
                    ua: PC_UA,
                    pcs: {
                        0: "https://yun.139.com/orchestration/personalCloud/uploadAndDownload/v1.0/downloadRequest",
                        1: "https://caiyun.139.com/stapi/outlink/content/download"
                    },
                    btn: { home: ".top_button", share: ".top-btns" }
                })
            };
            const host = location.host;
            if (/(pan|yun)\.baidu\.com/.test(host)) return cfg.baidu;
            if (/www\.(aliyundrive|alipan)\.com/.test(host)) return cfg.ali;
            if (/cloud\.189\.cn/.test(host)) return cfg.tianyi;
            if (/pan\.xunlei\.com/.test(host)) return cfg.xunlei;
            if (/pan\.quark\.cn/.test(host)) return cfg.quark;
            if (/(yun|caiyun)\.139\.com/.test(host)) return cfg.yidong;
            return cfg.quark;
        },

        // 统一配置获取：先试远程，失败则用内置
        async fetchPanConfig(panKey) {
            const url = `https://api.youxiaohou.com/config/v2${panKey ? "/" + panKey : ""}?ver=${version}&a=${author}`;
            try {
                const res = await base.post(url, {}, {}, "text");
                const parsed = JSON.parse(base.d(res));
                if (parsed && parsed.btn) {
                    console.log("[大冯老师] 远程配置加载成功: " + (panKey || "default"));
                    return parsed;
                }
                console.warn("[大冯老师] 远程配置内容无效，改用内置配置");
            } catch (e) {
                console.warn("[大冯老师] 远程配置接口不可用，已切换内置配置: " + (e && e.message ? e.message : e));
            }
            return this.getOfflinePan();
        },

        registerMenuCommand() {
            GM_registerMenuCommand('⚙️ 设置', () => {
                this.showSetting();
            });
        },

        createTip() {
            $('body').append('<div class="pl-tooltip"></div>');

            doc.on('mouseenter mouseleave', '.listener-tip', (e) => {
                if (e.type === 'mouseenter') {
                    let filename = e.currentTarget.innerText;
                    let size = e.currentTarget.dataset.size;
                    let tip = `${filename}<span style="margin-left: 10px;color: #f56c6c;">${size}</span>`;
                    $(e.currentTarget).css({opacity: '0.5'});
                    $('.pl-tooltip').html(tip).css({
                        'left': e.pageX + 10 + 'px',
                        'top': e.pageY - e.currentTarget.offsetTop > 14 ? e.pageY + 'px' : e.pageY + 20 + 'px'
                    }).show();
                } else {
                    $(e.currentTarget).css({opacity: '1'});
                    $('.pl-tooltip').hide(0);
                }
            });
        },

        createLoading() {
            return $('<div class="pl-loading"><div class="pl-loading-box"><div><div></div><div></div></div></div></div>');
        },

        createDownloadIframe() {
            let $div = $('<div style="padding:0;margin:0;display:block"></div>');
            let $iframe = $('<iframe src="javascript:;" id="downloadIframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);
        },

        getMirrorList(link, mirror, thread = 2) {
            let host = new URL(link).host;
            let mirrors = [];
            for (let i = 0; i < mirror.length; i++) {
                for (let j = 0; j < thread; j++) {
                    let item = link.replace(host, mirror[i]) + '&'.repeat(j);
                    mirrors.push(item);
                }
            }
            return mirrors.join('\n');
        },

        listenElement(element, callback) {
            const checkInterval = 500;
            let wasElementFound = false;
            let reportCount = 0;

            function checkElement() {
                let hit = null;
                try {
                    if (element === "QUARK_AUTO") {
                        hit = base.resolveQuarkToolbar();
                    } else {
                        hit = document.querySelector(element);
                    }
                } catch (e) {
                    console.error('[大冯老师] 选择器非法: ' + element);
                }
                if (hit) {
                    if (!wasElementFound) {
                        console.log('[大冯老师] 命中按钮容器: ' + element);
                    }
                    wasElementFound = true;
                    callback();
                } else if (wasElementFound) {
                    wasElementFound = false;
                } else {
                    // 每 ~6 秒提示一次未命中，避免刷屏
                    if (++reportCount % 12 === 1) {
                        console.warn('[大冯老师] 未找到按钮容器: ' + element + '（第' + reportCount + '次检查）');
                        if (element === "QUARK_AUTO" && reportCount === 13) {
                            base.reportToolbarCandidates();
                        }
                    }
                }

                setTimeout(checkElement, checkInterval);
            }

            checkElement();
        },

        addPanLinkerStyle() {
            color = base.getValue('setting_theme_color');
            let css = `
            body::-webkit-scrollbar { display: none }
            ::-webkit-scrollbar { width: 6px; height: 10px }
            ::-webkit-scrollbar-track { border-radius: 0; background: none }
            ::-webkit-scrollbar-thumb { background-color: rgba(85,85,85,.4) }
            ::-webkit-scrollbar-thumb,::-webkit-scrollbar-thumb:hover { border-radius: 5px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2) }
            ::-webkit-scrollbar-thumb:hover { background-color: rgba(85,85,85,.3) }
            .swal2-popup { font-size: 16px !important; }
            .pl-popup { font-size: 12px !important; }
            .pl-popup a { color: ${color} !important; }
            .pl-header { padding: 0!important;align-items: flex-start!important; border-bottom: 1px solid #eee!important; margin: 0 0 10px!important; padding: 0 0 5px!important; }
            .pl-title { font-size: 16px!important; line-height: 1!important;white-space: nowrap!important; text-overflow: ellipsis!important;}
            .pl-content { padding: 0 !important; font-size: 12px!important; }
            .pl-main { max-height: 400px;overflow-y:scroll; }
            .pl-footer {font-size: 12px!important;justify-content: flex-start!important; margin: 10px 0 0!important; padding: 5px 0 0!important; color: #f56c6c!important; }
            .pl-item { display: flex; align-items: center; line-height: 22px; }
            .pl-item-name { flex: 0 0 150px; text-align: left;margin-right: 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor:default; }
            .pl-item-link { flex: 1; overflow: hidden; text-align: left; white-space: nowrap; text-overflow: ellipsis;cursor:pointer }
            .pl-item-btn { background: ${color}; padding: 4px 5px; border-radius: 3px; line-height: 1; cursor: pointer; color: #fff; }
            .pl-item-tip { display: flex; justify-content: space-between;flex: 1; }
            .pl-back { width: 70px; background: #ddd; border-radius: 3px; cursor:pointer; margin:1px 0; }
            .pl-ext { display: inline-block; width: 44px; background: #999; color: #fff; height: 16px; line-height: 16px; font-size: 12px; border-radius: 3px;}
            .pl-retry {padding: 3px 10px; background: #cc3235; color: #fff; border-radius: 3px; cursor: pointer;}
            .pl-browserdownload { padding: 3px 10px; background: ${color}; color: #fff; border-radius: 3px; cursor: pointer;}
            .pl-item-progress { display:flex;flex: 1;align-items:center}
            .pl-progress { display: inline-block;vertical-align: middle;width: 100%; box-sizing: border-box;line-height: 1;position: relative;height:15px; flex: 1}
            .pl-progress-outer { height: 15px;border-radius: 100px;background-color: #ebeef5;overflow: hidden;position: relative;vertical-align: middle;}
            .pl-progress-inner{ position: absolute;left: 0;top: 0;background-color: #409eff;text-align: right;border-radius: 100px;line-height: 1;white-space: nowrap;transition: width .6s ease;}
            .pl-progress-inner-text { display: inline-block;vertical-align: middle;color: #d1d1d1;font-size: 12px;margin: 0 5px;height: 15px}
            .pl-progress-tip{ flex:1;text-align:right}
            .pl-progress-how{ flex: 0 0 90px; background: #ddd; border-radius: 3px; margin-left: 10px; cursor: pointer; text-align: center;}
            .pl-progress-stop{ flex: 0 0 50px; padding: 0 10px; background: #cc3235; color: #fff; border-radius: 3px; cursor: pointer;margin-left:10px;height:20px}
            .pl-progress-inner-text:after { display: inline-block;content: "";height: 100%;vertical-align: middle;}
            .pl-btn-primary { background: ${color}; border: 0; border-radius: 4px; color: #ffffff; cursor: pointer; font-size: 12px; outline: none; display:flex; align-items: center; justify-content: center; margin: 2px 0; padding: 6px 0;transition: 0.3s opacity; }
            .pl-btn-primary:hover { opacity: 0.9;transition: 0.3s opacity; }
            .pl-btn-success { background: #55af28; animation: easeOpacity 1.2s 2; animation-fill-mode:forwards }
            .pl-btn-info { background: #606266; }
            .pl-btn-warning { background: #da9328; }
            .pl-btn-warning { background: #da9328; }
            .pl-btn-danger { background: #cc3235; }
            .ali-button {display: inline-flex;align-items: center;justify-content: center;border: 0 solid transparent;border-radius: 5px;box-shadow: 0 0 0 0 transparent;width: fit-content;white-space: nowrap;flex-shrink: 0;font-size: 14px;line-height: 1.5;outline: 0;touch-action: manipulation;transition: background .3s ease,color .3s ease,border .3s ease,box-shadow .3s ease;color: #fff;background: rgb(99 125 255);margin-left: 20px;padding: 1px 12px;position: relative; cursor:pointer; height: 32px;}
            .ali-button:hover {background: rgb(122, 144, 255)}
            .tianyi-button {margin-right: 20px; padding: 4px 12px; border-radius: 4px; color: #fff; font-size: 12px; border: 1px solid #0073e3; background: #2b89ea; cursor: pointer; position: relative;}
            .tianyi-button:hover {border-color: #1874d3; background: #3699ff;}
            .yidong-button {float: left; position: relative; margin: 20px 24px 20px 0; width: 98px; height: 36px; background: #3181f9; border-radius: 2px; font-size: 14px; color: #fff; line-height: 39px; text-align: center; cursor: pointer;}
            .yidong-share-button {display: inline-block; position: relative; font-size: 14px; line-height: 36px; text-align: center; color: #fff; border: 1px solid #5a9afa; border-radius: 2px; padding: 0 24px; margin-left: 24px; background: #3181f9;}
            .yidong-button:hover {background: #2d76e5;}
            .xunlei-button {display: inline-flex;align-items: center;justify-content: center;border: 0 solid transparent;border-radius: 5px;box-shadow: 0 0 0 0 transparent;width: fit-content;white-space: nowrap;flex-shrink: 0;font-size: 14px;line-height: 1.5;outline: 0;touch-action: manipulation;transition: background .3s ease,color .3s ease,border .3s ease,box-shadow .3s ease;color: #fff;background: #3f85ff;margin-left: 12px;padding: 0px 12px;position: relative; cursor:pointer; height: 36px;}
            .xunlei-button:hover {background: #619bff}
            .quark-button {display: inline-flex; align-items: center; justify-content: center; border: 1px solid #ddd; border-radius: 8px; white-space: nowrap; flex-shrink: 0; font-size: 14px; line-height: 1.5; outline: 0; color: #333; background: #fff; margin-right: 10px; padding: 0px 14px; position: relative; cursor: pointer; height: 36px;}
            .quark-button:hover { background:#f6f6f6 }
            .pl-dropdown-menu {position: absolute;right: 0;top: 30px;padding: 5px 0;color: rgb(37, 38, 43);background: #fff;z-index: 999;width: 102px;border: 1px solid #ddd;border-radius: 10px; box-shadow: 0 0 1px 1px rgb(28 28 32 / 5%), 0 8px 24px rgb(28 28 32 / 12%);}
            .pl-dropdown-menu-item { height: 30px;display: flex;align-items: center;justify-content: center;cursor:pointer }
            .pl-dropdown-menu-item:hover { background-color: rgba(132,133,141,0.08);}
            .pl-button .pl-dropdown-menu { display: none; }
            .pl-button:hover .pl-dropdown-menu { display: block!important; }
            .pl-button-init { opacity: 0.5; animation: easeInitOpacity 1.2s 3; animation-fill-mode:forwards }
             @keyframes easeInitOpacity { from { opacity: 0.5; } 50% { opacity: 1 } to { opacity: 0.5; } }
             @keyframes easeOpacity { from { opacity: 1; } 50% { opacity: 0.35 } to { opacity: 1; } }
            .element-clicked { opacity: 0.5; }
            .pl-extra { margin-top: 10px;display:flex}
            .pl-extra button { flex: 1}
            .pointer { cursor:pointer }
            .pl-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 10px; }
            .pl-label { flex: 0 0 100px;text-align:left; }
            .pl-input { flex: 1; padding: 8px 10px; border: 1px solid #c2c2c2; border-radius: 5px; font-size: 14px }
            .pl-color { flex: 1;display: flex;flex-wrap: wrap; margin-right: -10px;}
            .pl-color-box { width: 35px;height: 35px;margin:10px 10px 0 0;; box-sizing: border-box;border:1px solid #fff;cursor:pointer }
            .pl-color-box.checked { border:3px dashed #111!important }
            .pl-close:focus { outline: 0; box-shadow: none; }
            .tag-danger {color:#cc3235;margin: 0 5px;}
            .pl-tooltip { position: absolute; color: #ffffff; max-width: 600px; font-size: 12px; padding: 5px 10px; background: #333; border-radius: 5px; z-index: 110000; line-height: 1.3; display:none; word-break: break-all;}
             @keyframes load { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
            .pl-loading-box > div > div { position: absolute;border-radius: 50%;}
            .pl-loading-box > div > div:nth-child(1) { top: 9px;left: 9px;width: 82px;height: 82px;background: #ffffff;}
            .pl-loading-box > div > div:nth-child(2) { top: 14px;left: 38px;width: 25px;height: 25px;background: #666666;animation: load 1s linear infinite;transform-origin: 12px 36px;}
            .pl-loading { width: 16px;height: 16px;display: inline-block;overflow: hidden;background: none;}
            .pl-loading-box { width: 100%;height: 100%;position: relative;transform: translateZ(0) scale(0.16);backface-visibility: hidden;transform-origin: 0 0;}
            .pl-loading-box div { box-sizing: content-box; }
            .swal2-container { z-index:100000!important; }
            body.swal2-height-auto { height: inherit!important; }
            .btn-operate .btn-main { display:flex; align-items:center; }
            `;
            this.addStyle('panlinker-style', 'style', css);
        },

        async initDialog() {
            // ==== 大冯老师改造：原「初始化」按钮改为扫码验证入口 ====
            // 与下载项点击走同一个门禁，不再使用已停摆的联网激活。
            await base.showAuthDialog('初始化按钮');
        },
    };

    let baidu = {

        _getExtra() {
            let seKey = decodeURIComponent(base.getCookie('BDCLND'));
            return '{' + '"sekey":"' + seKey + '"' + "}";
        },

        _getSurl() {
            let reg = /(?<=s\/|surl=)([a-zA-Z0-9_-]+)/g;
            if (reg.test(location.href)) {
                return location.href.match(reg)[0];
            }
            return '';
        },

        _getFidList() {
            let fidlist = [];
            selectList.forEach(v => {
                if (+v.isdir === 1) return;
                fidlist.push(v.fs_id);
            });
            return '[' + fidlist + ']';
        },

        _resetData() {
            progress = {};
            $.each(request, (key) => {
                (request[key]).abort();
            });
            $.each(ins, (key) => {
                clearInterval(ins[key]);
            });
            idm = {};
            ins = {};
            request = {};
        },

        setBDUSS() {
            try {
                GM_cookie && GM_cookie('list', {name: 'BDUSS'}, (cookies, error) => {
                    if (!error) {
                        base.setStorage("baiduyunPlugin_BDUSS", {BDUSS: cookies[0].value});
                    }
                });
            } catch (e) {
            }
        },

        getBDUSS() {
            let baiduyunPlugin_BDUSS = base.getStorage('baiduyunPlugin_BDUSS') ? base.getStorage('baiduyunPlugin_BDUSS') : '{"baiduyunPlugin_BDUSS":""}';
            return baiduyunPlugin_BDUSS.BDUSS || '';
        },

        convertLinkToAria(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                filename = base.fixFilename(filename);
                return encodeURIComponent(`aria2c "${link}" --out "${filename}" --header "User-Agent: ${ua}" --header "Cookie: BDUSS=${BDUSS}"`);
            }
            return {
                link: pan.assistant,
                text: pan.init[5]
            };
        },

        convertLinkToBC(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                let cookie = `BDUSS=${BDUSS}`;
                let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}&cookie=${encodeURIComponent(cookie)}&user_agent=${encodeURIComponent(ua)}ZZ`;
                return encodeURIComponent(`bc://http/${base.e(bc)}`);
            }
            return {
                link: pan.assistant,
                text: pan.init[5]
            };
        },

        convertLinkToCurl(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                let terminal = base.getValue('setting_terminal_type');
                filename = base.fixFilename(filename);
                return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}" -A "${ua}" -b "BDUSS=${BDUSS}"`);
            }
            return {
                link: pan.assistant,
                text: pan.init[5]
            };
        },

        addPageListener() {
            function _factory(e) {
                let target = $(e.target);
                let item = target.parents('.pl-item');
                let link = item.find('.pl-item-link');
                let progress = item.find('.pl-item-progress');
                let tip = item.find('.pl-item-tip');
                return {
                    item, link, progress, tip, target,
                };
            }

            function _reset(i) {
                ins[i] && clearInterval(ins[i]);
                request[i] && request[i].abort();
                progress[i] = 0;
                idm[i] = false;
            }

            doc.on('mouseenter mouseleave click', '.pl-button.g-dropdown-button', (e) => {
                if (e.type === 'mouseleave') {
                    $(e.currentTarget).removeClass('button-open');
                } else {
                    $(e.currentTarget).addClass('button-open');
                    $(e.currentTarget).find('.pl-dropdown-menu').show();
                }
            });
            doc.on('mouseleave', '.pl-button.g-dropdown-button .pl-dropdown-menu', (e) => {
                $(e.currentTarget).hide();
            });

            doc.on('click', '.pl-button-mode', async (e) => {
                mode = e.target.dataset.mode;
                // ==== 大冯老师门禁：未通过扫码验证则中止，不发任何解析请求 ====
                if (!(await base.requireAuth('下载助手菜单项'))) {
                    Swal.close();
                    message.error('提示：请先扫码关注并输入验证码，才可解析直链！');
                    return;
                }
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                let o = _factory(e);
                let $width = o.item.find('.pl-progress-inner');
                let $text = o.item.find('.pl-progress-inner-text');
                let filename = o.link[0].dataset.filename;
                let index = o.link[0].dataset.index;
                _reset(index);
                base.get(o.link[0].dataset.link, {"User-Agent": pan.ua}, 'blob', {filename, index});
                ins[index] = setInterval(() => {
                    let prog = +progress[index] || 0;
                    let isIDM = idm[index] || false;
                    if (isIDM) {
                        o.tip.hide();
                        o.progress.hide();
                        o.link.text('已成功唤起IDM，请查看IDM下载框！').animate({opacity: '0.5'}, "slow").show();
                        clearInterval(ins[index]);
                        idm[index] = false;
                    } else {
                        o.link.hide();
                        o.tip.hide();
                        o.progress.show();
                        $width.css('width', prog + '%');
                        $text.text(prog + '%');
                        if (prog === 100) {
                            clearInterval(ins[index]);
                            progress[index] = 0;
                            o.item.find('.pl-progress-stop').hide();
                            o.item.find('.pl-progress-tip').html('下载完成，正在弹出浏览器下载框！');
                        }
                    }
                }, 500);
            });
            doc.on('click', '.listener-retry', async (e) => {
                let o = _factory(e);
                o.tip.hide();
                o.link.show();
            });
            doc.on('click', '.listener-how', async (e) => {
                let o = _factory(e);
                let index = o.link[0].dataset.index;
                if (request[index]) {
                    request[index].abort();
                    clearInterval(ins[index]);
                    o.progress.hide();
                    o.tip.show();
                }

            });
            doc.on('click', '.listener-stop', async (e) => {
                let o = _factory(e);
                let index = o.link[0].dataset.index;
                if (request[index]) {
                    request[index].abort();
                    clearInterval(ins[index]);
                    o.tip.hide();
                    o.progress.hide();
                    o.link.show(0);
                }
            });
            doc.on('click', '.listener-back', async (e) => {
                let o = _factory(e);
                o.tip.hide();
                o.link.show();
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                if (!e.target.dataset.link) {
                    $(e.target).removeClass('listener-copy-all').addClass('pl-btn-danger').html(`${pan.init[5]}👉<a href="${pan.assistant}" target="_blank" class="pl-a">点击此处安装</a>👈`);
                } else {
                    base.setClipboard(decodeURIComponent(e.target.dataset.link));
                    $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else if (res === 'assistant') {
                    target.addClass('pl-btn-danger').html(`${pan.init[5]}👉<a href="${pan.assistant}" target="_blank" class="pl-a">点击此处安装</a>👈`);
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
            document.documentElement.addEventListener('mouseup', (e) => {
                if (e.target.nodeName === 'A' && ~e.target.className.indexOf('pl-a')) {
                    e.stopPropagation();
                }
            }, true);
        },

        addButton() {
            if (!pt) {
                console.warn('[大冯老师] pt 为空，跳过按钮注入（路由未被识别）');
                return;
            }
            let $toolWrap;
            let $button = $(`<div class="g-dropdown-button pointer pl-button"><div style="color:#fff;background: ${color};border-color:${color}" class="g-button g-button-blue"><span class="g-button-right"><em class="icon icon-download"></em><span class="text" style="width: 60px;">下载助手</span></span></div><div class="menu" style="width:auto;z-index:41;border-color:${color}"><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="api">API下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="aria">Aria下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="rpc">RPC下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="curl">cURL下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="bc">BC下载</div>${pan.code == 200 && version < pan.version ? pan.new : ''}</div></div>`);
            if (pt === 'home') $toolWrap = $(pan.btn.home);
            if (pt === 'main') {
                $toolWrap = $(pan.btn.main);
                $button = $(`<div class="pl-button" style="position: relative; display: inline-block; margin-right: 8px;"><button class="u-button u-button--primary u-button--small is-round is-has-icon" style="background: ${color};border-color: ${color};font-size: 14px; padding: 8px 16px; border: none;"><i class="u-icon u-icon-download"></i><span>下载助手</span></button><ul class="dropdown-list nd-common-float-menu pl-dropdown-menu"><li class="sub cursor-p pl-button-mode" data-mode="api">API下载</li><li class="sub cursor-p pl-button-mode" data-mode="aria">Aria下载</li><li class="sub cursor-p pl-button-mode" data-mode="rpc">RPC下载</li><li class="sub cursor-p pl-button-mode" data-mode="curl">cURL下载</li><li class="sub cursor-p pl-button-mode" data-mode="bc" >BC下载</li>${pan.code == 200 && version < pan.version ? pan.newX : ''}</ul></div>`);
            }
            if (pt === 'share') $toolWrap = $(pan.btn.share);
            $toolWrap.prepend($button);
            this.setBDUSS();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="g-dropdown-button pointer pl-button-init" style="opacity:.5"><div style="color:#fff;background: ${color};border-color:${color}" class="g-button g-button-blue"><span class="g-button-right"><em class="icon icon-download"></em><span class="text" style="width: 60px;">下载助手</span></span></div></div>`);
            if (pt === 'home') $toolWrap = $(pan.btn.home);
            if (pt === 'main') {
                $toolWrap = $(pan.btn.main);
                $button = $(`<div class="pl-button-init" style="opacity:.5; display: inline-block; margin-right: 8px;"><button class="u-button u-button--primary u-button--small is-round is-has-icon" style="background: ${color};border-color: ${color};font-size: 14px; padding: 8px 16px; border: none;"><i class="u-icon u-icon-download"></i><span>下载助手</span></button></div>`);
            }
            if (pt === 'share') $toolWrap = $(pan.btn.share);
            $toolWrap.prepend($button);
            $button.click(() => base.initDialog());
        },

        async getToken() {
            let res = await base.getFinalUrl(pan.pcs[3]);
            if (res.indexOf('access_token') === -1) {
                let html = await base.get(pan.pcs[3], {}, 'text');
                let bdstoken = html.match(/name="bdstoken"\s+value="([^"]+)"/)?.[1];
                let client_id = html.match(/name="client_id"\s+value="([^"]+)"/)?.[1];
                let data = {
                    grant_permissions_arr: 'netdisk',
                    bdstoken: bdstoken,
                    client_id: client_id,
                    response_type: "token",
                    display: "page",
                    grant_permissions: "basic,netdisk"
                }
                await base.post(pan.pcs[3], base.stringify(data), {
                    'Content-Type': 'application/x-www-form-urlencoded',
                })
                let res2 = await base.getFinalUrl(pan.pcs[3]);
                let accessToken = res2.match(/access_token=([^&]+)/)?.[1];
                accessToken && base.setStorage('accessToken', accessToken);
                return accessToken;
            }
            let accessToken = res.match(/access_token=([^&]+)/)?.[1];
            accessToken && base.setStorage('accessToken', accessToken);
            return accessToken;
        },

        async getPCSLink(maxRequestTime = 2) {
        // ==== 大冯老师门禁：纵深防御，任何调用路径都拦 ====
        if (!base.isAuthed()) {
            Swal.close();
            const ok = await base.showAuthDialog('解析直链');
            if (!ok) {
                message.error('提示：未通过验证，已中止直链解析。');
                return;
            }
        }
            selectList = this.getSelectedList();
            let fidList = this._getFidList(), url, res;

            if (pt === 'home' || pt === 'main') {
                if (selectList.length === 0) {
                    return message.error('提示：请先勾选要下载的文件！');
                }
                if (fidList.length === 2) {
                    return message.error('提示：请打开文件夹后勾选文件！');
                }
                fidList = encodeURIComponent(fidList);
                let accessToken = base.getStorage('accessToken') || await this.getToken();
                url = `${pan.pcs[0]}&fsids=${fidList}&access_token=${accessToken}`;
                res = await base.get(url, {"User-Agent": pan.ua});
            }
            if (pt === 'share') {
                this.getShareData();
                if (selectList.length === 0) {
                    return message.error('提示：请先勾选要下载的文件！');
                }
                if (fidList.length === 2) {
                    return message.error('提示：请打开文件夹后勾选文件！');
                }
                if (!params.sign) {
                    let url = `${pan.pcs[2]}&surl=${params.surl}&logid=${params.logid}`;
                    let r = await base.get(url);
                    if (r.errno === 0) {
                        params.sign = r.data.sign;
                        params.timestamp = r.data.timestamp;
                    } else {
                        let dialog = await Swal.fire({
                            toast: true,
                            icon: 'info',
                            title: `提示：请将文件<span class="tag-danger">[保存到网盘]</span>👉前往<span class="tag-danger">[我的网盘]</span>中下载！`,
                            showConfirmButton: true,
                            confirmButtonText: '点击保存',
                            position: 'top',
                        });
                        if (dialog.isConfirmed) {
                            $('.tools-share-save-hb')[0].click();
                        }
                        return;
                    }
                }
                if (!params.bdstoken) {
                    return message.error('提示：请先登录网盘！');
                }
                let formData = new FormData();
                formData.append('encrypt', params.encrypt);
                formData.append('product', params.product);
                formData.append('uk', params.uk);
                formData.append('primaryid', params.primaryid);
                formData.append('fid_list', fidList);
                formData.append('logid', params.logid);
                params.shareType === 'secret' ? formData.append('extra', params.extra) : '';
                url = `${pan.pcs[1]}&sign=${params.sign}&timestamp=${params.timestamp}`;
                res = await base.post(url, formData, {"User-Agent": pan.ua});
            }
            if (res.errno === 0) {
                let html = this.generateDom(res.list);
                this.showMainDialog(pan[mode][0], html, pan[mode][1]);
            } else if (res.errno === 112) {
                return message.error('提示：页面过期，请刷新重试！');
            } else if (res.errno === 9019) {
                maxRequestTime--;
                await this.getToken();
                if (maxRequestTime > 0) {
                    await this.getPCSLink(maxRequestTime);
                } else {
                    message.error('提示：获取下载链接失败！请刷新网页后重试！');
                }
            } else {
                message.error('提示：获取下载链接失败！请刷新网页后重试！');
            }
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            base.sortByName(list);
            list.forEach((v, i) => {
                if (v.isdir === 1) return;
                let filename = v.server_filename || v.filename;
                let ext = base.getExtension(filename);
                let size = base.sizeFormat(v.size);
                let dlink = v.dlink;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a listener-link-api" href="${dlink}" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                <div class="pl-item-tip" style="display: none"><span>若没有弹出IDM下载框，找到IDM <b>选项</b> -> <b>文件类型</b> -> <b>第一个框</b> 中添加后缀 <span class="pl-ext">${ext}</span>，<a href="${pan.idm}" target="_blank" class="pl-a">详见此处</a></span> <span class="pl-back listener-back">返回</span></div>
                                <div class="pl-item-progress" style="display: none">
                                    <div class="pl-progress">
                                        <div class="pl-progress-outer"></div>
                                        <div class="pl-progress-inner" style="width:5%">
                                          <div class="pl-progress-inner-text">0%</div>
                                        </div>
                                    </div>
                                    <span class="pl-progress-stop listener-stop">取消下载</span>
                                    <span class="pl-progress-tip">未发现IDM，使用自带浏览器下载</span>
                                    <span class="pl-progress-how listener-how">如何唤起IDM？</span>
                                </div></div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, pan.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${alink.link}" data-filename="${filename}" data-link="${alink.link}">${decodeURIComponent(alink.text)}</a> </div>`;
                    } else {
                        alinkAllText += alink + '\r\n';
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                    }
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, pan.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${alink.link}" data-filename="${filename}" data-link="${alink.link}">${decodeURIComponent(alink.text)}</a> </div>`;
                    } else {
                        alinkAllText += alink + '\r\n';
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                    }
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, pan.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${alink.link}" data-filename="${filename}" data-link="${alink.link}">${decodeURIComponent(alink.text)}</a> </div>`;
                    } else {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                    }

                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                const rpcDomain = base.getValue('setting_rpc_domain');
const rpcPort = base.getValue('setting_rpc_port');
const rpcPath = base.getValue('setting_rpc_path');

if (!rpcDomain || !rpcPort) {
  console.error('[大冯老师] 请先配置 RPC 服务器地址与端口');
  message.error('请填写 RPC 服务器地址与端口！');
  return;
}

let url = `${rpcDomain}:${rpcPort}${rpcPath ? (/^\//.test(rpcPath) ? rpcPath : '/' + rpcPath) : ''}`;
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };
            let BDUSS = this.getBDUSS();
            if (!BDUSS) return 'assistant';

            let url = `${rpc.domain}:${rpc.port}${/^\//.test(rpc.path) ? rpc.path : "/" + rpc.path}`.replace(/([^:])\/{2,}/g, "$1/");
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: [`User-Agent: ${pan.ua}`, `Cookie: BDUSS=${BDUSS}`]
                }]
            };
            try {
                let res = await base.post(url, rpcData, {"User-Agent": pan.ua}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                return require('system-core:context/context.js').instanceForSystem.list.getSelected();
            } catch (e) {
                return document.querySelector('.wp-s-core-pan').__vue__.selectedList;
            }
        },

        getLogid() {
            let ut = require("system-core:context/context.js").instanceForSystem.tools.baseService;
            return ut.base64Encode(base.getCookie("BAIDUID"));
        },

        getShareData() {
            let res = locals.dump();
            params.shareType = 'secret';
            params.sign = '';
            params.timestamp = '';
            params.bdstoken = res.bdstoken.value;
            params.channel = 'chunlei';
            params.clienttype = 0;
            params.web = 1;
            params.app_id = 250528;
            params.encrypt = 0;
            params.product = 'share';
            params.logid = this.getLogid();
            params.primaryid = res.shareid.value;
            params.uk = res.share_uk.value;
            params.shareType === 'secret' && (params.extra = this._getExtra());
            params.surl = this._getSurl();
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/disk\/home/.test(path)) return 'home';
            if (/^\/disk\/main/.test(path)) return 'main';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
            return '';
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            }).then(() => {
                this._resetData();
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            pan = await base.fetchPanConfig('');
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let ali = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}" --header "Referer: https://www.aliyundrive.com/"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}&refer=${encodeURIComponent('https://www.aliyundrive.com/')}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}" -e "https://www.aliyundrive.com/"`);
        },

        addPageListener() {
            doc.on('click', '.pl-button-mode', async (e) => {
                mode = e.target.dataset.mode;
                // ==== 大冯老师门禁：未通过扫码验证则中止，不发任何解析请求 ====
                if (!(await base.requireAuth('下载助手菜单项'))) {
                    Swal.close();
                    message.error('提示：请先扫码关注并输入验证码，才可解析直链！');
                    return;
                }
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                let dataset = e.currentTarget.dataset;
                let href = dataset.link;
                let url = await this.getRealLink(dataset.did, dataset.fid);
                if (url) href = url;
                $('#downloadIframe').attr('src', href);
                // let d = document.createElement("a");
                // d.download = e.currentTarget.dataset.filename;
                // d.rel = "noopener";
                // d.href = href;
                // d.dispatchEvent(new MouseEvent("click"));
            });
            doc.on('click', '.listener-link-api-btn', async (e) => {
                base.setClipboard(e.target.dataset.filename);
                $(e.target).text('复制成功').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        async getRealLink(d, f) {
            let authorization = `${base.getStorage('token').token_type} ${base.getStorage('token').access_token}`;
            let res = await base.post(pan.pcs[1], {
                drive_id: d,
                file_id: f
            }, {
                authorization,
                "content-type": "application/json;charset=utf-8",
            });
            if (res.url) {
                return res.url;
            }
            return '';
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="ali-button pl-button"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M853.333 938.667H170.667a85.333 85.333 0 0 1-85.334-85.334v-384A85.333 85.333 0 0 1 170.667 384H288a32 32 0 0 1 0 64H170.667a21.333 21.333 0 0 0-21.334 21.333v384a21.333 21.333 0 0 0 21.334 21.334h682.666a21.333 21.333 0 0 0 21.334-21.334v-384A21.333 21.333 0 0 0 853.333 448H736a32 32 0 0 1 0-64h117.333a85.333 85.333 0 0 1 85.334 85.333v384a85.333 85.333 0 0 1-85.334 85.334z" fill="#fff"/><path d="M715.03 543.552a32.81 32.81 0 0 0-46.251 0L554.005 657.813v-540.48a32 32 0 0 0-64 0v539.734L375.893 543.488a32.79 32.79 0 0 0-46.229 0 32.427 32.427 0 0 0 0 46.037l169.557 168.811a32.81 32.81 0 0 0 46.251 0l169.557-168.81a32.47 32.47 0 0 0 0-45.974z" fill="#FF9C00"/></svg><span>下载助手</span><ul class="pl-dropdown-menu"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li>${pan.code == 200 && version < pan.version ? pan.new : ''}</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    base.injectButton($toolWrap, $button, '.pl-button');
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    base.injectButton($toolWrap, $button, '.pl-button');
                })
            }
            base.createDownloadIframe();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="ali-button pl-button-init"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M853.333 938.667H170.667a85.333 85.333 0 0 1-85.334-85.334v-384A85.333 85.333 0 0 1 170.667 384H288a32 32 0 0 1 0 64H170.667a21.333 21.333 0 0 0-21.334 21.333v384a21.333 21.333 0 0 0 21.334 21.334h682.666a21.333 21.333 0 0 0 21.334-21.334v-384A21.333 21.333 0 0 0 853.333 448H736a32 32 0 0 1 0-64h117.333a85.333 85.333 0 0 1 85.334 85.333v384a85.333 85.333 0 0 1-85.334 85.334z" fill="#fff"/><path d="M715.03 543.552a32.81 32.81 0 0 0-46.251 0L554.005 657.813v-540.48a32 32 0 0 0-64 0v539.734L375.893 543.488a32.79 32.79 0 0 0-46.229 0 32.427 32.427 0 0 0 0 46.037l169.557 168.811a32.81 32.81 0 0 0 46.251 0l169.557-168.81a32.47 32.47 0 0 0 0-45.974z" fill="#FF9C00"/></svg><span>下载助手</span></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    base.injectButton($toolWrap, $button, '.pl-button-init');
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-butto-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            $button.click(() => base.initDialog());
        },

        async getPCSLink() {
        // ==== 大冯老师门禁：纵深防御，任何调用路径都拦 ====
        if (!base.isAuthed()) {
            Swal.close();
            const ok = await base.showAuthDialog('解析直链');
            if (!ok) {
                message.error('提示：未通过验证，已中止直链解析。');
                return;
            }
        }
            let reactDomGrid = document.querySelector(pan.dom.grid);
            if (reactDomGrid) {
                let res = await Swal.fire({
                    title: '提示',
                    html: '<div style="display: flex;align-items: center;justify-content: center;">请先切换到 <b>列表视图</b>（<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M132 928c-32.8 0-59.2-26.4-59.2-59.2s26.4-59.2 59.2-59.2h760c32.8 0 59.2 26.4 59.2 59.2S924.8 928 892 928H132zm0-356.8c-32.8 0-59.2-26.4-59.2-59.2s26.4-59.2 59.2-59.2h760c32.8 0 59.2 26.4 59.2 59.2s-26.4 59.2-59.2 59.2H132zm0-356c-32.8 0-59.2-26.4-59.2-59.2S99.2 96.8 132 96.8h760c32.8 0 59.2 26.4 59.2 59.2s-26.4 59.2-59.2 59.2H132z"/></svg>）后获取！</div>',
                    confirmButtonText: '点击切换'
                });
                if (res) {
                    document.querySelector(pan.dom.switch).click();
                    return message.success('切换成功，请重新获取下载链接！');
                }
                return false;
            }
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }
            if (pt === 'share') {
                if (selectList.length > 20) {
                    return message.error('提示：单次最多可勾选 20 个文件！');
                }
                try {
                    let authorization = `${base.getStorage('token').token_type} ${base.getStorage('token').access_token}`;
                    let xShareToken = base.getStorage('shareToken').share_token;

                    for (let i = 0; i < selectList.length; i++) {
                        let res = await base.post(pan.pcs[0], {
                            expire_sec: 600,
                            file_id: selectList[i].fileId,
                            share_id: selectList[i].shareId
                        }, {
                            authorization,
                            "content-type": "application/json;charset=utf-8",
                            "x-share-token": xShareToken
                        });
                        if (res.download_url) {
                            selectList[i].downloadUrl = res.download_url;
                        }
                    }
                } catch (e) {
                    return message.error('提示：请先登录网盘！');
                }
            }
            let html = this.generateDom(selectList);
            this.showMainDialog(pan[mode][0], html, pan[mode][1]);
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.type === 'folder') return;
                let filename = v.name;
                let fid = v.fileId;
                let did = v.driveId;
                let size = base.sizeFormat(v.size);
                let dlink = v.downloadUrl || v.url;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-did="${did}" data-fid="${fid}" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                <div class="pl-item-btn listener-link-api-btn" data-filename="${filename}">复制文件名</div>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                const rpcDomain = base.getValue('setting_rpc_domain');
const rpcPort = base.getValue('setting_rpc_port');
const rpcPath = base.getValue('setting_rpc_path');

if (!rpcDomain || !rpcPort) {
  console.error('[大冯老师] 请先配置 RPC 服务器地址与端口');
  message.error('请填写 RPC 服务器地址与端口！');
  return;
}

let url = `${rpcDomain}:${rpcPort}${rpcPath ? (/^\//.test(rpcPath) ? rpcPath : '/' + rpcPath) : ''}`;
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${/^\//.test(rpc.path) ? rpc.path : "/" + rpc.path}`.replace(/([^:])\/{2,}/g, "$1/");
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: [`Referer: https://www.aliyundrive.com/`]
                }]
            };
            try {
                let res = await base.post(url, rpcData, {"Referer": "https://www.aliyundrive.com/"}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                let selectedList = [];
                let reactDom = document.querySelector(pan.dom.list);
                let reactObj = base.findReact(reactDom, 1);
                let props = reactObj.pendingProps;
                if (props) {
                    let fileList = props.dataSource || [];
                    let selectedKeys = props.selectedKeys.split(',');
                    fileList.forEach((val) => {
                        if (selectedKeys.includes(val.fileId)) {
                            selectedList.push(val);
                        }
                    });
                }
                return selectedList;
            } catch (e) {
                return [];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/(drive)/.test(path)) return 'home';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].type === 'file') return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            pan = await base.fetchPanConfig('ali');
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let tianyi = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}"`);
        },

        addPageListener() {
            doc.on('click', '.pl-button-mode', async (e) => {
                mode = e.target.dataset.mode;
                // ==== 大冯老师门禁：未通过扫码验证则中止，不发任何解析请求 ====
                if (!(await base.requireAuth('下载助手菜单项'))) {
                    Swal.close();
                    message.error('提示：请先扫码关注并输入验证码，才可解析直链！');
                    return;
                }
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                $('#downloadIframe').attr('src', e.currentTarget.dataset.link);
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="tianyi-button pl-button">下载助手<ul class="pl-dropdown-menu" style="top: 26px;"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li>${pan.code == 200 && version < pan.version ? pan.new : ''}</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    base.injectButton($toolWrap, $button, '.pl-button');
                })
            }
            if (pt === 'share') {
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    base.injectButton($toolWrap, $button, '.pl-button');
                })
            }
            base.createDownloadIframe();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="tianyi-button pl-button-init">下载助手</div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    base.injectButton($toolWrap, $button, '.pl-button-init');
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    base.injectButton($toolWrap, $button, '.pl-button-init');
                })
            }
            $button.click(() => base.initDialog());
        },

        async getToken() {
            let res = await base.getFinalUrl(pan.pcs[1], {});
            let accessToken = res.match(/accessToken=(\w+)/)?.[1];
            accessToken && base.setStorage('accessToken', accessToken);
            return accessToken;
        },

        async getFileUrlByOnce(item, index, token) {
            try {
                if (item.downloadUrl) return {
                    index,
                    downloadUrl: item.downloadUrl
                };
                let time = Date.now(),
                    fileId = item.fileId,
                    o = "AccessToken=" + token + "&Timestamp=" + time + "&fileId=" + fileId,
                    url = pan.pcs[2] + '?fileId=' + fileId;
                if (item.shareId) {
                    o = "AccessToken=" + token + "&Timestamp=" + time + "&dt=1&fileId=" + fileId + "&shareId=" + item.shareId;
                    url += '&dt=1&shareId=' + item.shareId;
                }
                let sign = md5(o).toString();
                let res = await base.get(url, {
                    "accept": "application/json;charset=UTF-8",
                    "sign-type": 1,
                    "accesstoken": token,
                    "timestamp": time,
                    "signature": sign
                });
                if (res.res_code === 0) {
                    return {
                        index,
                        downloadUrl: res.fileDownloadUrl
                    };
                } else if (res.errorCode === 'InvalidSessionKey') {
                    return {
                        index,
                        downloadUrl: '提示：请先登录网盘！'
                    };
                } else if (res.res_code === 'ShareNotFoundFlatDir') {
                    return {
                        index,
                        downloadUrl: '提示：请先[转存]文件，👉前往[我的网盘]中下载！'
                    };
                } else {
                    return {
                        index,
                        downloadUrl: '获取下载地址失败，请刷新重试！'
                    };
                }
            } catch (e) {
                return {
                    index,
                    downloadUrl: '获取下载地址失败，请刷新重试！'
                };
            }
        },

        async getPCSLink() {
        // ==== 大冯老师门禁：纵深防御，任何调用路径都拦 ====
        if (!base.isAuthed()) {
            Swal.close();
            const ok = await base.showAuthDialog('解析直链');
            if (!ok) {
                message.error('提示：未通过验证，已中止直链解析。');
                return;
            }
        }
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }
            let token = base.getStorage('accessToken') || await this.getToken();
            if (!token) {
                return message.error('提示：请先登录网盘！');
            }
            let queue = [];
            selectList.forEach((item, index) => {
                queue.push(this.getFileUrlByOnce(item, index, token));
            });

            const res = await Promise.all(queue);
            res.forEach(val => {
                selectList[val.index].downloadUrl = val.downloadUrl;
            });

            let html = this.generateDom(selectList);
            this.showMainDialog(pan[mode][0], html, pan[mode][1]);
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.isFolder) return;
                let filename = v.fileName;
                let size = base.sizeFormat(v.size);
                let dlink = v.downloadUrl;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                const rpcDomain = base.getValue('setting_rpc_domain');
const rpcPort = base.getValue('setting_rpc_port');
const rpcPath = base.getValue('setting_rpc_path');

if (!rpcDomain || !rpcPort) {
  console.error('[大冯老师] 请先配置 RPC 服务器地址与端口');
  message.error('请填写 RPC 服务器地址与端口！');
  return;
}

let url = `${rpcDomain}:${rpcPort}${rpcPath ? (/^\//.test(rpcPath) ? rpcPath : '/' + rpcPath) : ''}`;
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${/^\//.test(rpc.path) ? rpc.path : "/" + rpc.path}`.replace(/([^:])\/{2,}/g, "$1/");
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: []
                }]
            };
            try {
                let res = await base.post(url, rpcData, {}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                return document.querySelector(".c-file-list").__vue__.selectedList;
            } catch (e) {
                return [document.querySelector(".info-detail").__vue__.fileDetail];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/web\/main/.test(path)) return 'home';
            if (/^\/web\/share/.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (!selectList[i].isFolder) return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            pan = await base.fetchPanConfig('tianyi');
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            this.getToken();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let xunlei = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}"`);
        },

        addPageListener() {
            doc.on('click', '.pl-button-mode', async (e) => {
                mode = e.target.dataset.mode;
                // ==== 大冯老师门禁：未通过扫码验证则中止，不发任何解析请求 ====
                if (!(await base.requireAuth('下载助手菜单项'))) {
                    Swal.close();
                    message.error('提示：请先扫码关注并输入验证码，才可解析直链！');
                    return;
                }
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                $('#downloadIframe').attr('src', e.currentTarget.dataset.link);
            });
            doc.on('click', '.listener-link-api-btn', async (e) => {
                base.setClipboard(e.target.dataset.filename);
                $(e.target).text('复制成功').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-bc-btn', async (e) => {
                let mirror = base.getMirrorList(e.target.dataset.dlink, pan.mirror);
                base.setClipboard(mirror);
                $(e.target).text('复制成功').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="xunlei-button pl-button"><i class="xlpfont xlp-download"></i><span style="font-size: 13px;margin-left: 6px;">下载助手</span><ul class="pl-dropdown-menu" style="top: 34px;"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li>${pan.code == 200 && version < pan.version ? pan.new : ''}</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    base.injectButton($toolWrap, $button, '.pl-button');
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    base.injectButton($toolWrap, $button, '.pl-button');
                })
            }
            base.createDownloadIframe();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="xunlei-button pl-button-init"><i class="xlpfont xlp-download"></i><span style="font-size: 13px;margin-left: 6px;">下载助手</span></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    base.injectButton($toolWrap, $button, '.pl-button-init');
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    base.injectButton($toolWrap, $button, '.pl-button-init');
                })
            }
            $button.click(() => base.initDialog());
        },

        getToken() {
            let credentials = {}, captcha = {};
            for (let i = 0; i < localStorage.length; i++) {
                if (/^credentials_/.test(localStorage.key(i))) {
                    credentials = base.getStorage(localStorage.key(i));
                    base.setStorage('');
                }
                if (/^captcha_[\w]{16}/.test(localStorage.key(i))) {
                    captcha = base.getStorage(localStorage.key(i));
                }
            }
            let deviceid = /(\w{32})/.exec(base.getStorage('deviceid').split(','))[0];
            let token = {
                credentials,
                captcha,
                deviceid
            };
            return token;
        },

        async getFileUrlByOnce(item, index, token) {
            try {
                if (item.downloadUrl) return {
                    index,
                    downloadUrl: item.downloadUrl
                };
                let res = await base.get(pan.pcs[0] + item.id, {
                    'Authorization': `${token.credentials.token_type} ${token.credentials.access_token}`,
                    'content-type': "application/json",
                    'x-captcha-token': token.captcha.token,
                    'x-device-id': token.deviceid,
                });
                if (res.web_content_link) {
                    return {
                        index,
                        downloadUrl: res.web_content_link
                    };
                } else {
                    return {
                        index,
                        downloadUrl: '获取下载地址失败，请刷新重试！'
                    };
                }
            } catch (e) {
                return message.error('提示：请先登录网盘后刷新页面！');
            }
        },

        async getPCSLink() {
        // ==== 大冯老师门禁：纵深防御，任何调用路径都拦 ====
        if (!base.isAuthed()) {
            Swal.close();
            const ok = await base.showAuthDialog('解析直链');
            if (!ok) {
                message.error('提示：未通过验证，已中止直链解析。');
                return;
            }
        }
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }
            if (pt === 'home') {
                let queue = [];
                let token = this.getToken();
                selectList.forEach((item, index) => {
                    queue.push(this.getFileUrlByOnce(item, index, token));
                });
                const res = await Promise.all(queue);
                res.forEach(val => {
                    selectList[val.index].downloadUrl = val.downloadUrl;
                });
            } else {
                message.error('提示：请保存到自己网盘后去网盘主页下载！');
                await base.sleep(1000);
                document.querySelector('.saveToCloud').click();
                return;
            }
            let html = this.generateDom(selectList);
            this.showMainDialog(pan[mode][0], html, pan[mode][1]);

        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.kind === 'drive#folder') return;
                let filename = v.name;
                let size = base.sizeFormat(+v.size);
                let dlink = v.downloadUrl;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                <div class="pl-item-btn listener-link-api-btn" data-filename="${filename}">复制文件名</div>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> 
                                <div class="pl-item-btn listener-link-bc-btn" data-dlink="${dlink}">复制镜像地址</div>
                                </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                const rpcDomain = base.getValue('setting_rpc_domain');
const rpcPort = base.getValue('setting_rpc_port');
const rpcPath = base.getValue('setting_rpc_path');

if (!rpcDomain || !rpcPort) {
  console.error('[大冯老师] 请先配置 RPC 服务器地址与端口');
  message.error('请填写 RPC 服务器地址与端口！');
  return;
}

let url = `${rpcDomain}:${rpcPort}${rpcPath ? (/^\//.test(rpcPath) ? rpcPath : '/' + rpcPath) : ''}`;
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${/^\//.test(rpc.path) ? rpc.path : "/" + rpc.path}`.replace(/([^:])\/{2,}/g, "$1/");
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: []
                }]
            };
            try {
                let res = await base.post(url, rpcData, {}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                let doms = document.querySelectorAll('.SourceListItem__item--XxpOC');
                let selectedList = [];
                for (let dom of doms) {
                    let domVue = dom.__vue__;
                    if (domVue.selected.includes(domVue.info.id)) {
                        selectedList.push(domVue.info);
                    }
                }
                return selectedList;
            } catch (e) {
                return [];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/$/.test(path)) return 'home';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].kind === 'drive#file') return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            pan = await base.fetchPanConfig('xunlei');
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let quark = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}" --header "Cookie: ${document.cookie}"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}&cookie=${encodeURIComponent(document.cookie)}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}" -b "${document.cookie}"`);
        },

        addPageListener() {
            window.addEventListener('hashchange', async (e) => {
                let home = 'https://pan.quark.cn/list#/', all = 'https://pan.quark.cn/list#/list/all';
                if (e.oldURL === home && e.newURL === all) return;
                await base.sleep(150);
                if ($('.quark-button').length > 0) return;
                pan.num === base.getValue('setting_init_code') ||
                pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            });
            doc.on('click', '.pl-button-mode', async (e) => {
                mode = e.target.dataset.mode;
                // ==== 大冯老师门禁：未通过扫码验证则中止，不发任何解析请求 ====
                if (!(await base.requireAuth('下载助手菜单项'))) {
                    Swal.close();
                    message.error('提示：请先扫码关注并输入验证码，才可解析直链！');
                    return;
                }
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                $('#downloadIframe').attr('src', e.currentTarget.dataset.link);
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="quark-button pl-button"><svg width="22" height="22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#555" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 2-2z"/><path d="M14 8h1.553c.85 0 1.16.093 1.47.267.311.174.556.43.722.756.166.326.255.65.255 1.54v4.873c0 .892-.089 1.215-.255 1.54-.166.327-.41.583-.722.757-.31.174-.62.267-1.47.267H6.447c-.85 0-1.16-.093-1.47-.267a1.778 1.778 0 01-.722-.756c-.166-.326-.255-.65-.255-1.54v-4.873c0-.892.089-1.215.255-1.54.166-.327.41-.583.722-.757.31-.174.62-.267 1.47-.267H11"/><path stroke-linecap="round" stroke-linejoin="round" d="M11 3v10"/></g></svg><b>下载助手</b><ul class="pl-dropdown-menu"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li>${pan.code == 200 && version < pan.version ? pan.new : ''}</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = base.getToolbarWrap(pan.btn.home);
                    if (base.injectButton($toolWrap, $button, '.pl-button')) {
                        console.log('[大冯老师] 按钮已注入到工具栏');
                    }
                });
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = base.getToolbarWrap(pan.btn.share);
                    if (base.injectButton($toolWrap, $button, '.pl-button')) {
                        console.log('[大冯老师] 按钮已注入到工具栏(share)');
                    }
                });
            }
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="quark-button pl-button-init"><svg width="22" height="22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#555" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 2-2z"/><path d="M14 8h1.553c.85 0 1.16.093 1.47.267.311.174.556.43.722.756.166.326.255.65.255 1.54v4.873c0 .892-.089 1.215-.255 1.54-.166.327-.41.583-.722.757-.31.174-.62.267-1.47.267H6.447c-.85 0-1.16-.093-1.47-.267a1.778 1.778 0 01-.722-.756c-.166-.326-.255-.65-.255-1.54v-4.873c0-.892.089-1.215.255-1.54.166-.327.41-.583.722-.757.31-.174.62-.267 1.47-.267H11"/><path stroke-linecap="round" stroke-linejoin="round" d="M11 3v10"/></g></svg><b>下载助手</b></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = base.getToolbarWrap(pan.btn.home);
                    if (base.injectButton($toolWrap, $button, '.pl-button-init')) {
                        console.log('[大冯老师] 按钮已注入到工具栏(init)');
                    }
                });
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = base.getToolbarWrap(pan.btn.share);
                    base.injectButton($toolWrap, $button, '.pl-button-init');
                });
            }
            $button.click(() => base.initDialog());
        },

        async getPCSLink() {
        // ==== 大冯老师门禁：纵深防御，任何调用路径都拦 ====
        if (!base.isAuthed()) {
            Swal.close();
            const ok = await base.showAuthDialog('解析直链');
            if (!ok) {
                message.error('提示：未通过验证，已中止直链解析。');
                return;
            }
        }
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }
            let fids = [];
            selectList.forEach(val => {
                fids.push(val.fid);
            });
            if (pt === 'home') {
                const api = pan.pcs && pan.pcs[0];
                if (!api) {
                    Swal.close();
                    return message.error('提示：下载接口地址缺失，请刷新页面重试！');
                }
                console.log('[大冯老师] 请求直链接口: ' + api + ' | fids=' + JSON.stringify(fids));
                let res;
                try {
                    res = await base.post(api, {
                        "fids": fids
                    }, {"content-type": "application/json;charset=utf-8", "user-agent": pan.ua});
                } catch (e) {
                    Swal.close();
                    console.error('[大冯老师] 直链接口请求失败: ' + (e && e.message ? e.message : e));
                    return message.error('提示：请求失败，请检查网络或重新登录网盘！');
                }
                console.log('[大冯老师] 直链接口返回: ' + JSON.stringify(res).slice(0, 400));
                if (!res) {
                    Swal.close();
                    return message.error('提示：接口无响应，请刷新页面重试！');
                }
                if (res.code === 31001) {
                    Swal.close();
                    return message.error('提示：请先登录网盘！');
                }
                if (res.code !== 0) {
                    Swal.close();
                    return message.error('提示：获取链接失败（错误码 ' + res.code + '：' + (res.message || '未知') + '）');
                }
                if (!res.data || !res.data.length) {
                    Swal.close();
                    return message.error('提示：未返回可下载的文件，请确认勾选的是文件而非文件夹！');
                }
                let html = this.generateDom(res.data);
                this.showMainDialog(pan[mode][0], html, pan[mode][1]);
            } else {
                message.error('提示：请保存到自己网盘后去网盘主页下载！');
                await base.sleep(1000);
                document.querySelector('.file-info_r').click();
                return;
            }
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.file === false) return;
                let filename = v.file_name;
                let fid = v.fid;
                let size = base.sizeFormat(v.size);
                let dlink = v.download_url;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-fid="${fid}" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                const rpcDomain = base.getValue('setting_rpc_domain');
const rpcPort = base.getValue('setting_rpc_port');
const rpcPath = base.getValue('setting_rpc_path');

if (!rpcDomain || !rpcPort) {
  console.error('[大冯老师] 请先配置 RPC 服务器地址与端口');
  message.error('请填写 RPC 服务器地址与端口！');
  return;
}

let url = `${rpcDomain}:${rpcPort}${rpcPath ? (/^\//.test(rpcPath) ? rpcPath : '/' + rpcPath) : ''}`;
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${/^\//.test(rpc.path) ? rpc.path : "/" + rpc.path}`.replace(/([^:])\/{2,}/g, "$1/");
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: [`Cookie: ${document.cookie}`]
                }]
            };
            try {
                let res = await base.post(url, rpcData, {"Cookie": document.cookie}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                let selectedList = [];
                let reactDom = document.getElementsByClassName('file-list')[0];
                let reactObj = base.findReact(reactDom);
                let props = reactObj.props;
                if (props) {
                    let fileList = props.list || [];
                    let selectedKeys = props.selectedRowKeys || [];
                    fileList.forEach((val) => {
                        if (selectedKeys.includes(val.fid)) {
                            selectedList.push(val);
                        }
                    });
                }
                return selectedList;
            } catch (e) {
                return [];
            }
        },

        detectPage() {
            // 兼容 pathname(/list) 与 hash(#/list/all) 两种路由
            let path = location.pathname + location.hash;
            let r = '';
            // 首页(根路由)也视为 home，避免 #/ 这种形式漏判
            if (/list|\/main|\/all/.test(path)) r = 'home';
            else if (/^\/#?\/?$/.test(path)) r = 'home';
            else if (/\/(s|share)\//.test(path)) r = 'share';
            console.log('[大冯老师] 路由探测 pathname=' + location.pathname + ' hash=' + location.hash + ' => pt=' + (r || '(空)'));
            return r;
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].file) return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            pan = await base.fetchPanConfig('quark');
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            this.addPageListener();
            base.createTip();
            base.createDownloadIframe();
            base.registerMenuCommand();
        }
    };

    let yidong = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}"`);
        },

        addPageListener() {
            doc.on('click', '.pl-button-mode', async (e) => {
                mode = e.target.dataset.mode;
                // ==== 大冯老师门禁：未通过扫码验证则中止，不发任何解析请求 ====
                if (!(await base.requireAuth('下载助手菜单项'))) {
                    Swal.close();
                    message.error('提示：请先扫码关注并输入验证码，才可解析直链！');
                    return;
                }
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                $('#downloadIframe').attr('src', e.currentTarget.dataset.link);
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="yidong-button pl-button">下载助手<ul class="pl-dropdown-menu" style="top: 36px;"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li>${pan.code == 200 && version < pan.version ? pan.new : ''}</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    base.injectButton($toolWrap, $button, '.pl-button');
                })
            }
            if (pt === 'share') {
                $button.removeClass('yidong-button').addClass('yidong-share-button');
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    base.injectButton($toolWrap, $button, '.pl-button');
                })
            }
            base.createDownloadIframe();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="yidong-button pl-button-init">下载助手</div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    base.injectButton($toolWrap, $button, '.pl-button-init');
                })
            }
            if (pt === 'share') {
                $button.removeClass('yidong-button').addClass('yidong-share-button');
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    base.injectButton($toolWrap, $button, '.pl-button-init');
                })
            }
            $button.click(() => base.initDialog());
        },

        getRandomString(len) {
            len = len || 16;
            let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            let maxPos = $chars.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },

        utob(str) {
            const u = String.fromCharCode;
            return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, (t) => {
                if (t.length < 2) {
                    let e = t.charCodeAt(0);
                    return e < 128 ? t : e < 2048 ? u(192 | e >>> 6) + u(128 | 63 & e) : u(224 | e >>> 12 & 15) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
                }
                e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
                return u(240 | e >>> 18 & 7) + u(128 | e >>> 12 & 63) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
            });
        },

        getSign(e, t, a, n) {
            let r = "",
                i = "";
            if (t) {
                let s = Object.assign({}, t);
                i = JSON.stringify(s),
                    i = i.replace(/\s*/g, ""),
                    i = encodeURIComponent(i);
                let c = i.split(""),
                    u = c.sort();
                i = u.join("");
            }
            let A = md5(base.e(this.utob(i)));
            let l = md5(a + ":" + n);
            return md5(A + l).toUpperCase();
        },

        async getFileUrlByOnce(item, index) {
            try {
                if (item.downloadUrl) return {
                    index,
                    downloadUrl: item.downloadUrl
                };
                if (this.detectPage() === 'home') {
                    let body = {
                        "contentID": item.contentID,
                        "commonAccountInfo": {"account": item.owner, "accountType": 1},
                        "operation": "0",
                        "inline": "0",
                        "extInfo": {"isReturnCdnDownloadUrl": "1"}
                    };
                    let time = new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace('T', ' ');
                    let key = this.getRandomString(16);
                    let sign = this.getSign(undefined, body, time, key);

                    let res = await base.post(pan.pcs[0], body, {
                        'authorization': base.getCookie('authorization'),
                        'x-huawei-channelSrc': '10000034',
                        'x-inner-ntwk': '2',
                        'mcloud-channel': '1000101',
                        'mcloud-client': '10701',
                        'mcloud-sign': time + "," + key + "," + sign,
                        'content-type': "application/json;charset=UTF-8",
                        'caller': 'web',
                        'CMS-DEVICE': 'default',
                        'x-DeviceInfo': '||9|7.12.0|chrome|118.0.0.0||windows 10||zh-CN|||',
                        'x-SvcType': '1',
                    });
                    if (res.success) {
                        return {
                            index,
                            downloadUrl: res.data.downloadURL
                        };
                    } else {
                        return {
                            index,
                            downloadUrl: '获取下载地址失败，请刷新重试！'
                        };
                    }
                }
                if (this.detectPage() === 'share') {
                    let vueDom = document.querySelector(".home-page").__vue__;

                    let res = await base.post(pan.pcs[1], `linkId=${vueDom.linkID}&contentIds=${encodeURIComponent(vueDom.currentPath.id + '/' + item.coID)}&catalogIds=`, {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    });
                    if (res.code === 0) {
                        return {
                            index,
                            downloadUrl: res.data.redrUrl
                        };
                    } else {
                        return {
                            index,
                            downloadUrl: '获取下载地址失败，请刷新重试！'
                        };
                    }
                }
            } catch (e) {
                return {
                    index,
                    downloadUrl: '获取下载地址失败，请刷新重试！'
                };
            }
        },

        async getPCSLink() {
        // ==== 大冯老师门禁：纵深防御，任何调用路径都拦 ====
        if (!base.isAuthed()) {
            Swal.close();
            const ok = await base.showAuthDialog('解析直链');
            if (!ok) {
                message.error('提示：未通过验证，已中止直链解析。');
                return;
            }
        }
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }

            let queue = [];
            selectList.forEach((item, index) => {
                queue.push(this.getFileUrlByOnce(item, index));
            });

            const res = await Promise.all(queue);
            res.forEach(val => {
                selectList[val.index].downloadUrl = val.downloadUrl;
            });

            let html = this.generateDom(selectList);
            this.showMainDialog(pan[mode][0], html, pan[mode][1]);
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.dirEtag || v.caName) return;
                let filename = v.contentName || v.coName;
                let size = base.sizeFormat(v.contentSize || v.coSize);
                let dlink = v.downloadUrl;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                const rpcDomain = base.getValue('setting_rpc_domain');
const rpcPort = base.getValue('setting_rpc_port');
const rpcPath = base.getValue('setting_rpc_path');

if (!rpcDomain || !rpcPort) {
  console.error('[大冯老师] 请先配置 RPC 服务器地址与端口');
  message.error('请填写 RPC 服务器地址与端口！');
  return;
}

let url = `${rpcDomain}:${rpcPort}${rpcPath ? (/^\//.test(rpcPath) ? rpcPath : '/' + rpcPath) : ''}`;
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${/^\//.test(rpc.path) ? rpc.path : "/" + rpc.path}`.replace(/([^:])\/{2,}/g, "$1/");
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: []
                }]
            };
            try {
                let res = await base.post(url, rpcData, {}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                return document.querySelector(".main_file_list").__vue__.selectList.map(val => val.item);
            } catch (e) {
                let vueDom = document.querySelector(".home-page").__vue__;
                let fileList = vueDom._computedWatchers.fileList.value;
                let dirList = vueDom._computedWatchers.dirList.value;
                let selectedFileIndex = vueDom.selectedFile;
                let selectedDirIndex = vueDom.selectedDir;
                let selectFileList = fileList.filter((v, i) => {
                    return selectedFileIndex.includes(i);
                });
                let selectDirList = dirList.filter((v, i) => {
                    return selectedDirIndex.includes(i);
                });
                return [...selectFileList, ...selectDirList];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/w/.test(path)) return 'home';
            if (/^\/link/.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].fileEtag || selectList[i].coName) return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            pan = await base.fetchPanConfig('yidong');
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let main = {
        init() {
            if (/(pan|yun).baidu.com/.test(location.host)) {
                baidu.initPanLinker();
            }
            if (/www.(aliyundrive|alipan).com/.test(location.host)) {
                ali.initPanLinker();
            }
            if (/cloud.189.cn/.test(location.host)) {
                tianyi.initPanLinker();
            }
            if (/pan.xunlei.com/.test(location.host)) {
                xunlei.initPanLinker();
            }
            if (/pan.quark.cn/.test(location.host)) {
                quark.initPanLinker();
            }
            if (/(yun|caiyun).139.com/.test(location.host)) {
                yidong.initPanLinker();
            }
        }
    };

    // ==== 大冯老师：对外暴露句柄（便于排查问题与自动化测试，不影响正常使用）====
    try {
        (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).__DFPAN__ = {
            base, baidu, ali, tianyi, xunlei, quark, yidong, main,
            version, authCode: AUTH_CODE,
        };
    } catch (e) {
    }

    main.init();
})();
