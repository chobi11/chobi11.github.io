var link = (new URL(document.URL)).hostname;
var dlist = [];
var blob_list = [];
var r1 = -1;
var r2 = -1;
var web = link.includes('github');
if (typeof DATA == 'undefined') {
  refresh(1);
}
Array.prototype.insert = function (index, ...items) {
  this.splice(index, 0, ...items);
};

function UnDelete() {
  
  if (web) {
    cout("on web");
    UnDeleteWeb();
    return;
  }
  if (dlist.length == 0) {
    snackbar("Nothing to undelete");
    return;
  }
  var nowsame = 0;
  if (fulls == 1 && phone) {
    fullscreen();
  }
  if (confirm("Sure you want to restore?")) {
    cout('y');

    var src = document.querySelector("#full-image").src;
    src = src.replace(document.URL, "./");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
        var kkk = dlist.pop();
        var lshift = kkk.num == parseInt(document.querySelector("#full-image").getAttribute("num"));
        var rshift = kkk.num == (parseInt(document.querySelector("#full-image").getAttribute("num")) + 1);

        DATA.insert(kkk.num, kkk.src);
        var mainimages = document.querySelector("body > div.images").childNodes;

        // if (parseInt(document.querySelector("body > div.images > img:nth-child(" + now + ")").getAttribute('num')) <= kkk.num) {
        //   document.querySelector("body > div.images > img:nth-child(" + now + ")").setAttribute('num', (parseInt(document.querySelector("body > div.images > img:nth-child(" + now + ")").getAttribute('num')) + 1));
        //   if (kkk.now == now) {
        //     document.querySelector("#full-image").setAttribute("num", parseInt(document.querySelector("#full-image").getAttribute("num")) + 1);
        //   }
        // }

        for (var i = 1; i < mainimages.length; i++) {
          if (parseInt(mainimages[i].getAttribute('num')) >= kkk.num) {
            mainimages[i].setAttribute('num', (parseInt(mainimages[i].getAttribute('num')) + 1));

          }
        }

        //console.log(lshift,rshift,leftRightTrack);
        if (lshift && leftRightTrack == 0) {
          //console.log(0);
          //leftl();
          document.querySelector("#full-image").src = DATA[kkk.num];
          //document.querySelector("#full-image").setAttribute("num", parseInt(document.querySelector("#full-image").getAttribute("num")) - 1);
          leftRightTrack = 0;
        }
        if (rshift && leftRightTrack == 1) {
          //console.log(1);
          //rightl();
          document.querySelector("#full-image").src = DATA[kkk.num];
          if (kkk.now == now) {
            document.querySelector("#full-image").setAttribute("num", parseInt(document.querySelector("#full-image").getAttribute("num")) + 1);
          }
          //console.log( parseInt(document.querySelector("#full-image").getAttribute("num")));

          leftRightTrack = 1;
        }
        if (this.responseText == "done") {
          snackbar("Restored");
          var i = parseInt(localStorage.delc);
          if (i >= 1) {
            i--;
            localStorage.delc = i;
          }
        }
        //console.log(this.responseText);
        //console.log(kkk.num);
      }
      else {
        //cout('error');
      }
    };

    xhttp.open("POST", "http://" + link + ":15656/func.php", true);

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("ld=" + src);

  }
  else {
    cout('n');
  }
}

