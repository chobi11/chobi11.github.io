
tmpDATA = DATA;

const cout = (a) => {
    if (localStorage.getItem('dev') === 'on') {
        console.log(a);
    }
}
setTimeout(() => {
    if (navigator.onLine) getouthold(); console.log('hold sync');
}, 1000);

cout(DATA.length + " numbers of data found");
//var internet=true;
var now;//current image serial
var err = ['499 Client Closed Request', '444 No Response', '405 Method Not Allowed', '412 Precondition Failed', '421 Misdirected Request', '424 Failed Dependency', '426 Upgrade Required', '431 Request Header Fields Too Large', '501  Not Implemented', '416 Range Not Satisfiable', '599 Network Connect Timeout Error', '530 Site is frozen', '498 Invalid Token', '419 Page Expired', '505 HTTP Version Not Supported', '504 Gateway Timeout', '503 Service Unavailable', '502 Bad Gateway', '500 Internal Server Error', '429 Too Many Requests', '428 Precondition Required', '421 Misdirected Request', '400 Bad Request', '424 Failed Dependency', '401 Unauthorized', '403 Forbidden', '404 Not Found', '511 Network Authentication Required', '417 Expectation Failed', '408 Request Timeout', '415 Unsupported Media Type'];
var a;
var hi;//hold serial
var cropeditval;//value of crop edit image
var hc = false;//hld current
var cropeditinterval;
var col = 1;
var big = 0;
var ed = new Date().getDate() - 1;
var rnum;
var croppedImage;
var cphide = 0;
var phide1 = 0;
var phide2 = 0;
var phide3 = 0;
var num = 12;
var fulls = 0;
var leftRightTrack = 0;
var plays = 0;
var playls = 0;
var panelem;
var aaudio = 0;
var phone = false;
var unholdf = false;
var thresholdtime = +new Date();
thresholdtime = thresholdtime + 180000;
if (localStorage.getItem('croprand') === null) { //set idle if not set
    localStorage.setItem('croprand', '[]');
}
if (localStorage.getItem('idle') === null) { //set idle if not set
    localStorage.setItem('idle', 'off');
}
if (localStorage.getItem('dev') === null) { //set dev if not set
    localStorage.setItem('dev', 'off');
}
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    phone = true; console.log("phone");
}
hider();
if (localStorage.getItem("col") == 1) {
    //DATA = DATAf; len = DATA.length;
}
else if (localStorage.getItem("col") == 2) {
    DATA = DATAd; len = DATA.length;
}
else {
    localStorage.setItem("col", 3);
    DATA = DATAf; len = DATA.length;
}
cmobile();
var len = DATA.length; //getting total array
loader(DATA);
const devonoff = () => {
    if (localStorage.getItem('dev') === 'on') {
        localStorage.setItem('dev', 'off');
        console.clear();
    } else {
        localStorage.setItem('dev', 'on');

    }
}

function ds(s) {

    if (s == 'f') { if ((localStorage.getItem("col") == 1 || localStorage.getItem("col") == 2)) { DATA = DATAf; len = DATA.length; reload(); localStorage.setItem("col", 3); } }
    else if (s == 'd') { if ((localStorage.getItem("col") == 1 || localStorage.getItem("col") == 3)) { DATA = DATAd; len = DATA.length; reload(); localStorage.setItem("col", 2); } }
    else { if ((localStorage.getItem("col") == 2 || localStorage.getItem("col") == 3)) { DATA = tmpDATA; len = DATA.length; reload(); localStorage.setItem("col", 1); } }
    //if(localStorage.getItem('data')!=s){localStorage.setItem('data',s);location.reload();}
}
let changesrc = (myImage, num, inc) => {
    const myRequest = new Request(DATA[num]);

    fetch(myRequest).then((response) => {
        //cout(response.status);
        if (response.status == "200") {
            response.blob().then((myBlob) => {
                const objectURL = URL.createObjectURL(myBlob);
                myImage.src = objectURL;
                myImage.setAttribute("num", num);
                cout("solved at num " + num);
            });
        }
        else if (response.status == "404") {
            changesrc(myImage, num + inc);
        }
    });
};
function loader(arr) { //image loader function

    var div = document.querySelector("body > div.images");
    var i = 0;
    for (; i < num; i++) {
        let img = document.createElement('img');
        rnum = Math.floor(Math.random() * (len - 0) + 0);
        img.src = arr[rnum];
        img.setAttribute("num", rnum);
        img.addEventListener("error", () => {
            cout(img.src);
            img.src = DATA[parseInt(img.getAttribute("num")) + 1];
            img.setAttribute("num", (parseInt(img.getAttribute("num")) + 1));
        });
        div.append(img);
    }
    jq();
}

window.onscroll = function (ev) { //new image with scroll

    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 150)) {
        loader(DATA);
    }
}

function jq() {
    setTimeout(function () { //for every load its needed
        var $ = window.jQuery;
        $(".images img").click(function () {
            $("#full-image").attr("src", $(this).attr("src"));
            $("#full-image").attr("num", $(this).attr("num"));
            $('#image-viewer').show();
            $('body').addClass('stop-scrolling');
            big = 1;
            if (!phone) { showFoo(2000); }
            now = parseInt(childnum(this));
            var tnum = parseInt($(this).attr("num"));
            var imglr = new Image();
            imglr.src = DATA[tnum + 1];
            var imgll = new Image();
            imgll.src = DATA[tnum - 1];
        });
        $("#full-image").dblclick(function () { //double click full screen
            if (big == 1 && !phone) {
                fullscreen();
            }
        });
        $("#image-viewer .close").unbind('click').bind('click', function () { //close
            if (plays == 1) {
                play();
            }
            if (playls == 1) {
                playl();
            }
            if (fulls == 1) {
                fullscreen();
            }
            closeviewer();
        });
        $("#image-viewer .right").unbind('click').bind('click', function () { //right
            right();
        });
        $("#image-viewer .left").unbind('click').bind('click', function () { //left
            left();
        });
        $("#image-viewer .rightl").unbind('click').bind('click', function () { //right
            rightl();
        });
        $("#image-viewer .leftl").unbind('click').bind('click', function () { //left
            leftl();
        });
        if (!phone) {
            $("#image-viewer").unbind('click').bind('click', function (e) { //dark place click close
                if (e.target !== this) {
                    return;
                } else {
                    if (plays == 1) {
                        play();
                    }
                    if (playls == 1) {
                        playl();
                    }
                    if (fulls == 1) {
                        fullscreen();
                    }
                    closeviewer();
                }
            });
        }

    }, 1000);
}
function closeviewer() {
    $('body').removeClass('stop-scrolling')
    $('#image-viewer').fadeOut(200);
    big = 0; unpan();
    leftRightTrack = 0;
}

