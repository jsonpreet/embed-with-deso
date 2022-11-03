! function() {
    "use strict";

    function e() {
        const e = document.querySelectorAll(".deso-embed");
        for (let n = 0; n < e.length; n++) {
            const t = e[n],
                i = t.getAttribute("data-post-hash");
                s = t.getAttribute("data-type");
            if (null == t) return;
            if (t.children.length > 0) return;
            const o = document.createElement("iframe"),
                r = i.split("-")[0] ?? "widget",
                a = `deso-frame-${r}`;
            o.id = a, o.setAttribute("loading", "lazy"), o.setAttribute("src", `https://embed.withdeso.com/embed/${s}/${i}`), o.setAttribute("scrolling", "no"), o.setAttribute("frameborder", "0"), o.setAttribute("width", "100%"), t.appendChild(o), iFrameResize({
                log: !1,
                checkOrigin: !1
            }, `#${a}`)
        }
    }! function(e) {
        if ("undefined" != typeof window) {
            var n = 0,
                t = !1,
                i = !1,
                o = "message",
                r = o.length,
                a = "[iFrameSizer]",
                u = a.length,
                s = null,
                c = window.requestAnimationFrame,
                d = {
                    max: 1,
                    scroll: 1,
                    bodyScroll: 1,
                    documentElementScroll: 1
                },
                f = {},
                l = null,
                m = {
                    autoResize: !0,
                    bodyBackground: null,
                    bodyMargin: null,
                    bodyMarginV1: 8,
                    bodyPadding: null,
                    checkOrigin: !0,
                    inPageLinks: !1,
                    enablePublicMethods: !0,
                    heightCalculationMethod: "bodyOffset",
                    id: "iFrameResizer",
                    interval: 32,
                    log: !1,
                    maxHeight: 1 / 0,
                    maxWidth: 1 / 0,
                    minHeight: 0,
                    minWidth: 0,
                    mouseEvents: !0,
                    resizeFrom: "parent",
                    scrolling: !1,
                    sizeHeight: !0,
                    sizeWidth: !1,
                    warningTimeout: 5e3,
                    tolerance: 0,
                    widthCalculationMethod: "scroll",
                    onClose: function() {
                        return !0
                    },
                    onClosed: function() {},
                    onInit: function() {},
                    onMessage: function() {
                        k("onMessage function not defined")
                    },
                    onMouseEnter: function() {},
                    onMouseLeave: function() {},
                    onResized: function() {},
                    onScroll: function() {
                        return !0
                    }
                },
                g = {};
            window.jQuery && Q(window.jQuery), "function" == typeof define && define.amd ? define([], Y) : "object" == typeof module && "object" == typeof module.exports && (module.exports = Y()), window.iFrameResize = window.iFrameResize || Y()
        }

        function h() {
            return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
        }

        function p(e, n, t) {
            e.addEventListener(n, t, !1)
        }

        function w(e, n, t) {
            e.removeEventListener(n, t, !1)
        }

        function b() {
            var e = ["moz", "webkit", "o", "ms"],
                n;
            for (n = 0; n < e.length && !c; n += 1) c = window[e[n] + "RequestAnimationFrame"];
            c ? c = c.bind(window) : M("setup", "RequestAnimationFrame not supported")
        }

        function y(e) {
            var n = "Host page: " + e;
            return window.top !== window.self && (n = window.parentIFrame && window.parentIFrame.getId ? window.parentIFrame.getId() + ": " + e : "Nested host page: " + e), n
        }

        function v(e) {
            return a + "[" + y(e) + "]"
        }

        function x(e) {
            return f[e] ? f[e].log : t
        }

        function M(e, n) {
            z("log", e, n, x(e))
        }

        function I(e, n) {
            z("info", e, n, x(e))
        }

        function k(e, n) {
            z("warn", e, n, !0)
        }

        function z(e, n, t, i) {
            !0 === i && "object" == typeof window.console && console[e](v(n), t)
        }

        function F(e) {
            function n() {
                function e() {
                    S(Q), N($), V("onResized", Q)
                }
                c("Height"), c("Width"), j(e, Q, "init")
            }

            function t() {
                var e = Y.substr(u).split(":"),
                    n = e[1] ? parseInt(e[1], 10) : 0,
                    t = f[e[0]] && f[e[0]].iframe,
                    r = getComputedStyle(t);
                return {
                    iframe: t,
                    id: e[0],
                    height: n + i(r) + o(r),
                    width: e[2],
                    type: e[3]
                }
            }

            function i(e) {
                if ("border-box" !== e.boxSizing) return 0;
                var n = e.paddingTop ? parseInt(e.paddingTop, 10) : 0,
                    t = e.paddingBottom ? parseInt(e.paddingBottom, 10) : 0;
                return n + t
            }

            function o(e) {
                if ("border-box" !== e.boxSizing) return 0;
                var n = e.borderTopWidth ? parseInt(e.borderTopWidth, 10) : 0,
                    t = e.borderBottomWidth ? parseInt(e.borderBottomWidth, 10) : 0;
                return n + t
            }

            function c(e) {
                var n = Number(f[$]["max" + e]),
                    t = Number(f[$]["min" + e]),
                    i = e.toLowerCase(),
                    o = Number(Q[i]);
                M($, "Checking " + i + " is in range " + t + "-" + n), o < t && (o = t, M($, "Set " + i + " to min value")), o > n && (o = n, M($, "Set " + i + " to max value")), Q[i] = "" + o
            }

            function d() {
                function n() {
                    function e() {
                        var e = 0,
                            n = !1;
                        for (M($, "Checking connection is from allowed list of origins: " + i); e < i.length; e++)
                            if (i[e] === t) {
                                n = !0;
                                break
                            } return n
                    }

                    function n() {
                        var e = f[$] && f[$].remoteHost;
                        return M($, "Checking connection is from: " + e), t === e
                    }
                    return i.constructor === Array ? e() : n()
                }
                var t = e.origin,
                    i = f[$] && f[$].checkOrigin;
                if (i && "" + t != "null" && !n()) throw new Error("Unexpected message received from: " + t + " for " + Q.iframe.id + ". Message was: " + e.data + ". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");
                return !0
            }

            function l() {
                return a === ("" + Y).substr(0, u) && Y.substr(u).split(":")[0] in f
            }

            function m() {
                var e = Q.type in {
                    true: 1,
                    false: 1,
                    undefined: 1
                };
                return e && M($, "Ignoring init message from meta parent page"), e
            }

            function g(e) {
                return Y.substr(Y.indexOf(":") + r + e)
            }

            function h(e) {
                M($, "onMessage passed: {iframe: " + Q.iframe.id + ", message: " + e + "}"), V("onMessage", {
                    iframe: Q.iframe,
                    message: JSON.parse(e)
                }), M($, "--")
            }

            function b() {
                var e = document.body.getBoundingClientRect(),
                    n = Q.iframe.getBoundingClientRect();
                return JSON.stringify({
                    iframeHeight: n.height,
                    iframeWidth: n.width,
                    clientHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                    clientWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                    offsetTop: parseInt(n.top - e.top, 10),
                    offsetLeft: parseInt(n.left - e.left, 10),
                    scrollTop: window.pageYOffset,
                    scrollLeft: window.pageXOffset,
                    documentHeight: document.documentElement.clientHeight,
                    documentWidth: document.documentElement.clientWidth,
                    windowHeight: window.innerHeight,
                    windowWidth: window.innerWidth
                })
            }

            function y(e, n) {
                function t() {
                    A("Send Page Info", "pageInfo:" + b(), e, n)
                }
                q(t, 32, n)
            }

            function v() {
                function e(e, t) {
                    function o() {
                        f[i] ? y(f[i].iframe, i) : n()
                    } ["scroll", "resize"].forEach((function(n) {
                        M(i, e + n + " listener for sendPageInfo"), t(window, n, o)
                    }))
                }

                function n() {
                    e("Remove ", w)
                }

                function t() {
                    e("Add ", p)
                }
                var i = $;
                t(), f[i] && (f[i].stopPageInfo = n)
            }

            function x() {
                f[$] && f[$].stopPageInfo && (f[$].stopPageInfo(), delete f[$].stopPageInfo)
            }

            function z() {
                var e = !0;
                return null === Q.iframe && (k($, "IFrame (" + Q.id + ") not found"), e = !1), e
            }

            function F(e) {
                var n = e.getBoundingClientRect();
                return T($), {
                    x: Math.floor(Number(n.left) + Number(s.x)),
                    y: Math.floor(Number(n.top) + Number(s.y))
                }
            }

            function R(e) {
                function n() {
                    s = r, P(), M($, "--")
                }

                function t() {
                    return {
                        x: Number(Q.width) + o.x,
                        y: Number(Q.height) + o.y
                    }
                }

                function i() {
                    window.parentIFrame ? window.parentIFrame["scrollTo" + (e ? "Offset" : "")](r.x, r.y) : k($, "Unable to scroll to requested position, window.parentIFrame not found")
                }
                var o = e ? F(Q.iframe) : {
                        x: 0,
                        y: 0
                    },
                    r = t();
                M($, "Reposition requested from iFrame (offset x:" + o.x + " y:" + o.y + ")"), window.top !== window.self ? i() : n()
            }

            function P() {
                !1 !== V("onScroll", s) ? N($) : W()
            }

            function L(e) {
                function n() {
                    var e = F(r);
                    M($, "Moving to in page link (#" + i + ") at x: " + e.x + " y: " + e.y), s = {
                        x: e.x,
                        y: e.y
                    }, P(), M($, "--")
                }

                function t() {
                    window.parentIFrame ? window.parentIFrame.moveToAnchor(i) : M($, "In page link #" + i + " not found and window.parentIFrame not found")
                }
                var i = e.split("#")[1] || "",
                    o = decodeURIComponent(i),
                    r = document.getElementById(o) || document.getElementsByName(o)[0];
                r ? n() : window.top !== window.self ? t() : M($, "In page link #" + i + " not found")
            }

            function B(e) {
                var n = {};
                if (0 === Number(Q.width) && 0 === Number(Q.height)) {
                    var t = g(9).split(":");
                    n = {
                        x: t[1],
                        y: t[0]
                    }
                } else n = {
                    x: Q.width,
                    y: Q.height
                };
                V(e, {
                    iframe: Q.iframe,
                    screenX: Number(n.x),
                    screenY: Number(n.y),
                    type: Q.type
                })
            }

            function V(e, n) {
                return O($, e, n)
            }

            function U() {
                switch (f[$] && f[$].firstRun && X(), Q.type) {
                    case "close":
                        E(Q.iframe);
                        break;
                    case "message":
                        h(g(6));
                        break;
                    case "mouseenter":
                        B("onMouseEnter");
                        break;
                    case "mouseleave":
                        B("onMouseLeave");
                        break;
                    case "autoResize":
                        f[$].autoResize = JSON.parse(g(9));
                        break;
                    case "scrollTo":
                        R(!1);
                        break;
                    case "scrollToOffset":
                        R(!0);
                        break;
                    case "pageInfo":
                        y(f[$] && f[$].iframe, $), v();
                        break;
                    case "pageInfoStop":
                        x();
                        break;
                    case "inPageLink":
                        L(g(9));
                        break;
                    case "reset":
                        C(Q);
                        break;
                    case "init":
                        n(), V("onInit", Q.iframe);
                        break;
                    default:
                        0 === Number(Q.width) && 0 === Number(Q.height) ? k("Unsupported message received (" + Q.type + "), this is likely due to the iframe containing a later version of iframe-resizer than the parent page") : n()
                }
            }

            function D(e) {
                var n = !0;
                return f[e] || (n = !1, k(Q.type + " No settings for " + e + ". Message was: " + Y)), n
            }

            function J() {
                for (var e in f) A("iFrame requested init", H(e), f[e].iframe, e)
            }

            function X() {
                f[$] && (f[$].firstRun = !1)
            }
            var Y = e.data,
                Q = {},
                $ = null;
            "[iFrameResizerChild]Ready" === Y ? J() : l() ? (Q = t(), $ = Q.id, f[$] && (f[$].loaded = !0), !m() && D($) && (M($, "Received: " + Y), z() && d() && U())) : I($, "Ignored: " + Y)
        }

        function O(e, n, t) {
            var i = null,
                o = null;
            if (f[e]) {
                if (i = f[e][n], "function" != typeof i) throw new TypeError(n + " on iFrame[" + e + "] is not a function");
                o = i(t)
            }
            return o
        }

        function R(e) {
            var n = e.id;
            delete f[n]
        }

        function E(e) {
            var n = e.id;
            if (!1 !== O(n, "onClose", n)) {
                M(n, "Removing iFrame: " + n);
                try {
                    e.parentNode && e.parentNode.removeChild(e)
                } catch (e) {
                    k(e)
                }
                O(n, "onClosed", n), M(n, "--"), R(e)
            } else M(n, "Close iframe cancelled by onClose event")
        }

        function T(n) {
            null === s && (s = {
                x: window.pageXOffset !== e ? window.pageXOffset : document.documentElement.scrollLeft,
                y: window.pageYOffset !== e ? window.pageYOffset : document.documentElement.scrollTop
            }, M(n, "Get page position: " + s.x + "," + s.y))
        }

        function N(e) {
            null !== s && (window.scrollTo(s.x, s.y), M(e, "Set page position: " + s.x + "," + s.y), W())
        }

        function W() {
            s = null
        }

        function C(e) {
            function n() {
                S(e), A("reset", "reset", e.iframe, e.id)
            }
            M(e.id, "Size reset requested by " + ("init" === e.type ? "host page" : "iFrame")), T(e.id), j(n, e, "reset")
        }

        function S(e) {
            function n(n) {
                e.id ? (e.iframe.style[n] = e[n] + "px", M(e.id, "IFrame (" + r + ") " + n + " set to " + e[n] + "px")) : M("undefined", "messageData id not set")
            }

            function t(n) {
                i || "0" !== e[n] || (i = !0, M(r, "Hidden iFrame detected, creating visibility listener"), V())
            }

            function o(e) {
                n(e), t(e)
            }
            var r = e.iframe.id;
            f[r] && (f[r].sizeHeight && o("height"), f[r].sizeWidth && o("width"))
        }

        function j(e, n, t) {
            t !== n.type && c && !window.jasmine ? (M(n.id, "Requesting animation frame"), c(e)) : e()
        }

        function A(e, n, t, i, o) {
            function r() {
                var o = f[i] && f[i].targetOrigin;
                M(i, "[" + e + "] Sending msg to iframe[" + i + "] (" + n + ") targetOrigin: " + o), t.contentWindow.postMessage(a + n, o)
            }

            function u() {
                k(i, "[" + e + "] IFrame(" + i + ") not found")
            }

            function s() {
                t && "contentWindow" in t && null !== t.contentWindow ? r() : u()
            }

            function c() {
                function e() {
                    !f[i] || f[i].loaded || d || (d = !0, k(i, "IFrame has not responded within " + f[i].warningTimeout / 1e3 + " seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning."))
                }
                o && f[i] && f[i].warningTimeout && (f[i].msgTimeout = setTimeout(e, f[i].warningTimeout))
            }
            var d = !1;
            i = i || t.id, f[i] && (s(), c())
        }

        function H(e) {
            return e + ":" + f[e].bodyMarginV1 + ":" + f[e].sizeWidth + ":" + f[e].log + ":" + f[e].interval + ":" + f[e].enablePublicMethods + ":" + f[e].autoResize + ":" + f[e].bodyMargin + ":" + f[e].heightCalculationMethod + ":" + f[e].bodyBackground + ":" + f[e].bodyPadding + ":" + f[e].tolerance + ":" + f[e].inPageLinks + ":" + f[e].resizeFrom + ":" + f[e].widthCalculationMethod + ":" + f[e].mouseEvents
        }

        function P(e) {
            return "number" == typeof e
        }

        function L(i, o) {
            function r() {
                function e(e) {
                    var n = f[F][e];
                    1 / 0 !== n && 0 !== n && (i.style[e] = P(n) ? n + "px" : n, M(F, "Set " + e + " = " + i.style[e]))
                }

                function n(e) {
                    if (f[F]["min" + e] > f[F]["max" + e]) throw new Error("Value for min" + e + " can not be greater than max" + e)
                }
                n("Height"), n("Width"), e("maxHeight"), e("minHeight"), e("maxWidth"), e("minWidth")
            }

            function a() {
                var e = o && o.id || m.id + n++;
                return null !== document.getElementById(e) && (e += n++), e
            }

            function u(e) {
                return "" === e && (i.id = e = a(), t = (o || {}).log, M(e, "Added missing iframe ID: " + e + " (" + i.src + ")")), e
            }

            function s() {
                switch (M(F, "IFrame scrolling " + (f[F] && f[F].scrolling ? "enabled" : "disabled") + " for " + F), i.style.overflow = !1 === (f[F] && f[F].scrolling) ? "hidden" : "auto", f[F] && f[F].scrolling) {
                    case "omit":
                        break;
                    case !0:
                        i.scrolling = "yes";
                        break;
                    case !1:
                        i.scrolling = "no";
                        break;
                    default:
                        i.scrolling = f[F] ? f[F].scrolling : "no"
                }
            }

            function c() {
                "number" != typeof(f[F] && f[F].bodyMargin) && "0" !== (f[F] && f[F].bodyMargin) || (f[F].bodyMarginV1 = f[F].bodyMargin, f[F].bodyMargin = f[F].bodyMargin + "px")
            }

            function l() {
                var e = f[F] && f[F].firstRun,
                    n = f[F] && f[F].heightCalculationMethod in d;
                !e && n && C({
                    iframe: i,
                    height: 0,
                    width: 0,
                    type: "init"
                })
            }

            function g() {
                f[F] && (f[F].iframe.iFrameResizer = {
                    close: E.bind(null, f[F].iframe),
                    removeListeners: R.bind(null, f[F].iframe),
                    resize: A.bind(null, "Window resize", "resize", f[F].iframe),
                    moveToAnchor: function(e) {
                        A("Move to anchor", "moveToAnchor:" + e, f[F].iframe, F)
                    },
                    sendMessage: function(e) {
                        e = JSON.stringify(e), A("Send Message", "message:" + e, f[F].iframe, F)
                    }
                })
            }

            function w(n) {
                function t() {
                    A("iFrame.onload", n, i, e, !0), l()
                }

                function o(e) {
                    if (i.parentNode) {
                        var n = new e((function(e) {
                            e.forEach((function(e) {
                                var n = Array.prototype.slice.call(e.removedNodes);
                                n.forEach((function(e) {
                                    e === i && E(i)
                                }))
                            }))
                        }));
                        n.observe(i.parentNode, {
                            childList: !0
                        })
                    }
                }
                var r = h();
                r && o(r), p(i, "load", t), A("init", n, i, e, !0)
            }

            function b(e) {
                if ("object" != typeof e) throw new TypeError("Options is not an object")
            }

            function y(e) {
                for (var n in m) Object.prototype.hasOwnProperty.call(m, n) && (f[F][n] = Object.prototype.hasOwnProperty.call(e, n) ? e[n] : m[n])
            }

            function v(e) {
                return "" === e || null !== e.match(/^(about:blank|javascript:|file:\/\/)/) ? "*" : e
            }

            function x(e) {
                var n = e.split("Callback");
                if (2 === n.length) {
                    var t = "on" + n[0].charAt(0).toUpperCase() + n[0].slice(1);
                    this[t] = this[e], delete this[e], k(F, "Deprecated: '" + e + "' has been renamed '" + t + "'. The old method will be removed in the next major version.")
                }
            }

            function I(e) {
                e = e || {}, f[F] = {
                    firstRun: !0,
                    iframe: i,
                    remoteHost: i.src && i.src.split("/").slice(0, 3).join("/")
                }, b(e), Object.keys(e).forEach(x, e), y(e), f[F] && (f[F].targetOrigin = !0 === f[F].checkOrigin ? v(f[F].remoteHost) : "*")
            }

            function z() {
                return F in f && "iFrameResizer" in i
            }
            var F = u(i.id);
            z() ? k(F, "Ignored iFrame, already setup.") : (I(o), s(), r(), c(), w(H(F)), g())
        }

        function B(e, n) {
            null === l && (l = setTimeout((function() {
                l = null, e()
            }), n))
        }

        function q(e, n, t) {
            g[t] || (g[t] = setTimeout((function() {
                g[t] = null, e()
            }), n))
        }

        function V() {
            function e() {
                function e(e) {
                    function n(n) {
                        return "0px" === (f[e] && f[e].iframe.style[n])
                    }

                    function t(e) {
                        return null !== e.offsetParent
                    }
                    f[e] && t(f[e].iframe) && (n("height") || n("width")) && A("Visibility change", "resize", f[e].iframe, e)
                }
                Object.keys(f).forEach((function(n) {
                    e(n)
                }))
            }

            function n(n) {
                M("window", "Mutation observed: " + n[0].target + " " + n[0].type), B(e, 16)
            }

            function t() {
                var e = document.querySelector("body"),
                    t = {
                        attributes: !0,
                        attributeOldValue: !1,
                        characterData: !0,
                        characterDataOldValue: !1,
                        childList: !0,
                        subtree: !0
                    },
                    o = new i(n);
                o.observe(e, t)
            }
            var i = h();
            i && t()
        }

        function U(e) {
            function n() {
                J("Window " + e, "resize")
            }
            M("window", "Trigger event: " + e), B(n, 16)
        }

        function D() {
            function e() {
                J("Tab Visable", "resize")
            }
            "hidden" !== document.visibilityState && (M("document", "Trigger event: Visiblity change"), B(e, 16))
        }

        function J(e, n) {
            function t(e) {
                return f[e] && "parent" === f[e].resizeFrom && f[e].autoResize && !f[e].firstRun
            }
            Object.keys(f).forEach((function(i) {
                t(i) && A(e, n, f[i].iframe, i)
            }))
        }

        function X() {
            p(window, "message", F), p(window, "resize", (function() {
                U("resize")
            })), p(document, "visibilitychange", D), p(document, "-webkit-visibilitychange", D)
        }

        function Y() {
            function n(e, n) {
                function t() {
                    if (!n.tagName) throw new TypeError("Object is not a valid DOM element");
                    if ("IFRAME" !== n.tagName.toUpperCase()) throw new TypeError("Expected <IFRAME> tag, found <" + n.tagName + ">")
                }
                n && (t(), L(n, e), i.push(n))
            }

            function t(e) {
                e && e.enablePublicMethods && k("enablePublicMethods option has been removed, public methods are now always available in the iFrame")
            }
            var i;
            return b(), X(),
                function o(r, a) {
                    switch (i = [], t(r), typeof a) {
                        case "undefined":
                        case "string":
                            Array.prototype.forEach.call(document.querySelectorAll(a || "iframe"), n.bind(e, r));
                            break;
                        case "object":
                            n(r, a);
                            break;
                        default:
                            throw new TypeError("Unexpected data type (" + typeof a + ")")
                    }
                    return i
                }
        }

        function Q(e) {
            e.fn ? e.fn.iFrameResize || (e.fn.iFrameResize = function e(n) {
                function t(e, t) {
                    L(t, n)
                }
                return this.filter("iframe").each(t).end()
            }) : I("", "Unable to bind to jQuery, it is not fully loaded.")
        }
    }(), e()
}();