function UnDeleteWeb() {
  if (dblist.length == 0) {
    snackbar("Nothing to undelete");
    return;
  }
  var nowsame = 0;
  if (fulls == 1 && phone) {
    fullscreen();
  }
  if (confirm("Sure you want to restore?")) {
    cout('y');
    var kkk = dblist.pop();
    var lshift = kkk.num == parseInt(document.querySelector("#full-image").getAttribute("num"));
    var rshift = kkk.num == (parseInt(document.querySelector("#full-image").getAttribute("num")) + 1);
    //track_blob(kkk.src, kkk.blob_url);
    DATA.insert(kkk.num, kkk.blob_url);
    var mainimages = document.querySelector("body > div.images").childNodes;

    for (var i = 1; i < mainimages.length; i++) {
      if (parseInt(mainimages[i].getAttribute('num')) >= kkk.num) {
        mainimages[i].setAttribute('num', (parseInt(mainimages[i].getAttribute('num')) + 1));

      }
    }

    if (lshift && leftRightTrack == 0) {
      document.querySelector("#full-image").src = DATA[kkk.num];
      leftRightTrack = 0;
    }
    if (rshift && leftRightTrack == 1) {
      document.querySelector("#full-image").src = DATA[kkk.num];
      if (kkk.now == now) {
        document.querySelector("#full-image").setAttribute("num", parseInt(document.querySelector("#full-image").getAttribute("num")) + 1);
      }
      leftRightTrack = 1;
    }
    upload(kkk.src.replace(gitlink,''),kkk.blob);
    //if (this.responseText == "done") {
      
    //}

  }
  else {
    cout('n');
  }
}

var upload=(path,blob)=>
{
  branch='master';
fetch(`https://api.github.com/repos/${username}/${repo}/git/ref/heads/${branch}`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(response => response.json())
  .then(data => {
    const latestCommitSha = data.object.sha;

    // Step 3: Create a Blob

    // Step 4: Read the Blob
    const reader = new FileReader();
    reader.onload = function () {
      const fileContentBase64 = btoa(reader.result);

      // Step 5: Upload the File
      fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
        method: 'PUT', // or 'POST' for creating a new file
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Upload file via API',
          content: fileContentBase64,
          sha: latestCommitSha,
          branch: branch,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('File uploaded successfully:', data);
          snackbar("Restored");
      var i = parseInt(localStorage.delc);
      if (i >= 1) {
        i--;
        localStorage.delc = i;
      }
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    };

    reader.readAsBinaryString(blob);
  })
  .catch(error => {
    console.error('Error getting latest commit sha:', error);
  });
}
function Delete() {
  if (web) {
    cout("on web");
    addoutdir();
    return;
  }
  var nowsame = 0;//check if image changed
  if (fulls == 1 && phone) {
    fullscreen();
  }
  var sure = (phone) ? confirm("Are you sure") : true;

  if (sure) {
    //   cout('y');
    var anum = parseInt(document.querySelector("#full-image").getAttribute("num"));
    var ssr = DATA[anum];
    cout(ssr);
    if (ssr.includes('?t=')) {
      ssr = ssr.replace('?t=', ':');
      ssr = /(.+):/.exec(ssr)[1];
    }
    if (document.querySelector("#full-image").src == document.querySelector("body > div.images > img:nth-child(" + now + ")").src) {
      nowsame = 1;//not changed
    }
    else {
      nowsame = 0;//changed
    }
    cout(nowsame);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
        //document.querySelector("body > script:nth-child(13)").innerHTML = this.responseText;
        snackbar(this.responseText);
        if (this.responseText == "Deleted") {
          //var anum = parseInt(document.querySelector("#full-image").getAttribute("num"));
          dlist.push({ num: anum, src: DATA[anum], now: now });
          DATA.splice(anum, 1);
          if (leftRightTrack == 0) {
            document.querySelector("#full-image").src = DATA[anum];
            //console.log('if');
          }
          else {
            leftl();
            //console.log('else')
          }
          if (nowsame == 1) {
            document.querySelector("body > div.images > img:nth-child(" + now + ")").src = DATA[anum];
            //document.querySelector("body > div.images > img:nth-child("+now+")").setAttribute('num',anum)        
          }
          var mainimages = document.querySelector("body > div.images").childNodes;
          // if (document.querySelector("#full-image").getAttribute('num') < document.querySelector("body > div.images > img:nth-child(" + now + ")").getAttribute('num')) {//num sync after delete image for re clicking
          //   document.querySelector("body > div.images > img:nth-child(" + now + ")").setAttribute('num', (document.querySelector("body > div.images > img:nth-child(" + now + ")").getAttribute('num') - 1));
          // }
          for (var i = 1; i < mainimages.length; i++) {
            if (mainimages[i].getAttribute('num') > anum) {
              mainimages[i].setAttribute('num', (parseInt(mainimages[i].getAttribute('num')) - 1));
            }
          }
          var i = (localStorage.delc != undefined) ? parseInt(localStorage.delc) : 0;
          if (i >= 50) {
            localStorage.delc = 0;
            if (confirm("too much deletes want to resync?")) {
              refresh();
            }
          }
          else {
            i++;
            localStorage.delc = i;
          }
          //rightl();
        }
      }
      else {
        //cout('error');
      }
    };

    xhttp.open("POST", "http://" + link + ":15656/func.php", true);

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("ddir=" + ssr);

  }
  // else {
  //   cout('n');
  // }
}



