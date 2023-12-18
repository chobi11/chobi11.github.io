
var rotatef = true;
//var outlink="https://glpy-api.herokuapp.com";
var outlink = "https://gdpy.onrender.com";
//var outlink='http://127.0.0.1:5000'
var gitlink = 'https://raw.githubusercontent.com/backup1122/galleryfiles/master/';
var token = localStorage.getItem('token');
var username = 'backup1122';
var repo = 'galleryfiles';
var dblist = [];
var del_blob_list = [];

function deleteFile(path) {
  console.log(path);

  // Fetch the current content and details of the file
  const getFileDetails = fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
    },
  })
    .then(response => response.json());

  getFileDetails
    .then(data => {
      // Delete the file on GitHub
      return fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Delete file',
          sha: data.sha,
        }),
      });
    })
    .then(response => {
      console.log(response.status);
      if (response.status === 200) {
        snackbar("Deleted");
      } else if (response.status === 401) {
        snackbar("Auth Error");
      } else if (response.status === 422) {
        snackbar("Not Found");
      }
    })
    .catch(error => {
      console.error('Error deleting file:', error);
    });
}

var addoutdir = (ssr) => {
  return fetch(outlink + "/adddeletedir", {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ dir: ssr }),
  })
    .then(response => {
      if (response.ok) {
        console.log('done');
      } else {
        console.error('Error adding directory:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error adding directory:', error);
    });
};

var deldeletedir = (ssr) => {
  return fetch(outlink + "/deldeletedir", {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ dir: ssr }),
  })
    .then(response => {
      if (response.ok) {
        console.log('done');
      } else {
        console.error('Error adding directory:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error adding directory:', error);
    });
};

function updateFile(path, updatedBlob) {
  // Fetch the current content and details of the file
  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      // Read the Blob content as a data URL
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64data = reader.result.split(',')[1];

        // Update the file on GitHub
        fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Update file',
            content: base64data,
            sha: data.sha,
          }),
        })
          .then(response => {
            console.log(response.status);
            if (response.status==200) {
              snackbar("Updated");
            }
            if (response.status==401) {
                snackbar("Auth Error");
            }
            if (response.status==422) {
                snackbar("Not Found");
            }
        })
          .then(updatedFile => {
            //snackbar("Updated");
            //console.log('File updated:', updatedFile);

          })
          .catch(error => {
            console.error('Error updating file:', error);
          });
      };

      reader.readAsDataURL(updatedBlob);
    })
    .catch(error => {
      console.error('Error fetching file details:', error);
    });
}

function rotateout(deg = 90) {

  if (rotatef) {
    rotatef = false;
    var src = document.querySelector("#full-image").getAttribute("src");
    var msrc = get_blob2src(src);
    if (msrc != "") {
      ssr = msrc;
    }
    else {
      ssr = src;
    }

    console.log(ssr);
    //rotatef = true;
    rotater(deg, ssr);
  }
}

var track_blob = (dd, ndd) => {
  var f = 0;
  blob_list.forEach(function (obj) {
    if (obj.ndir === dd) {
      f = 1;
      obj.ndir = ndd;
      dblist.forEach(function (obj2) {
        if (obj2.src === dd) {
          obj2.blob_url = ndd;
        }
      });
    }
  });
  if (f == 0) {
    //console.log(44);
    blob_list.push({ ndir: ndd, dir: dd });
  }
  console.log(blob_list);
}
var get_blob2src = (dd) => {
  var dr = "";
  blob_list.forEach(function (obj) {
    if (obj.ndir === dd) {
      //console.log(obj.dir);
      dr = obj.dir;
    }
  });
  return dr;
}

