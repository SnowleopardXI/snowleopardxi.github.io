var audio = new Audio();
audio.preload = true;
var charvol = {
    strange: [
        "ahhhh",
        "damn",
        "damn2",
        "ee",
        "er",
        "ner",
        "comeout",
        "erhhhh",
        "ah",
        "heihei",
        "heiheihaha",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
    ],
    game: [
        "6",
        "62",
        "ahhhhwc",
        "wccool",
        "wc",
        "wc2",
        "wcshuai",
        "wcniu",
        "wcnabuji",
        "bu",
        "chongci",
        "wccool",
        "wc",
        "wc2",
        "wcshuai",
        "wcniu",
        "wcnabuji",
        "bu",
        "chongci",
        "chongci a what",
        "chongci ah~",
        "jijijia",
        "jijiji",
        "woyaosile",
        "wcnabuji",
        "zuishuang",
        "tujinchongci",
        "fang",
        "shu",
        "wua",
    ],
    short: [
        "abei",
        "bei",
        "buxi",
        "sb",
        "sb2",
        "sb3",
        "sb4",
        "shit",
        "aiya",
        "bububu",
        "ur bei",
        "ur shit",
        "hhhhhh",
        "big sb",
        "start",
        "wobuhui",
        "shuangbushuang",
        "be bei",
        "sb nanbeng",
        "chunchunsb",
        "hei",
        "eiheihei",
    ],
    middle: [
        "dingzhen1",
        "dingzhen2",
        "busheep",
        "japan",
    ],
    lol: [
        "air",
        "kor",
    ]
};
let amx = 0;
let amy = 0;
let amz = 0;

const accuracy = document.getElementById("lmd");
const testButton = document.getElementById("btn1");
const resetButton = document.getElementById("btn2");
const clearCacheButton = document.getElementById("btn3");
const character = document.getElementById("character");
const voiceType = document.getElementById("voicetype");
const autoMusic = document.getElementById("automusic");
const image = document.getElementById("img1");
const titleDiv = document.getElementById("title-div");
const dashboard = document.getElementById("panel1");
const cacheOk = document.getElementById("cacheok");
const sensOk = document.getElementById("sensok");

var aabei_accuracy = localStorage.getItem("aabei_lmd") || 5;
accuracy.value = aabei_accuracy;
let msg = accuracy >= 20 ? "握紧设备！" : "平放于桌面";
document.getElementById("lmdv").innerHTML = `[${Number(aabei_accuracy).toFixed(1)}]&nbsp;&nbsp;${msg}`;
// document.getElementById("lmdv").innerHTML = lmd;
var inob = false;
var selchar = localStorage.getItem("aabei_char") || "strange";
if (selchar === "aabei") {
    selchar = "strange";
    localStorage.setItem("aabei_char", "strange");
}
var selvol = localStorage.getItem("aabei_vol") || charvol[selchar][0];
document.getElementById("img1").src = "img/img1.jpg";

character.value = selchar;
voiceType.value = selvol;
var automusic = false;
var touchtime = new Date().getTime();
var mousemode = false;
if (sessionStorage.getItem("aabei_hide") === "1" && !device.ios()) {
    titleDiv.classList.add("hide2");
    dashboard.classList.add("hide2");
} else {
    titleDiv.classList.remove("hide2");
    dashboard.classList.remove("hide2");
}

try {
    for (ele of voiceType.options) {
        if (charvol[selchar].includes(ele.value)) {
            ele.disabled = false;
            ele.style.display = "block";
        } else {
            ele.disabled = true;
            ele.style.display = "none";
            if (voiceType.value === ele.value) {
                selvol = charvol[selchar][0];
            }
        }
    }
    localStorage.setItem("aabei_vol", selvol);
    voiceType.value = selvol;
    image.src = "img/img1.jpg";
    cacheOk.innerHTML = "💬";
    let _filename = "sound/" + selchar + "/" + selvol + ".mp3";
    let _mp3Key = `cachedMP3_${_filename}`;
    let _cachedMP3 = localStorage.getItem(_mp3Key);
    if (_cachedMP3) {
        cacheOk.innerHTML = "✅";
    } else {
        downloadAndCacheMP3(_filename);
    }
} catch (error) { console.warn(error); }
onload = function () {
    if (!device.mobile()) {
        document.getElementById(
            "title1"
        ).innerHTML += `<p>桌面端点此 <button id="btn4">开始</button> 或按Ctrl+Shift+Z<p>`;
        document.getElementById("btn4").addEventListener("click", function () {
            if (checkIfVisible()) {
                if (!mousemode) {
                    this.innerHTML = "停止";
                    window.mousemode = true;
                    document.body.addEventListener("mousemove", bei);
                } else {
                    this.innerHTML = "开始";
                    window.mousemode = false;
                    document.body.classList.remove("hidecur");
                    document.body.removeEventListener("mousemove", bei);
                }
            }
        });
    }
};