function rotate(deg = 90) {

  playstop();
  if (web) {
    cout("on web");
    rotateout(deg);
    return;
  }
  var ssr = document.querySelector("#full-image").getAttribute("src");
  cout(ssr);
  if (ssr.includes('?t=')) {
    ssr = ssr.replace('?t=', ':');
    ssr = /(.+):/.exec(ssr)[1];
  }
  var anum = document.querySelector("#full-image").getAttribute('num');
  var nowsame = 0;//check if image changed

  if (document.querySelector("#full-image").src == document.querySelector("body > div.images > img:nth-child(" + now + ")").src) {
    nowsame = 1;//not changed
  }
  else {
    nowsame = 0;//changed
  }

  cout(ssr);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      snackbar(this.responseText);
      cout(this.responseText);
      if (this.responseText == "Rotated") {
        var ttt = "?t=" + new Date().getTime();
        DATA[anum] = ssr + ttt;
        document.querySelector("#full-image").src = DATA[anum];
        if (nowsame == 1) {
          document.querySelector("body > div.images > img:nth-child(" + now + ")").src = DATA[anum];
          //document.querySelector("body > div.images > img:nth-child("+now+")").setAttribute('num',anum)        
        }
        //document.querySelector("#full-image").src =ssr;
      }
    }
    else {
      //cout('error');
    }
  };
  xhttp.open("POST", "http://" + link + ":15656/func.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //send rdir and deg
  xhttp.send("rdir=" + ssr + "&deg=" + deg);
}


function opens(nnn) {

  playstop();
  if (web) {
    cout("on web");
    return;
  }
  var ssr = document.querySelector("#full-image").getAttribute("src");
  cout(ssr);
  if (ssr.includes('?t=')) {
    ssr = ssr.replace('?t=', ':');
    ssr = /(.+):/.exec(ssr)[1];
  }
  while (ssr.includes('/')) {
    ssr = ssr.replace('/', '\\');
  }
  while (ssr.includes('%20')) {
    ssr = ssr.replace('%20', ' ');
  }
  cout(ssr);

  var nowsame = 0;//check if image changed

  if (document.querySelector("#full-image").src == document.querySelector("body > div.images > img:nth-child(" + now + ")").src) {
    nowsame = 1;//not changed
  }
  else {
    nowsame = 0;//changed
  }

  var anum = parseInt(document.querySelector("#full-image").getAttribute('num'));
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      //snackbar(this.responseText);
      if (nnn == 'e') {
        if (big == 1) {
          var ssr = DATA[anum];
          if (ssr.includes('?t=')) {
            ssr = ssr.replace('?t=', ':');
            ssr = /(.+):/.exec(ssr)[1];
          }
          var ttt = "?t=" + new Date().getTime();
          DATA[anum] = ssr + ttt;
          if (anum == parseInt(document.querySelector("#full-image").getAttribute('num'))) {
            document.querySelector("#full-image").src = DATA[anum];
          }
          if (nowsame == 1) {
            document.querySelector("body > div.images > img:nth-child(" + now + ")").src = DATA[anum];
            //document.querySelector("body > div.images > img:nth-child("+now+")").setAttribute('num',anum)        
          }
          snackbar('Image Refrshed');
        }
      }

    }
    else {
      //cout('error');
    }
  };

  xhttp.open("POST", "http://" + link + ":15656/func.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  if (nnn == 'e') {
    xhttp.send("edit=" + ssr);
  }
  else {
    xhttp.send("open=" + ssr);
  }
}

