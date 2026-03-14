(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Weather.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Weather
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/simple-closet/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/simple-closet/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/simple-closet/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-icons/wi'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// 天気コード→アイコン変換表
const weatherIconMap = {
    1000: WiDaySunny,
    1003: WiDayCloudy,
    1006: WiCloudy,
    1009: WiCloud,
    1030: WiFog,
    1063: WiRain,
    1183: WiSprinkle,
    1189: WiRain,
    1195: WiRainWind,
    1210: WiSnow,
    1213: WiSnow,
    1273: WiThunderstorm
};
// 時刻
const times = [
    7,
    12,
    18
];
// 変換用
const formatDate = (dateStr)=>{
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
};
const formatHour = (dateStr)=>{
    const d = new Date(dateStr);
    return `${d.getHours()}時`;
};
function Weather() {
    _s();
    // 天気情報
    const [weather, setWeather] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // useEffect内で関数を定義（Reactの推奨パターン）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Weather.useEffect": ()=>{
            // 天気を取得
            const getWeather = {
                "Weather.useEffect.getWeather": async ()=>{
                    setWeather(null);
                    const position = localStorage.getItem("weatherQuery") || "Tokyo";
                    try {
                        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${("TURBOPACK compile-time value", "11fc03a7b7424bfcb7d25728251012")}&q=${position}&days=1&aqi=no&alerts=no`);
                        if (!res.ok) {
                            throw new Error("天気の取得に失敗しました"); //Errorオブジェクトを返す
                        }
                        const data = await res.json();
                        setWeather(data);
                    } catch (e) {
                        console.error(e.message);
                        setError(true);
                    }
                }
            }["Weather.useEffect.getWeather"];
            getWeather();
        }
    }["Weather.useEffect"], []);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "weather",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "天気を取得できませんでした"
        }, void 0, false, {
            fileName: "[project]/src/components/Weather.js",
            lineNumber: 79,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Weather.js",
        lineNumber: 78,
        columnNumber: 5
    }, this);
    if (!weather) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "weather",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "weatherLoading",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "天気を取得しています…"
            }, void 0, false, {
                fileName: "[project]/src/components/Weather.js",
                lineNumber: 86,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Weather.js",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Weather.js",
        lineNumber: 84,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "weather",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dateSec",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: formatDate(weather.location.localtime)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Weather.js",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: weather.location.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/Weather.js",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Weather.js",
                lineNumber: 93,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "weatherSec",
                children: times.map((t)=>{
                    const hourData = weather.forecast.forecastday[0].hour[t];
                    const Icon = weatherIconMap[hourData.condition.code] ?? WiCloud;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "weatherEach",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 30,
                                className: "weatherIcon"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Weather.js",
                                lineNumber: 104,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "timeTemp",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "time",
                                        children: formatHour(hourData.time)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Weather.js",
                                        lineNumber: 106,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$simple$2d$closet$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "temp",
                                        children: [
                                            hourData.temp_c,
                                            "℃"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Weather.js",
                                        lineNumber: 107,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Weather.js",
                                lineNumber: 105,
                                columnNumber: 19
                            }, this)
                        ]
                    }, t, true, {
                        fileName: "[project]/src/components/Weather.js",
                        lineNumber: 103,
                        columnNumber: 17
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/Weather.js",
                lineNumber: 98,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Weather.js",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_s(Weather, "F1SB0qNntbONr/v6F1n5cnw6Q7w=");
_c = Weather;
var _c;
__turbopack_context__.k.register(_c, "Weather");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=%5Bproject%5D_src_components_Weather_cb093434.js.map