function downloadAndCacheMP3(filename, pl = false) {
    // window.inob = true;
    testButton.disabled = true;
    cacheOk.innerHTML = "🔄";
    fetch(filename)
        .then(response => {
            if (!response.ok) {
                cacheOk.innerHTML = "❌";
                testButton.disabled = false;
                // window.inob = false;
                throw new Error(`音频加载失败 (${response.status})`);
            }
            return response.blob();
        })
        .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                const mp3Key = `cachedMP3_${filename}`;
                localStorage.setItem(mp3Key, base64data);
                console.log(`${filename} cached successfully.`);
                cacheOk.innerHTML = "✅";
                if (pl) {
                    audio.src = base64data;
                    audio.play();
                    cacheOk.innerHTML = "✅";
                }
                testButton.disabled = false;
                // window.inob = false;
            };
        })
        .catch((error) => {
            console.error(`Error caching ${filename}:`, error);
            testButton.disabled = false;
            // window.inob = false;
            setTimeout(function () {
                alert("音频加载失败，请刷新页面重试");
            }, 300);
        });
}

function playMP3(filename) {
    // document.getElementById("cacheok").innerHTML = "💬";
    let mp3Key = `cachedMP3_${filename}`;
    let cachedMP3 = localStorage.getItem(mp3Key);
    if (cachedMP3) {
        audio.src = cachedMP3;
        audio.play();
        cacheOk.innerHTML = "✅";
    } else {
        downloadAndCacheMP3(filename, true);
    }
}

function clearAudioCache() {
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cachedMP3_')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });

    console.log('音频缓存已清空');
}

if (device.ios()) {
    function requestOrientationPermission() {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response == "granted") {
                    window.addEventListener("devicemotion", dm);
                }
            })
            .catch(console.error);
    }
    testButton
        .addEventListener("click", function () {
            if (checkIfVisible()) {
                requestOrientationPermission()
            }
        });
} else {
    window.addEventListener("devicemotion", dm);
}

function dm(event) {
    sensOk.innerHTML = "✅";
    let acc = event.acceleration;
    accx = acc.x || 0;
    accy = acc.y || 0;
    accz = acc.z || 0;
    Math.abs(accx) > Math.abs(amx) ? (amx = accx) : 0;
    Math.abs(accy) > Math.abs(amy) ? (amy = accy) : 0;
    Math.abs(accz) > Math.abs(amz) ? (amz = accz) : 0;
    document.getElementById("sens").innerHTML = `${accx.toFixed(
        2
    )}, ${accy.toFixed(2)}, ${accz.toFixed(2)}<br>Max: ${amx.toFixed(
        2
    )}, ${amy.toFixed(2)}, ${amz.toFixed(2)}`;
    if (
        Math.abs(accx) >= aabei_accuracy ||
        Math.abs(accy) >= aabei_accuracy ||
        Math.abs(accz) >= aabei_accuracy
    ) {
        bei();
    }
}

function checkIfVisible(htmlElement = dashboard) {
    return !htmlElement.classList.contains("hide2");
}


testButton.addEventListener("click", function () {
    if (checkIfVisible()) {
        bei();
    }
});

resetButton.addEventListener("click", function () {
    if (checkIfVisible()) { amx = amy = amz = 0; }
});

clearCacheButton.addEventListener("click", function () {
    if (checkIfVisible() && confirm("确定要清空音频缓存吗？清空后需要重新加载音频")) {
        clearAudioCache();
        alert("清空完成！");
        cacheOk.innerHTML = "💬";
    }
});

accuracy.addEventListener("input", function () {
    window.aabei_accuracy = this.value;
    localStorage.setItem("aabei_lmd", aabei_accuracy);
    let msg = accuracy >= 20 ? "握紧设备！" : "平放于桌面";
    document.getElementById("lmdv").innerHTML = `[${Number(aabei_accuracy).toFixed(
        1
    )}]&nbsp;&nbsp;${msg}`;
});