function refresh(a = 0) {
  if (web) {
    cout("on web");
    return;
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {

      if (a == 1) {//if no dir.js
        location.reload();
      }
      else {
        cout(this.responseText);
        snackbar('Data Refreshed');
      }
    }
  };
  xhttp.open("POST", "http://" + link + ":15656/func.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("refresh=90");
}
function saver() {
  if (web) {
    cout("on web");
    return;
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      cout(this.responseText);
      snackbar('Refreshed');
      {

      }
    }
  };
  xhttp.open("POST", "http://" + link + ":15656/func.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("dat=DATA=" + JSON.stringify(DATA.slice(1, 1000)) + ";");
}
function DeleteAll(data) {
  if (web) {
    cout("on web");
    //addoutdir();
    return;
  }
  if (JSON.parse(data).length == 0) {
    console.log('No Images to Delete');
    return;
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      console.log(this.responseText);
      if (this.responseText.includes("Deleted")) {
        clearoutdir();
      }
      else {
        cout('error');
      }
    }
  };

  xhttp.open("POST", "http://" + link + ":15656/func.php", true);

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("alddir=" + data);



}
function ReverseAll() {
  if (web) {
    cout("on web");
    //addoutdir();
    return;
  }
  var revlist = [];
  for (i = r1; i <= r2; i++) {
    var ssr = DATA[i];
    if (ssr.includes('?t=')) {
      ssr = ssr.replace('?t=', ':');
      ssr = /(.+):/.exec(ssr)[1];
    }
    revlist.push(ssr);
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      console.log(this.responseText);
      if (this.responseText.includes("Reversed")) {
        snackbar(this.responseText);
        imageRefresh(false);
        var ttt = "?t=" + new Date().getTime();
        for (i = r1; i <= r2; i++) {
          var ssr = DATA[i];
          if (ssr.includes('?t=')) {
            ssr = ssr.replace('?t=', ':');
            ssr = /(.+):/.exec(ssr)[1];
          }

          DATA[i] = ssr + ttt;
        }
      }
      else {
        snackbar('error');
      }
      unsetr1r2();
    }
  };

  xhttp.open("POST", "http://" + link + ":15656/func.php", true);

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("allrev=" + JSON.stringify(revlist));



}
function RotateAll(data) {
  if (web) {
    cout("on web");
    //addoutdir();
    return;
  }
  if (JSON.parse(data).length == 0) {
    console.log('No Images to Rotate');
    return;
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      console.log(this.responseText);

      if (this.responseText.includes("Rotated")) {
        clearoutrotatedir();
      }
      else {
        cout('error');
      }
    }
  };

  xhttp.open("POST", "http://" + link + ":15656/func.php", true);

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("allrdir=" + data);



}

var syncout = (limit = 172800000) => {
  if (!web) {
    console.log('checking out');
    if (localStorage.getItem('outtime') == null) {
      var iso = (new Date()).toISOString();
      localStorage.setItem('outtime', iso);
    }
    else {
      var timenow = new Date();
      var oldtime = new Date(localStorage.getItem('outtime'));
      if ((timenow - oldtime) > limit) {
        getoutdir();
        getoutrotatedir();
        localStorage.setItem('outtime', timenow.toISOString());
        snackbar('Synced');
        console.log('Synced');
      }
    }
  }
}
//syncout();

