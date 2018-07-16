"use strict";
var precacheConfig = [
        ["./index.html", "a9928fc845f0b83258482dba598c062b"],
        ["./service-worker.js", "f69815476994289a8a632197c17c5129"],
        ["./static/css/app.28c041f6776123f2959d83cb1e8f0ac4.css", "2bbb960e3e1d59693a0b55b71e312c4a"],
        ["./static/img/dl.png", "983e810661b891da22015cac7179050a"],
        ["./static/img/icons/android-chrome-192x192.png", "11931eb9dcd471aafa5954267eb71af6"],
        ["./static/img/icons/android-chrome-512x512.png", "dad65bafec053503d5736676b05b9eaf"],
        ["./static/img/icons/apple-touch-icon.png", "bcf5bcbd7b6dfa92c59a1a19745b0a73"],
        ["./static/img/icons/favicon-16x16.png", "8dbed2d3d6f6aed7a4e6beb0d6a7345e"],
        ["./static/img/icons/favicon-32x32.png", "6a88937ab5f6b637ab5a13cfcbf0a28d"],
        ["./static/img/icons/mstile-150x150.png", "01f82f48fb89c3763576032d24c8e9c0"],
        ["./static/img/restart.png", "56c0b270e3513c5fd82be4c846b56879"],
        ["./static/js/app.44b003b851c46077808a.js", "c6cc57038e880d18f81f40fb3116512b"],
        ["./static/js/manifest.2ae2e69a05c33dfc65f8.js", "40dcfff9d09d402daf38b8a86518deeb"],
        ["./static/js/vendor.13642c0ae45a429ed0bd.js", "f63ee0da0791cfdd5159866190ea26cd"]
    ],
    cacheName = "sw-precache-v3-wallpaper-pwa-" + (self.registration ? self.registration.scope : ""),
    ignoreUrlParametersMatching = [/^utm_/],
    addDirectoryIndex = function(e, t) {
        var n = new URL(e);
        return "/" === n.pathname.slice(-1) && (n.pathname += t), n.toString()
    },
    cleanResponse = function(e) {
        return e.redirected ? ("body" in e ? Promise.resolve(e.body) : e.blob()).then(function(t) {
            return new Response(t, {
                headers: e.headers,
                status: e.status,
                statusText: e.statusText
            })
        }) : Promise.resolve(e)
    },
    createCacheKey = function(e, t, n, a) {
        var r = new URL(e);
        return a && r.pathname.match(a) || (r.search += (r.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(n)), r.toString()
    },
    isPathWhitelisted = function(e, t) {
        if (0 === e.length) return !0;
        var n = new URL(t).pathname;
        return e.some(function(e) {
            return n.match(e)
        })
    },
    stripIgnoredUrlParameters = function(e, t) {
        var n = new URL(e);
        return n.hash = "", n.search = n.search.slice(1).split("&").map(function(e) {
            return e.split("=")
        }).filter(function(e) {
            return t.every(function(t) {
                return !t.test(e[0])
            })
        }).map(function(e) {
            return e.join("=")
        }).join("&"), n.toString()
    },
    hashParamName = "_sw-precache",
    urlsToCacheKeys = new Map(precacheConfig.map(function(e) {
        var t = e[0],
            n = e[1],
            a = new URL(t, self.location),
            r = createCacheKey(a, hashParamName, n, !1);
        return [a.toString(), r]
    }));

function setOfCachedUrls(e) {
    return e.keys().then(function(e) {
        return e.map(function(e) {
            return e.url
        })
    }).then(function(e) {
        return new Set(e)
    })
}
self.addEventListener("install", function(e) {
    e.waitUntil(caches.open(cacheName).then(function(e) {
        return setOfCachedUrls(e).then(function(t) {
            return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n) {
                if (!t.has(n)) {
                    var a = new Request(n, {
                        credentials: "same-origin"
                    });
                    return fetch(a).then(function(t) {
                        if (!t.ok) throw new Error("Request for " + n + " returned a response with status " + t.status);
                        return cleanResponse(t).then(function(t) {
                            return e.put(n, t)
                        })
                    })
                }
            }))
        })
    }).then(function() {
        return self.skipWaiting()
    }))
}), self.addEventListener("activate", function(e) {
    var t = new Set(urlsToCacheKeys.values());
    e.waitUntil(caches.open(cacheName).then(function(e) {
        return e.keys().then(function(n) {
            return Promise.all(n.map(function(n) {
                if (!t.has(n.url)) return e.delete(n)
            }))
        })
    }).then(function() {
        return self.clients.claim()
    }))
}), self.addEventListener("fetch", function(e) {
    if ("GET" === e.request.method) {
        var t, n = stripIgnoredUrlParameters(e.request.url, ignoreUrlParametersMatching);
        (t = urlsToCacheKeys.has(n)) || (n = addDirectoryIndex(n, "./index.html"), t = urlsToCacheKeys.has(n));
        0, t && e.respondWith(caches.open(cacheName).then(function(e) {
            return e.match(urlsToCacheKeys.get(n)).then(function(e) {
                if (e) return e;
                throw Error("The cached response that was expected is missing.")
            })
        }).catch(function(t) {
            return console.warn('Couldn\'t serve response for "%s" from cache: %O', e.request.url, t), fetch(e.request)
        }))
    }
});