document.getElementById("obje-div").addEventListener("click", function () {
    if (new Date().getTime() - touchtime < 300) {
        titleDiv.classList.toggle("hide2");
        dashboard.classList.toggle("hide2");
        if (
            [...dashboard.classList].includes("hide2")
        ) {
            sessionStorage.setItem("aabei_hide", 1);
            character.disabled = true;
            voiceType.disabled = true;
            accuracy.disabled = true;
            autoMusic.disabled = true;
        } else {
            sessionStorage.setItem("aabei_hide", 0);
            character.disabled = false;
            voiceType.disabled = false;
            accuracy.disabled = false;
            autoMusic.disabled = false;
        }
        // console.log("dblclick");
    } else {
        touchtime = new Date().getTime();
        // console.log("click")
    }
});

character.addEventListener("change", function(){
    window.selchar = this.value;
    localStorage.setItem("aabei_char", selchar);
    for (ele of voiceType.options) {
        if (charvol[selchar].includes(ele.value)) {
            ele.disabled = false;
            ele.style.display = "block";
        } else {
            ele.disabled = true;
            ele.style.display = "none";
            if (voiceType.value === ele.value) {
                selvol = charvol[selchar][0];
                localStorage.setItem("aabei_vol", selvol);
                voiceType.value = selvol;
                image.src = "img/img1.jpg";
                cacheOk.innerHTML = "💬";
                downloadAndCacheMP3("sound/" + selchar + "/" + selvol + ".mp3");
            }
        }
    }
    let filename = "sound/" + selchar + "/" + selvol + ".mp3";
    let mp3Key = `cachedMP3_${filename}`;
    let cachedMP3 = localStorage.getItem(mp3Key);
    if (cachedMP3) {
        cacheOk.innerHTML = "✅";
    } else {
        downloadAndCacheMP3(filename);
    }
});

voiceType.addEventListener("change", function () {
    window.selvol = this.value;
    localStorage.setItem("aabei_vol", selvol);
    image.src = "img/img1.jpg";
    cacheOk.innerHTML = "💬";
    let filename = "sound/" + selchar + "/" + selvol + ".mp3";
    let mp3Key = `cachedMP3_${filename}`;
    let cachedMP3 = localStorage.getItem(mp3Key);
    if (cachedMP3) {
        cacheOk.innerHTML = "✅";
    } else {
        downloadAndCacheMP3(filename);
    }
});


function bei() {
    if (!inob) {
        try {
            clearTimeout(timer1);
        } catch (e) { }
        window.inob = true;
        setTimeout(() => {
            image.classList.remove("hide");
            if (!device.ios()) {
                window.navigator.vibrate(400);
            }
            shake("img1");
        }, 500);
        if (automusic) {
            setTimeout(() => {
                try {
                    document.querySelector(".aplayer-play").click();
                } catch (e) { }
            }, 1000);
        }
        testButton.disabled = true;
        // document.getElementById("lmd").disabled = true;
        character.disabled = true;
        voiceType.disabled = true;
        playMP3("sound/" + selchar + "/" + selvol + ".mp3");
        window.timer1 = setTimeout(() => {
            if (inob) {
                image.classList.add("hide");
                // for (let ele of document.getElementsByName("vol")) {
                //     if (ele.value <= 4) {
                //         ele.disabled = false;
                //     }
                // }
                testButton.disabled = false;
                // document.getElementById("lmd").disabled = false;
                character.disabled = false;
                voiceType.disabled = false;
                window.inob = false;
            }
            try {
                clearTimeout(timer1);
            } catch (e) { }
        }, 300);
    }
}

function shake(elemId) {
    let elem = document.getElementById(elemId);
    if (!device.ios()) {
        if (elem) {
            elem.classList.add("shake");
            setTimeout(() => {
                elem.classList.remove("shake");
            }, 800);
        }
    } else {
        const startTime = Date.now();
        const startX = parseFloat(window.getComputedStyle(elem).left);
        const startY = parseFloat(window.getComputedStyle(elem).top);

        function animate() {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / 200, 1);
            const t = progress * Math.PI * 2;

            const offsetX = Math.sin(t * 10) * 6;
            const offsetY = Math.cos(t * 10) * 6;
            elem.style.left = startX + offsetX + "px";
            elem.style.top = startY + offsetY + "px";

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                elem.style.left = startX + "px";
                elem.style.top = startY + "px";
            }
        }

        animate();
    }
}

document.body.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.shiftKey && event.keyCode == 90) {
        event.preventDefault();
        if (!mousemode) {
            clearCacheButton.innerHTML = "停止";
            window.mousemode = true;
            document.body.classList.add("hidecur");
            document.body.addEventListener("mousemove", bei);
        } else {
            clearCacheButton.innerHTML = "开始";
            window.mousemode = false;
            document.body.classList.remove("hidecur");
            document.body.removeEventListener("mousemove", bei);
        }
    }
});