aTag = document.querySelector(".phidem");
if (localStorage.getItem('hide') == '0') {
    aTag.style.opacity = '0';
} else {
    aTag.style.opacity = '1';
}
rTag = document.querySelector(".reload");
if (localStorage.getItem('hide') == '0') {
    rTag.setAttribute('style', "opacity: 0;zoom: .01;");
} else {
    rTag.setAttribute('style', "opacity: .6;zoom:.6;");
}

function cmobile() {
    if (phone) { //for small less image load
        if (localStorage.getItem('hide') === null) { //set hide if not set
            localStorage.setItem('hide', 0);
        }
        if (localStorage.getItem('hide') == '0') { // hide if hidden using local storage
            //$('.images').ready(function() { $("body > img").css("opacity",'0.2');});
            $('.images').hide();
            $('#image-viewer').hide();
            document.title = err[ed];
        }
        num = 6;

        $("#image-viewer").unbind('click').bind('click', function (e) {



            var pWidth = $(this).innerWidth();
            var pHeight = $(this).innerHeight(); //use .outerWidth() if you want borders
            var pOffset = $(this).offset();
            var x = e.pageX - pOffset.left;
            var y = e.pageY - pOffset.top;

            if (pHeight * .1 < y && pHeight * .6 > y) {
                if (pWidth * .4 > x) {
                    left();
                }
                if (pWidth * .6 < x) {
                    right();
                }
            }
            if (pHeight * .6 < y && pHeight * 1 > y) {
                if (pWidth * .4 > x) {
                    leftl();
                }
                if (pWidth * .6 < x) {
                    rightl();
                }
            }
        });
    }

}
keyCodeToChar = { 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt", 19: "Pause/Break", 20: "Caps Lock", 27: "Esc", 32: "Space", 33: "Page Up", 34: "Page Down", 35: "End", 36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 45: "Insert", 46: "Delete", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z", 91: "Windows", 93: "Right Click", 96: "Numpad 0", 97: "Numpad 1", 98: "Numpad 2", 99: "Numpad 3", 100: "Numpad 4", 101: "Numpad 5", 102: "Numpad 6", 103: "Numpad 7", 104: "Numpad 8", 105: "Numpad 9", 106: "Numpad *", 107: "Numpad +", 109: "Numpad -", 110: "Numpad .", 111: "Numpad /", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "Num Lock", 145: "Scroll Lock", 182: "My Computer", 183: "My Calculator", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'" };
keyCharToCode = { "Backspace": 8, "Tab": 9, "Enter": 13, "Shift": 16, "Ctrl": 17, "Alt": 18, "Pause/Break": 19, "Caps Lock": 20, "Esc": 27, "Space": 32, "Page Up": 33, "Page Down": 34, "End": 35, "Home": 36, "Left": 37, "Up": 38, "Right": 39, "Down": 40, "Insert": 45, "Delete": 46, "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57, "A": 65, "B": 66, "C": 67, "D": 68, "E": 69, "F": 70, "G": 71, "H": 72, "I": 73, "J": 74, "K": 75, "L": 76, "M": 77, "N": 78, "O": 79, "P": 80, "Q": 81, "R": 82, "S": 83, "T": 84, "U": 85, "V": 86, "W": 87, "X": 88, "Y": 89, "Z": 90, "Windows": 91, "Right Click": 93, "Numpad 0": 96, "Numpad 1": 97, "Numpad 2": 98, "Numpad 3": 99, "Numpad 4": 100, "Numpad 5": 101, "Numpad 6": 102, "Numpad 7": 103, "Numpad 8": 104, "Numpad 9": 105, "Numpad *": 106, "Numpad +": 107, "Numpad -": 109, "Numpad .": 110, "Numpad /": 111, "F1": 112, "F2": 113, "F3": 114, "F4": 115, "F5": 116, "F6": 117, "F7": 118, "F8": 119, "F9": 120, "F10": 121, "F11": 122, "F12": 123, "Num Lock": 144, "Scroll Lock": 145, "My Computer": 182, "My Calculator": 183, ";": 186, "=": 187, ",": 188, "-": 189, ".": 190, "/": 191, "`": 192, "[": 219, "\\": 220, "]": 221, "'": 222 };

if (!phone) {
    addEventListener("keydown", function (ev) {

        if (document.querySelector("#help") != null) {
            document.querySelector("#help").remove();
            document.querySelector("#iks_help > style").remove();
            return;
        }
        cout(ev.keyCode);
        //start right left
        if ([99, 34, 190].includes(ev.keyCode)) {//
            rightl();
        } else if ([97, 35, 188].includes(ev.keyCode)) {
            leftl();
        } else if ([98, 40].includes(ev.keyCode)) {
            playl();
        } else if ([12, 101].includes(ev.keyCode)) {
            play();
        } else if ([102, 39].includes(ev.keyCode)) {
            right();
        } else if ([100, 37].includes(ev.keyCode)) {
            left();
        }
        // end right left
        //start hold
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 86) { //V
            unholdc();

        } else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 90) { //Z
            hold();

        }
        // else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 88) { //X
        //     unhold();

        // }
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 88) { //X
            unholdl();

        }
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 67) { //C
            delholdl();

        }
        //end hold
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 83) { //H
            search();

        }
        //start hide
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 72) { //H
            localStorage.setItem('hider', 'off');

        }
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && [186, 111, 222].includes(ev.keyCode)) {
            unhide(ev.keyCode);


        }
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 75) {
            idleTimerFunc();



        }
        else if ([186, 111, 222].includes(ev.keyCode)) {//;/'/numpad/
            hide(ev.keyCode);


        }
        else if (ev.keyCode === 72) { //H
            localStorage.setItem('hider', 'on');
            hider();

        }
        //end hide
        //start audio
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 77) { //M
            turnAudioOn();

        } else if ( /*ev.ctrlKey && */ ev.shiftKey && ev.altKey && ev.keyCode === 188) {
            volDown();


        } else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 190) {
            volUp();


        }
        else if (ev.keyCode === 77) { //M
            trunAudioOff();

        }
        //end audio
        //start server work
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && [46, 110, 220, 0].includes(ev.keyCode)) {
            //unhide(ev.keyCode);  
            if (big == 1 && localStorage.getItem('hide') == '1' && localStorage.getItem('hide1') == '1') {
                //playstop();
                UnDelete();

            }
        }
        else if ([46, 110, 220, 0].includes(ev.keyCode)) {
            //unhide(ev.keyCode);  
            if (big == 1 && localStorage.getItem('hide') == '1' && localStorage.getItem('hide1') == '1') {
                if (document.querySelector("#image-viewer > img.play.del") != null) {
                    if (fulls == 0) {
                        document.querySelector("#image-viewer > img.play.del").click();
                    }
                    else {
                        fullscreen();
                        document.querySelector("#image-viewer > img.play.del").click();

                    }
                }
            }
        }
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 81) {
            //unhide(ev.keyCode);  

            snackbar("request made");
            refresh();

        }
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 85) {
            //unhide(ev.keyCode);  
            if (big == 1) {

                //playstop();
                rotate();
            }
        } else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 69) {
            //unhide(ev.keyCode);  
            //if (big == 1) {
            //opens('e');
            cropeditfunc('edit');
            //}
        } else if ( /*ev.ctrlKey && && ev.altKey*/ ev.shiftKey && ev.keyCode === 69) {
            //unhide(ev.keyCode);  
            //if (big == 1) {
            cropeditfunc('crop');
            //}
        } else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 87) {
            //unhide(ev.keyCode);  
            if (big == 1) {
                opens('o');
            }
        }
        else if (ev.keyCode === 85) {
            imageRefresh();

        }
        else if (ev.keyCode === 67) { //C
            copydirectory();

        }
        //end server work
        // start change gallery
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 70) {
            if ((localStorage.getItem("col") == 2)) { ds('f'); }
            else {
                ds('d');
            }
        } else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 68) {
            //ds('f');
        } else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 71) {
            ds('a');
        }
        // end change gallery
        else if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 191) {
            shortcut();
        } else {
            cout(ev.keyCode + " free");
        }

        switch (ev.key.toUpperCase()) {

            // case "ARROWDOWN":
            //     panzoom.zoomOut();
            //     break;
            // case "ARROWUP":
            //     panzoom.zoomIn();
            //     break;
            case "L":
            case "BACKSPACE":
            case "ESCAPE":
                $('#image-viewer').fadeOut(200);
                if (plays == 1) {
                    play();
                }
                if (playls == 1) {
                    playl();
                }
                $('body').removeClass('stop-scrolling')
                big = 0; unpan();
                break;
            case "F":
                if (big == 1) {
                    fullscreen();
                }
                break;
            case "T":
                if (big == 1) {
                    unpan();
                }
                break;
            case "P":
                if (big == 1) {
                    play();
                }
                break;
            case "O":
                if (big == 1) {
                    playl();
                }
                break;
            case "[":
                if (big == 1) {
                    if (plays == 1) {
                        play();
                    }
                    if (playls == 1) {
                        playl();
                    }
                }
                break;
            /*case "ARROWUP":
                      document.body.scrollTop = 0;
                      document.documentElement.scrollTop = 0;
                      break;
            case ";":
                  hide();
              break;
            case "'":
                  hide1();
                  break;*/
            case "R":
                reload();
                break;

            default:
                cout(ev.key.toUpperCase());
                break;
        }
    });
}


function copydirectory() {
    if (big == 1) {
        var uu = document.querySelector("#full-image").src;
        var urr = document.URL;
        //urr = urr.replace('/Pics/index.php', '');
        //uu = uu.replace(urr, 'file:///D:/loi/Pics/');
        uu = uu.replace(urr, '');
        //uu = uu.replace('Pics//Pics', 'Pics');
        //cout(uu);
        var aux = document.createElement("input");
        aux.setAttribute("value", uu);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    }
}

function imageRefresh(f = true) {
    if (web) {
        cout("on web");
        //addoutdir();
        return;
    }
    if (big == 1) {
        var ssr = document.querySelector("#full-image").getAttribute("src");
        if (ssr.includes('?t=')) {
            ssr = ssr.replace('?t=', ':');
            ssr = /(.+):/.exec(ssr)[1];
        }
        var ttt = "?t=" + new Date().getTime();
        DATA[document.querySelector("#full-image").getAttribute('num')] = DATA[document.querySelector("#full-image").getAttribute('num')] + ttt;
        document.querySelector("#full-image").src = ssr + ttt;
        if (f) snackbar('Image Refrshed');
    }
}

function trunAudioOff() {
    if (!(audio.paused)) {
        audio.pause();
        aaudio = 0;
        snackbar('Music Paused');
    }
}

function volUp() {
    audio.volume = (audio.volume < .9) ? audio.volume + .1 : audio.volume;
    if (audio.volume > .95) {
        snackbar('Highest Sound already');
    }
}

function volDown() {
    audio.volume = (audio.volume > .2) ? audio.volume - .1 : audio.volume;
    if (audio.volume < .15) {
        snackbar('Least Sound already');
    }
}

function turnAudioOn() {
    audio.loop = true;
    audio.currentTime = Math.random() * (3700 - 0) + 0;
    audio.pause();
    if (audio.paused && localStorage.getItem('hide') == '1' && localStorage.getItem('hide1') == '1') {
        audio.play();
        aaudio = 1;
        snackbar('Music on');
    }
}

function search() {
    var stt = document.querySelector("#full-image").src;
    stt = stt.replace("localhost:5656", "www.gallerytw.ml");
    stt = stt.replace("localhost:15656", "www.gallerytw.ml");
    stt = stt.replace("http://", "https://www.google.com/searchbyimage?image_url=http://");
    window.open(stt, '_blank');
}

function idleTimerFunc() {
    if (localStorage.getItem('idle') === "off") { //set idle if not set
        localStorage.setItem('idle', 'on');
        idlefunc();
        cout("idle timer " + localStorage.getItem('idle'));
    }
    else {
        localStorage.setItem('idle', 'off');
        cout("idle timer " + localStorage.getItem('idle'));
    }
}
console.log(localStorage.getItem('idle'));
var cropeditfunc = (a) => {

    playstop();
    if (document.querySelector("body > iframe") !== null) {
        document.querySelector("body > iframe").remove();
        clearInterval(cropeditinterval);
    }
    else {
        if (big == 1) {
            var src = document.querySelector("#full-image").getAttribute("src");
            var msrc = get_blob2src(src);
            if (msrc != "") {
                ssr = msrc;
            }
            else {
                ssr = src;
            }
            console.log(ssr);
            var anum = document.querySelector("#full-image").getAttribute('num');
            cropeditval = (a == 'crop') ? { val: ((web) ? ssr : '.' + timeremove(DATA[anum])), web: web, phone: phone,blob_url:DATA[anum] } : { val: ((web) ? ssr : '.' + timeremove(DATA[anum])), height: document.querySelector("#full-image").naturalHeight, width: document.querySelector("#full-image").naturalWidth, web: web, phone: phone,blob_url:DATA[anum] };
            var ifrm = document.createElement("iframe");
            console.log((((new URL(document.URL)).hostname.includes('localhost') ? "http://localhost:5656/index/" : (new URL(document.URL)).hostname + "/index/")) + a + ".html");
            ifrm.setAttribute("src", ((document.URL.includes('5656') ? "http://" + (new URL(document.URL)).hostname + ":5656/index/" : 'https://' + (new URL(document.URL)).hostname + "/index/")) + a + ".html");
            ifrm.style.width = "100%";
            ifrm.style.height = "100%";
            ifrm.frameborder = "0"; ifrm.scrolling = "no";
            document.querySelector("body").appendChild(ifrm);
            var len = (phone && a == 'crop') ? '90' : '100';
            console.log(phone);
            document.querySelector("body > iframe").style = "width: " + len + "%;height: " + len + "%;display: block;left: 0;top:0px;position: fixed;z-index: 1;";

        }
        else { snackbar('no image to crop'); }
    }
}
var timeremove = (ssr) => {
    if (ssr.includes('?t=')) {
        ssr = ssr.replace('?t=', ':');
        ssr = /(.+):/.exec(ssr)[1];
        return ssr;
    }
    else {
        return ssr;
    }
}

var close_cropedit = () => {
    //console.log('calling here');
    var anum = document.querySelector("#full-image").getAttribute('num');
    document.querySelector("body > iframe").remove();
    var ttt = "?t=" + new Date().getTime();
    var ssr = timeremove(DATA[anum]);
    DATA[anum] = (web) ? URL.createObjectURL(croppedImage) : ssr + ttt;
    if(cropeditval.blob_url!=''){
        track_blob(cropeditval.blob_url, DATA[anum]);
    }
    document.querySelector("#full-image").src = DATA[anum];
}
function fullscreen() {
    var elem = document.querySelector("body");//document.querySelector("#image-viewer"); //FULL screen
    if (fulls == 0) {
        document.querySelector("#image-viewer > img.fullscreen").src = "./index/short.bmp";
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
        // if(phone){
        //     document.querySelector("#image-viewer > img.fullscreen").setAttribute('class','fullscreen-m');
        // }
        snackbar('Fullscreen On');
        fulls = 1;
    } else {
        // if(phone){
        //     document.querySelector("#image-viewer > img.fullscreen-m").setAttribute('class','fullscreen');
        // }
        document.querySelector("#image-viewer > img.fullscreen").src = "./index/full.bmp";
        document.exitFullscreen();
        snackbar('Fullscreen Off');
        fulls = 0;
    }
}
function playstop() {
    if (playls == 1) {
        playl();
    }
    if (plays == 1) {
        play();
    }
}
function play() {

    if (plays == 0) {
        if (playls == 1) {
            playl();
        }
        document.querySelector("#image-viewer > img.play").src = "./index/pause.bmp";
        plays = 1;
        timer = setInterval(() => {
            right();
        }, 3000);

    } else {
        document.querySelector("#image-viewer > img.play").src = "./index/play.bmp";
        clearInterval(timer);
        plays = 0;
    }
}

function playl() {

    if (playls == 0) {
        if (plays == 1) {
            play();
        }
        document.querySelector("#image-viewer > img.playl").src = "./index/pause.bmp";
        playls = 1;
        timer = setInterval(() => {
            if (leftRightTrack == 0) {
                rightl();
            }
            else {
                leftl();
            }
        }, 3000);

    } else {
        document.querySelector("#image-viewer > img.playl").src = "./index/play.bmp";
        clearInterval(timer);
        playls = 0;
    }
}

if (!phone) {
    var audio = new Audio('./index/aaa.mpp');
    audio.volume = .1;

    $(window).blur(function () { // windows change
        if (localStorage.getItem('idle') == 'on') { timeup(1); }
        audio.pause();
    });
    $(window).focus(function () {

        if (aaudio == 1) {
            if (audio.paused && $('.images').is(":visible")) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    });
}
/* audio */
document.querySelector("#full-image").addEventListener("error", loadfailed);
function loadfailed() {
    if (leftRightTrack == 0) {
        rightl();
    }
    else {
        leftl();
    }
}
function right() {

    if (big == 1) {
        leftRightTrack = 0;
        now++;
        if (document.querySelector("body > div.images > img:nth-child(" + ((now + 3)) + ")") == null) { //if next element null load it
            loader(DATA);
        }
        document.querySelector("#image-viewer > span.right.arrow").style.right = 37;
        setTimeout(function () {
            document.querySelector("#image-viewer > span.right.arrow").style.right = 45;
        }, 300);
        document.querySelector("#full-image").src = document.querySelector("body > div.images > img:nth-child(" + (now) + ")").src;
        document.querySelector("#full-image").setAttribute("num", document.querySelector("body > div.images > img:nth-child(" + (now) + ")").getAttribute("num"));
        var tnum = parseInt(document.querySelector("#full-image").getAttribute("num"));
        var imgrr = new Image();
        imgrr.src = DATA[tnum + 1];
        var imgrl = new Image();
        imgrl.src = DATA[tnum - 1];
        unpan();
    }
}

function left() {

    if (big == 1 && now > 1) {
        leftRightTrack = 0;
        //leftRightTrack = 1;
        now--;
        document.querySelector("#image-viewer > span.left.arrow").style.left = 37;
        setTimeout(function () {
            document.querySelector("#image-viewer > span.left.arrow").style.left = 45;
        }, 300);
        document.querySelector("#full-image").src = document.querySelector("body > div.images > img:nth-child(" + (now) + ")").src;
        document.querySelector("#full-image").setAttribute("num", document.querySelector("body > div.images > img:nth-child(" + (now) + ")").getAttribute("num"));
        var tnum = parseInt(document.querySelector("#full-image").getAttribute("num"));
        var imglr = new Image();
        imglr.src = DATA[tnum + 1];
        var imgll = new Image();
        imgll.src = DATA[tnum - 1];
        unpan();
    }
}

function rightl() {

    var tnumr = parseInt(document.querySelector("#full-image").getAttribute("num")); //cout('previous: '+tnumr);cout('new: '+(tnumr+1));
    if (big == 1) {
        leftRightTrack = 0;
        if (tnumr == DATA.length - 1) { tnumr = -1; }
        document.querySelector("#full-image").src = DATA[tnumr + 1];
        document.querySelector("#full-image").setAttribute("num", tnumr + 1);
        loadimg([DATA[tnumr + 2], DATA[tnumr + 3], DATA[tnumr + 4]]);
        unpan();
    }
}

function leftl() {

    var tnuml = parseInt(document.querySelector("#full-image").getAttribute("num")); //cout('previous: '+tnuml);cout('new: '+(tnuml-1));
    if (big == 1) {
        //leftRightTrack = 1;
        leftRightTrack = 1;
        if (tnuml == 0) { tnuml = DATA.length; }
        document.querySelector("#full-image").src = DATA[tnuml - 1];
        document.querySelector("#full-image").setAttribute("num", tnuml - 1);
        loadimg([DATA[tnuml - 2], DATA[tnuml - 3], DATA[tnuml - 4]]);
        unpan();
    }
}
function setr1() {
    r1 = parseInt(document.querySelector("#full-image").getAttribute("num"));
}
function setr2() {
    r2 = parseInt(document.querySelector("#full-image").getAttribute("num"));
    ReverseAll();
}
function unsetr1r2() {
    r1 = -1; r2 = -1;
}
function shortcut() {
    if (localStorage.getItem('hide1') != '0' && localStorage.getItem('hide') != '0') {
        var h = localStorage.getItem('hider');
        var dev = localStorage.getItem('dev');

        if (document.querySelector("#help") == null) {
            (eHelp = document.createElement("DIV")).id = "iks_help";
            eHelp.innerHTML = `<style>
        #iks_help{position:fixed;z-index:999999999;left:0;top:0;right:0;bottom:0;background:rgb(0,0,0,0.5);cursor:pointer}
        #help{position:fixed;right:.5em;bottom:.5em;border:2px solid #000;border-radius:.5em;padding:.5em;background:#fff;font-size:11pt;line-height:normal}
        #iks_title{margin-bottom:.5em;font-size:14pt;font-weight:bold;line-height:normal}
        #iks_list tr:nth-child(2n+1){background:#eee}
        #iks_list td{padding:.05em .3em;vertical-align:middle;font-size:11pt;font-weight:normal;line-height:normal}
        #iks_list div{padding-right: 5px;padding-left: 5px;display:inline-block;border:1px solid #000;border-radius:.3em;min-width:1.6em;background:#fff;text-align:center;font-weight:bold;line-height:1.4em}
        .link { background: #b8bbf9 !important; }
        </style>
        <div id="help">
        <div id="iks_title">Keyboard Shortcuts List</div>
        <table id="iks_list">
        <tr><td><div>Dev Mode</div></td><td onclick="devonoff();"><div class="link">`+ dev + `</div></td></tr>
        <tr><td><div>Hider (H)</div></td><td onclick="togglehider();"><div class="link">`+ h + `</div></td></tr>
        <tr><td><div>Idle Timer(SA+K)</div></td><td onclick="idleTimerFunc();"><div class="link">`+ localStorage.getItem('idle') + `</div></td></tr>
        <tr><td><div>left|n4</div>|<div>right|n6</div></td><td>Right|Left Image.</td></tr>
        <tr><td><div>A|<|n1</div>|<div>D|>|n3</div></td><td>Right|Left Image(same folder).</td></tr>
        <tr><td><div>L|Bsp|Esc</div></td><td>Close Viewer.</td></tr>
        <tr><td><div>F</div></td><td>Viewer Fullscreen.</td></tr>
        <tr><td><div>P|n5</div>|<div>O|n2</div></td><td>Play Media(by web|by folder)</td></tr>
        <tr><td><div>[</div></td><td>Stop Media Player.</td></tr>
        <tr><td><div>R</div></td><td>Reload Images.</td></tr>
        <tr><td><div>"</div><div>;</div><div>n/</div></td><td>Hide.</td></tr>
        <tr><td><div>Del</div>|<div>SA+Del</div></td><td>Delete|Undelete Image.</td></tr>
        <tr><td><div>SA+Z</div></td><td>Hold Page.</td></tr>
        <tr><td><div>SA+X</div></td><td>Unhold From List.</td></tr>
        <tr><td><div>SA+C</div></td><td>Delete From Unhold List.</td></tr>
        <tr><td><div>SA+V</div></td><td>Unhold Current.</td></tr>
        <tr><td><div>Flush Holdlist</div></td><td onclick="getouthold(true);"><div class="link">Flush</div></td></tr>
        `+
                ((!web) ? (`
        <tr><td><div>SA+Q</div></td><td>Refresh Image Collection.</td></tr>
        
        <tr><td><div>SA+U</div></td><td>Rotate Image.</td></tr>
        <tr><td><div>Alt+E</div></td><td>Edit Image.</td></tr>
        <tr><td><div>Sh+E</div></td><td>Crop Image.</td></tr>
        <tr><td><div>SA+W</div></td><td>Open Image</td></tr>`
                    +
                    ((big == 1) ? (`
        `
                        +
                        ((r1 == -1) ? `<tr><td><div>Reverse</div></td><td onclick="setr1();"><div class="link">Select A</div></td></tr>` : ``)
                        +
                        ((r1 != -1 && r2 == -1) ? `<tr><td><div>Reverse</div></td><td onclick="setr2();"><div class="link">Select B</div></td></tr>` : ``)

                    ) : ``)

                ) : ``)
                + `
        <tr><td><div>C</div></td><td>Copy Location.</td></tr>
        <tr><td><div>SA+M</div>|<div>M</div></td><td>Play|Stop Audio.</td></tr>
        <tr><td><div>SA+<></div></td><td>Increase/Decrease Vol.</td></tr>
        </table>
        </div>`;

            eHelp.onclick = () => eHelp.remove();
        }
        if (eHelp.parentNode) {
            eHelp.remove();
        } else { document.querySelector("body").appendChild(eHelp); }


    }
}
function togglehider() {
    if (localStorage.getItem('hider') == "off") {
        localStorage.setItem('hider', 'on');
        hider();
    }
    else {
        localStorage.setItem('hider', 'off');
    }
}

function phnopt() {

    var h = localStorage.getItem('hider');

    if (document.querySelector("#help") == null && localStorage.getItem('hide1') != '0' && localStorage.getItem('hide') != '0') {
        (eHelp = document.createElement("DIV")).id = "iks_help";
        eHelp.innerHTML = `<style>
        #iks_help{position:fixed;z-index:999999999;left:0;top:0;right:0;bottom:0;background:rgb(0,0,0,0.5);cursor:pointer;display: flex;align-items: center;}
        .subopt{border: 2px solid #beaeae;padding: .8em;}
        #help{    position: fixed;
    /* right: 0.5em;
    /* bottom: 0.5em; 
    top: 20%;*/
    border: 2px solid #000;
    border-radius: 0.5em;
    padding: 0.5em;
    background: #000;
    font-size: 11pt;
    line-height: normal;
    width: 100%;}
    table#iks_list {
    width: 100%;
}
        #iks_list tr:nth-child(2n+1){background:#eee}
        #iks_list div{padding-right: 5px;
    /* padding-left: 5px; */
    /* display: inline-block; */
    border: 1px solid #000;
    border-radius: 0.3em;
    /* min-width: 2em; */
    background: #000;
    text-align: center;
    font-weight: bold;
    line-height: 3em;
    color:white;
    font-size: 3em;}
    @media only screen and (max-height: 1000px) and (max-width: 1000px) {
        #iks_list div {font-size: 1em;
            line-height: 1.5em;
}
    }
        </style>
        <div id="help">
        <table id="iks_list">
        <tr><td><div><a onclick="if(localStorage.getItem('hider')=='off'){localStorage.setItem('hider','on');
    hider();}else{localStorage.setItem('hider','off');}">hider `+ localStorage.getItem('hider') + `</a></div></td></tr>
        <tr><td><div><a class="subopt"  onclick="hold();hidephnopt();">hold</a>&nbsp;&nbsp;
        <a class="subopt"  onclick="unholdl();hidephnopt();">unhold list</a>&nbsp;&nbsp;`
            + ((unholdf) ? `<a class="subopt"  onclick="unholdc();hidephnopt();">undo</a>` : '') +

            `</div></td></tr><tr><td><div>`
            + ((localStorage.getItem("col") != 1) ? `<a class="subopt"  onclick="ds('a');hidephnopt();">mix</a>&nbsp;&nbsp;&nbsp;&nbsp;` : '')
            + ((localStorage.getItem("col") != 2) ? `<a class="subopt"  onclick="ds('d');hidephnopt();">desi</a>&nbsp;&nbsp;&nbsp;&nbsp;` : '')
            + ((localStorage.getItem("col") != 3) ? `<a class="subopt"  onclick="ds('f');hidephnopt();">foreign</a>` : '')
            + `</div></td></tr>`

            + ((big == 1) ? ((web) ? '<tr><td><div><a class="subopt" onclick="rotate(90);hidephnopt();">rotate x1</a> <a class="subopt"  onclick="rotate(180);hidephnopt();">rotate x2</a><a class="subopt"  onclick="rotate(270);hidephnopt();">rotate x3</a></div></td></tr>'
                : '<tr><td><div><a class="subopt" onclick="rotate(90);hidephnopt();">rotate x1</a> <a class="subopt"  onclick="rotate(180);hidephnopt();">rotate x2</a><a class="subopt"  onclick="rotate(270);hidephnopt();">rotate x3</a></div></td></tr>') : '')
            + ((big == 1) ? `<tr><td><div><a class="subopt" onclick="cropeditfunc('crop');hidephnopt();">Crop</a> &nbsp;&nbsp;<a class="subopt"  onclick="cropeditfunc('edit');hidephnopt();">Edit</a></div></td></tr>` : ``)
            +
            `</table>
        
        </div>`;
        eHelp.onclick = () => eHelp.remove();
    }
    if (eHelp.parentNode) {
        eHelp.remove();
    } else document.querySelector("body").appendChild(eHelp);

}
function hidephnopt() {

    if (document.querySelector("#help") != null) {
        document.querySelector("#help").remove();
        document.querySelector("#iks_help > style").remove();
    }
}

/* ---------------------------Hide------------------------ */
function hider() {
    //if(!phone) {
    if (localStorage.getItem('hider') === null) { //set hide if not set
        localStorage.setItem('hider', 'on');
    }
    if (localStorage.getItem('hider') == 'on') {
        if (localStorage.getItem('hide1') != '0' && localStorage.getItem('hide') != '0') {
            localStorage.setItem('hide', 0);
        }
    }
    if (localStorage.getItem('hide1') != '0' && localStorage.getItem('hide') != '0') {
        document.title = 'Gallery';
        $('img.reload').ready(function () {
            $('img.reload').css('display', 'block');
        });
    }
    if (localStorage.getItem('hide1') === null) { //set hide if not set
        localStorage.setItem('hide1', 1);
    }
    if (localStorage.getItem('hide1') == '0') {
        $('.images').hide();
        $('#image-viewer').hide();
        var iframe = document.createElement('iframe');
        document.title = 'Home | AIUB';
        iframe.style = "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"
        iframe.src = 'https://www.aiub.edu/';
        document.body.appendChild(iframe);
    }
    if (localStorage.getItem('hide') === null) { //set hide if not set
        localStorage.setItem('hide', 0);
    }
    if (localStorage.getItem('hide') == '0') { // hide if hidden using local storage
        $('.images').hide(); $('.opt').hide();
        $('#image-viewer').hide();
        $('.reload').hide();
        $('img.phide.phidem').css("opacity", "0.0");
        phide1 = 0; phide2 = 0; phide3 = 0;
        document.title = err[ed];
    }
    //}
}


function hide(key) {
    if (fulls == 1) {
        fullscreen();
    }
    if (document.querySelector("#help") != null) { document.querySelector("#iks_help").remove(); }
    /*if (key == 186) {
        if (!($('.images').is(":visible") == $('.images').is(":hidden"))) {
            if (localStorage.getItem('hide') == '1') {
                if (document.querySelector("body > iframe") == null) {
                    $('.images').hide();
                    $('.reload').hide();
                    if (big == 1) {
                        $('#image-viewer').hide();
                    }
                    document.title = 'Home | AIUB';
                    var iframe = document.createElement('iframe');
                    iframe.style = "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"
                    iframe.src = 'https://www.aiub.edu/';
                    document.body.appendChild(iframe);
                    localStorage.setItem('hide1', 0);
                }
            } else {
                document.title = err[ed];
                $('.images').hide();
                $('.reload').hide();
                if (big == 1) {
                    $('#image-viewer').hide();
                }

            }
            if (aaudio == 1) {
                audio.pause();
            }

        }
    } else if (key == 222||key == 111) {
        */

    if (!($('.images').is(":hidden"))) {
        //if (localStorage.getItem('hide1') == '1') {
        localStorage.setItem('hide', 0);
        document.title = err[ed];
        $('.images').hide();
        $('.reload').hide();
        if (big == 1) {
            $('#image-viewer').hide();
        }
        /*} else {
            if (document.querySelector("body > iframe") == null) {
                $('.images').hide();
                $('.reload').hide();
                var iframe = document.createElement('iframe');
                document.title = 'Home | AIUB';
                iframe.style = "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"
                iframe.src = 'https://www.aiub.edu/';
                document.body.appendChild(iframe);
            }
        }*/
        if (aaudio == 1) {
            audio.pause();
        }
    }

    //}
}

function unhide(key) {
    /*
        if (key == 186) {
            if (document.querySelector("body > iframe") != null) {
                document.querySelector("body > iframe").remove();
                localStorage.setItem('hide1', 1);
                jq();
                document.title = 'Gallery';
                $('.images').show();
                $('.reload').show();
                if (big == 1) {
                    $('#image-viewer').show();
                }
                if (aaudio == 1) {
                    audio.play();
                }
            }
        } else if (key == 222||key == 111) {
            */
    if ($('.images').is(":hidden") && document.querySelector("body > iframe") == null) {
        localStorage.setItem('hide', 1);
        document.title = 'Gallery';
        $('.images').show();
        $('.reload').show();
        if (big == 1) {
            $('#image-viewer').show();

        }
        if (aaudio == 1) {
            audio.play();
        }
    }
    //}


}

function phide() {
    rTag = document.querySelector("body > img.phide.phideb.reload");
    if ($('.images').is(":hidden")) {
        if (phide1 == 0) {
            phide1 = 1;
        } else {
            if (phide2 == 0) {
                phide2 = 1;
            } else {
                if (phide3 == 0) {
                    phide3 = 1;
                } else {
                    $(".phide").css("opacity", '');
                    document.title = 'Gallery';
                    $('.images').show(); $('.opt').show();
                    rTag.setAttribute('style', "opacity: .6;zoom:.6;");
                    if (big == 1) {
                        $('#image-viewer').show();

                    }
                    localStorage.setItem('hide', 1);
                    cphide = 0;
                }
            }
        }
    } else {
        document.title = err[ed];
        $('.images').hide(); $('.opt').hide();
        if (big == 1) {
            $('#image-viewer').hide();
        }
        $(".phide").css("opacity", '0');
        localStorage.setItem('hide', 0);
        phide1 = 0;
        phide2 = 0;
        phide3 = 0;
    }
}
/* ---------------------------Hide------------------------ */
function reload() {

    if (localStorage.getItem('hide') == 1) {
        while (document.querySelector("body > div.images > img:nth-child(1)") != null) {
            $('#image-viewer').hide();
            if (plays == 1) {
                play();
            }
            if (playls == 1) {
                playl();
            }
            $('body').removeClass('stop-scrolling')
            big = 0; unpan();
            document.querySelector("body > div.images > img:nth-child(1)").remove();
        }
        loader(DATA);
        loader(DATA);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        snackbar('Reloaded Images');
    }
}

function loadimg(images) {
    if (!images.length) {
        return;
    }

    var img = new Image(),
        url = images.shift();

    img.onload = function () {
        loadimg(images);
    };
    img.src = url;
}
/* idle timer */
let idleTimer = null;
let idleState = false;

function showFoo(time) {//cursor hide
    clearTimeout(idleTimer);
    if (idleState == true) {
        //
        document.querySelector("#full-image").style.cursor = 'auto';
        if (!phone) { $(".rightl,.leftl,.playl").css("opacity", "0.5"); }
    }
    idleState = false;
    idleTimer = setTimeout(function () {
        document.querySelector("#full-image").style.cursor = 'none';
        if (!phone) { $(".rightl,.leftl,.playl").css("opacity", "0.1"); }
        idleState = true;
    }, time);
}

showFoo(2000);

$('#full-image').mousemove(function () {
    showFoo(2000);
});
/* idle timer */

function snackbar(text) {

    var x = document.getElementById("snackbar");
    x.innerHTML = text;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 1000);
}


function childnum(elm) {
    if (elm.tagName === "BODY") return "BODY";
    const names = [];
    while (elm.parentElement && elm.tagName !== "BODY") {
        if (elm.id) {
            names.unshift("#" + elm.getAttribute("id")); // getAttribute, because `elm.id` could also return a child element with name "id"
            break; // Because ID should be unique, no more is needed. Remove the break, if you always want a full path.
        } else {
            let c = 1,
                e = elm;
            for (; e.previousElementSibling; e = e.previousElementSibling, c++);
            names.unshift(elm.tagName + ":nth-child(" + c + ")");
        }
        elm = elm.parentElement;
    }
    var k = names[1];
    k = k.replace("IMG:nth-child(", "");
    k = k.replace(")", "");
    return k; //return child num when clicked in jquery click
}

function hold() {
    if (confirm("wanna hold?")) {
        if (localStorage.getItem('holdl') == null) {
            localStorage.setItem('holdl', '[]');
            //return;
        }
        if (localStorage.getItem('holdlself') == null) {
            localStorage.setItem('holdlself', '[]');
            //return;
        }
        var tmp = document.querySelector("html").innerHTML;
        localStorage.setItem('tmp', tmp); localStorage.setItem('cbig', big);
        if (big == 1) {
            tmpbig = $("#full-image").attr("src");
            var holdl = JSON.parse(localStorage.holdl);
            holdl.push({ "tmpbig": tmpbig });
            localStorage.setItem('holdl', JSON.stringify(holdl));
            var holdlself = JSON.parse(localStorage.holdlself);
            holdlself.push({ "tmpbig": tmpbig });
            localStorage.setItem('holdlself', JSON.stringify(holdlself));
            if (navigator.onLine) addouthold();
            // tmpbig = $("#full-image").attr("src"); localStorage.setItem('tmpbig', tmpbig);
            // tmpbnum = $("#full-image").attr("num"); localStorage.setItem('tmpnum', tmpbnum);
            // localStorage.setItem('tmpnow', now);
            // snackbar("Holding");
            // var holdl = JSON.parse(localStorage.holdl);
            // holdl.push({ "tmp": tmp, "now": now, "cbig": big.toString(), "tmpbig": tmpbig, "tmpbnum": tmpbnum });
            // localStorage.setItem('holdl', JSON.stringify(holdl));
            // var holdlself = JSON.parse(localStorage.holdlself);
            // holdlself.push({ "tmp": tmp, "now": now, "cbig": big.toString(), "tmpbig": tmpbig, "tmpbnum": tmpbnum });
            // localStorage.setItem('holdlself', JSON.stringify(holdlself));
            // if (navigator.onLine) addouthold();
        }
        else {
            snackbar("No image to hold");

            // var holdl = JSON.parse(localStorage.holdl);
            // holdl.push({ "tmp": tmp, "cbig": big.toString() });
            // localStorage.setItem('holdl', JSON.stringify(holdl));
            // var holdlself = JSON.parse(localStorage.holdlself);
            // holdlself.push({ "tmp": tmp, "cbig": big.toString() });
            // localStorage.setItem('holdlself', JSON.stringify(holdlself));
        }
    }

}



function holdc() {
    if (big == 1) {
        tmpbig = $("#full-image").attr("src"); localStorage.setItem('tmpbigc', tmpbig);
        //snackbar("Holding");
    }
    // var tmp = document.querySelector("html").innerHTML;
    // localStorage.setItem('tmpc', tmp); localStorage.setItem('cbigc', big);
    // localStorage.setItem('ctmpnow', now);
    // if (big == 1) {
    //     tmpbig = $("#full-image").attr("src"); localStorage.setItem('tmpbigc', tmpbig);
    //     tmpbnum = $("#full-image").attr("num"); localStorage.setItem('tmpnumc', tmpbnum);
    //     //snackbar("Holding");
    // }

}
function unholdc() {
    if (big == 1) {
        $("#full-image").attr("num", (DATA.indexOf(localStorage.getItem('tmpbigc'))));
        $("#full-image").attr("src", localStorage.getItem('tmpbigc'));
    }
    // //hi == undefined;
    // hc = true;
    // unholdf = false;
    // document.querySelector("html").innerHTML = localStorage.getItem('tmpc');
    // document.title = 'Gallery'; big = parseInt(localStorage.getItem('cbigc'));
    // jq();
    // now = parseInt(localStorage.getItem('ctmpnow'));
    // if (phone) { cmobile(); }
    // else {
    //     $('#full-image').mousemove(function () {
    //         showFoo(2000);
    //     });
    // }
    // if (localStorage.getItem('cbigc') == '1') {
    //     $('#image-viewer').show(); $("#full-image").attr("src", localStorage.getItem('tmpbigc'));
    //     $("#full-image").attr("num", ((DATA.includes(localStorage.getItem('tmpbigc'))) ? (DATA.indexOf(localStorage.getItem('tmpbigc'))) : (localStorage.getItem('tmpnumc'))));
    // }
    // panner();
    // //hi == undefined;
    // console.log(hi);
}
function unhold() {
    if (localStorage.getItem('tmp') == null) {
        snackbar("nothing holding");
        //return;
    }
    else {
        unholdf = true;
        holdc();
        document.querySelector("html").innerHTML = localStorage.getItem('tmp');
        document.title = 'Gallery'; big = parseInt(localStorage.getItem('cbig'));
        jq();
        now = parseInt(localStorage.getItem('tmpnow'));
        if (phone) { cmobile(); }
        else {
            $('#full-image').mousemove(function () {
                showFoo(2000);
            });
        }
        if (localStorage.getItem('cbig') == '1') {
            $('#image-viewer').show(); $("#full-image").attr("src", localStorage.getItem('tmpbig'));
            $("#full-image").attr("num", ((DATA.includes(localStorage.getItem('tmpbig'))) ? (DATA.indexOf(localStorage.getItem('tmpbig'))) : (localStorage.getItem('tmpnum'))));
        }
        panner();
    }

}

function delholdl() {
    if (typeof hi == 'undefined') {
        snackbar("Didn't Unhold");
        //return;
    }
    else {
        if (localStorage.getItem('holdl') == '[]' || localStorage.getItem('holdl') == null) {
            snackbar("nothing holding");
            //return;
        }
        else {
            if (confirm("wanna delete this hold?")) {
                var holdlist = JSON.parse(localStorage.getItem('holdl'));
                if (navigator.onLine) delouthold(holdlist[hi + 1]);
                console.log(1);

                holdlist.splice(hi + 1, 1);
                localStorage.setItem('holdl', JSON.stringify(holdlist));
                var holdlselflist = JSON.parse(localStorage.getItem('holdlself'));
                holdlselflist.splice(hi + 1, 1);
                localStorage.setItem('holdlself', JSON.stringify(holdlselflist));

            }

        }
    }
}
function unholdl() {

    if (localStorage.getItem('holdl') == '[]' || localStorage.getItem('holdl') == null) {
        snackbar("nothing holding");
        //return;
    }
    else {
        if (big == 1) {
            var holdlist = JSON.parse(localStorage.getItem('holdl'));
            if (typeof hi == 'undefined' || hi == -1 || hc) { hi = holdlist.length - 1; hc = false; }
            if (!unholdf) { holdc(); unholdf = true; }
            $("#full-image").attr("src", holdlist[hi].tmpbig);
            //(DATA.includes(holdlist[hi].tmpbig))
            $("#full-image").attr("num", ((DATA.indexOf(holdlist[hi].tmpbig))));

            hi--;
        }


        // var holdlist = JSON.parse(localStorage.getItem('holdl'));
        // if (typeof hi == 'undefined' || hi == -1 || hc) { hi = holdlist.length - 1; hc = false; }
        // if (!unholdf) { holdc(); unholdf = true; }

        // //holdc();
        // //({ "tmp": tmp,"cbig":big.toString(), "tmpbig": tmpbig, "tmpbnum": tmpbnum });
        // document.querySelector("html").innerHTML = holdlist[hi].tmp; //localStorage.getItem('tmp');
        // document.title = 'Gallery'; big = parseInt(holdlist[hi].cbig);//localStorage.getItem('cbig'));
        // jq();
        // now = parseInt(holdlist[hi].now);
        // if (phone) { cmobile(); }
        // else {
        //     $('#full-image').mousemove(function () {
        //         showFoo(2000);
        //     });
        // }
        // if (holdlist[hi].cbig == '1') {
        //     $('#image-viewer').show(); $("#full-image").attr("src", holdlist[hi].tmpbig);
        //     $("#full-image").attr("num", ((DATA.includes(holdlist[hi].tmpbig)) ? (DATA.indexOf(holdlist[hi].tmpbig)) : (holdlist[hi].tmpnum)));
        // }
        // hi--;
        // panner();
        // jq();
    }
}


/*window.addEventListener('wheel', function(event)
{
   if (event.deltaY < -120 && event.deltaY>-130)
   {
      leftl();
  }
  else if (event.deltaY > 120 && event.deltaY<130)
  {
      rightl();
  }
});*/


//panzoom
const panner = () => {
    panelem = document.querySelector("#full-image");

    panzoom = Panzoom(panelem, { canvas: true, zoomSpeed: 5, panOnlyWhenZoomed: true, minScale: 1.0, contain: true });
    parent = panelem.parentElement;
    // No function bind needed
    //parent.addEventListener('wheel', panzoom.zoomWithWheel)

    // This demo binds to shift + wheel
    parent.addEventListener('wheel', function (event) {


        if (panzoom.getScale() === 1) {
            unpan();
        }
        panzoom.zoomWithWheel(event);//}
    });
    parent.addEventListener('touchend', function (e) {

        if (panzoom.getScale() === 1) {
            unpan();
        }
    }, false);

}
panner();

function unpan() {

    panzoom.reset(panelem);
}
function timeup(y) {
    //cout("t");
    var t = 240000;
    if (y !== undefined) {
        t = t * 3;
    }
    thresholdtime = +new Date();
    thresholdtime = thresholdtime + t;

}
var idlefunc = () => {
    if (localStorage.getItem('idle') == 'on') {

        const events = ['touchmove', 'touchend', 'touchstart', 'click', 'focus', 'change', 'submit', 'keyup', 'wheel', 'mousemove'];

        var idleStatetimer = setInterval(() => {
            current_time = +new Date();
            if (current_time > thresholdtime && localStorage.getItem('idle') == 'on') {
                if (phone) {
                    //phide();
                }
                else {
                    hide(222);
                }
            }
        }, 5000);

        events.forEach(ev => {
            this.addEventListener(ev, () => {
                if (localStorage.getItem('idle') == 'on') {
                    timeup();
                }
            });

        });
    }
}
idlefunc();