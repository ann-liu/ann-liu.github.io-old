"use strict";
var precacheConfig = [
        ["./index.html", "7c1508793d65ffcbba7324e8ae13e22f"],
        ["./service-worker.js", "94653abd2698a4a89aa5d648111186e3"],
        ["./static/css/app.7e71d78a2887e832d928442287855f13.css", "5dc884c5ab845ff157db990b851794f4"],
        ["./static/img/dl.png", "983e810661b891da22015cac7179050a"],
        ["./static/img/icons/android-chrome-192x192.png", "11931eb9dcd471aafa5954267eb71af6"],
        ["./static/img/icons/android-chrome-512x512.png", "dad65bafec053503d5736676b05b9eaf"],
        ["./static/img/icons/apple-touch-icon.png", "bcf5bcbd7b6dfa92c59a1a19745b0a73"],
        ["./static/img/icons/favicon-16x16.png", "8dbed2d3d6f6aed7a4e6beb0d6a7345e"],
        ["./static/img/icons/favicon-32x32.png", "6a88937ab5f6b637ab5a13cfcbf0a28d"],
        ["./static/img/icons/mstile-150x150.png", "01f82f48fb89c3763576032d24c8e9c0"],
        ["./static/img/restart.png", "56c0b270e3513c5fd82be4c846b56879"],
        ["./static/js/app.97edbf77f0484931068c.js", "d5f2b6ad822eae3b471bde2f080848ec"],
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
        (t = urlsToCacheKeys.has(n)) || (n = addDirectoryIndex(n, "index.html"), t = urlsToCacheKeys.has(n));
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