var track_del_blob = (dd, ndd) => {
  var f = 0;
  del_blob_list.forEach(function (obj) {
    if (obj.ndir === dd) {
      f = 1;
      obj.ndir = ndd;
    }
  });
  if (f == 0) {
    //console.log(44);
    blob_list.push({ ndir: ndd, dir: dd });
  }
  console.log(blob_list);
}
var get_del_blob2src = (dd) => {
  var dr = "";
  del_blob_list.forEach(function (obj) {
    if (obj.ndir === dd) {
      //console.log(obj.dir);
      dr = obj.dir;
    }
  });
  return dr;
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
    //upload(kkk.src.replace(gitlink,''),kkk.blob);
    Promise.all([upload(kkk.src.replace(gitlink,''),kkk.blob), deldeletedir(kkk.src.replace(gitlink,''))])
  .then(() => {
    console.log("Both operations completed successfully.");
  })
  .catch(err => {
    console.error("An error occurred:", err);
  });
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
          message: 'Restore',
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
var DeleteWeb = () => {
  var dell = 0;
  if (fulls == 1 && phone) {
    fullscreen();
  }
  //if (confirm("Are you sure")) {
    cout('y');
    var anum = parseInt(document.querySelector("#full-image").getAttribute("num"));
    var ssr = DATA[anum];
    var msrc = get_blob2src(ssr);
            if (msrc != "") {
                ssr = msrc;
            }
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

    path = ssr.replace(gitlink, '');
    Promise.all([deleteFile(path), addoutdir(path)])
  .then(() => {
    console.log("Both operations completed successfully.");
  })
  .catch(err => {
    console.error("An error occurred:", err);
  });
    

// Fetch the image as a Blob
fetch(ssr)
  .then(response => response.blob())
  .then(blob => {
    console.log(blob);

    const blobUrl = URL.createObjectURL(blob);
    console.log('Blob URL:', blobUrl);
      var b={src:ssr,blob:blob,blob_url:blobUrl,num:anum,now: now}
      dblist.push(b);
      

  })
  .catch(error => {
    console.error('Error fetching image:', error);
  });
    
}
var getoutdir = () => {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      cout(this.responseText);
      DeleteAll(this.responseText);
    }
  };
  xhttp.open("GET", outlink + "/getdeletedir", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.send();

}
var addouthold = () => {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      cout(JSON.parse(this.responseText).done);
      console.log(JSON.parse(this.responseText).done);
      snackbar(JSON.parse(this.responseText).done);

    }
  };
  xhttp.open("POST", outlink + "/addhold", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify({ hold: JSON.parse(localStorage.getItem('holdlself')) }));

}
var delouthold = (a) => {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      cout(JSON.parse(this.responseText).done);
      console.log(JSON.parse(this.responseText).done);
      snackbar(JSON.parse(this.responseText).done);

    }
  };
  xhttp.open("POST", outlink + "/delhold", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify({ hold: a }));

}
function containsObject(obj, list) {
  var res = _.find(list, function (val) { return _.isEqual(obj, val) });
  return (_.isObject(res)) ? true : false;
}
var getouthold = (flush = false) => {
  var holded = JSON.parse(localStorage.getItem('holdl'));
  if (holded == null) {
    holded = [];
    localStorage.setItem('holdl', JSON.stringify(holded));
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      breaker: {
        cout(this.responseText);
        if (flush) {
          localStorage.setItem('holdl', this.responseText);
          break breaker;
        }
        var res = JSON.parse(this.responseText);
        res.forEach(function (obj) {
          if (!(containsObject(obj, holded))) {
            console.log(obj.now);
            holded.push(obj);
          }
        });
        localStorage.setItem('holdl', JSON.stringify(holded));

        //DeleteAll(this.responseText);
      }
    }
  };
  xhttp.open("GET", outlink + "/gethold", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.send();

}

var getoutrotatedir = () => {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      cout(this.responseText);
      RotateAll(this.responseText);
    }
  };
  xhttp.open("GET", outlink + "/getrotatedir", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.send();

}
var clearoutdir = () => {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      cout(JSON.parse(this.responseText).done);

      console.log("Cleared delete list");
      //snackbar("Cleared");

    }
  };
  xhttp.open("GET", outlink + "/cleardelete", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.send();

}
var clearoutrotatedir = () => {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      cout(JSON.parse(this.responseText).done);

      console.log("Cleared rotate list");
      //snackbar("Cleared");

    }
  };
  xhttp.open("GET", outlink + "/clearrotate", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.send();

}
function rotateweb(srcBase64, degrees, callback) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.setAttribute('crossorigin', 'anonymous');

  image.onload = function () {
    image.setAttribute('crossorigin', 'anonymous');

    // Resize the image before rotating
    const resizedWidth = 800; // Adjust as needed
    const resizedHeight = (image.height / image.width) * resizedWidth;
    canvas.width = degrees % 180 === 0 ? resizedWidth : resizedHeight;
    canvas.height = degrees % 180 === 0 ? resizedHeight : resizedWidth;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.drawImage(image, -resizedWidth / 2, -resizedHeight / 2, resizedWidth, resizedHeight);

    // Specify image type and quality
    callback(canvas.toDataURL('image/jpeg', 0.8)); // Adjust quality as needed
  };

  image.src = srcBase64;
}

var rotater = (deg, src) => {
  rotatef = true;
  const imgr = document.querySelector("#full-image");
  var psrc = imgr.attributes.src.value;
  rotateweb(psrc, deg, function (resultBase64) {
    imgr.setAttribute('src', resultBase64);
    var nsrc = resultBase64;
    if (psrc == document.querySelector("body > div.images > img:nth-child(" + now + ")").src) {
      document.querySelector("body > div.images > img:nth-child(" + now + ")").src = resultBase64;
    }
    DATA[parseInt(imgr.getAttribute('num'))] = resultBase64;
    track_blob(psrc, nsrc);
    var path = src.replace(gitlink, '');
    var updatedBlob = dataURItoBlob(resultBase64);
    updateFile(path, updatedBlob);
  });
}

var dataURItoBlob = (dataURI) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs

  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: 'image/jpeg' });
  return blob;

}
