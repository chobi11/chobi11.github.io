
var rotatef = true;
//var outlink="https://glpy-api.herokuapp.com";
var outlink="https://gdpy.onrender.com";
//var outlink='http://127.0.0.1:5000'
var gitlink='https://raw.githubusercontent.com/backup1122/galleryfiles/master/';
const token = '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';
const username = 'backup1122';
const repo = 'galleryfiles';

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
      .then(response => response.json())
      .then(updatedFile => {
        console.log('File updated:', updatedFile);
        
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
    var msrc = get_rt(src);
    if (msrc != "") {
      ssr = msrc;
    }
    else {
      ssr = src;
    }

    console.log(ssr);
    //rotatef = true;
    rotater(deg,ssr);
  }
}

var track_rotate = (dd, ndd) => {
  var f = 0;
  rlist.forEach(function (obj) {
    if (obj.ndir === dd) {
      f = 1;
      obj.ndir = ndd;
    }
  });
  if (f == 0) {
    //console.log(44);
    rlist.push({ ndir: ndd, dir: dd });
  }
  console.log(rlist);
}
var get_rt = (dd) => {
  var dr = "";
  rlist.forEach(function (obj) {
    if (obj.ndir === dd) {
      //console.log(obj.dir);
      dr = obj.dir;
    }
  });
  return dr;
}
var addoutdir = () => {

  var dell = 0;
  if (fulls == 1 && phone) {
    fullscreen();
  }
  if (confirm("Are you sure")) {
    cout('y');
    var ssr = $("#full-image").attr("src");;
    cout(ssr);
    if (ssr.includes('?t=')) {
      ssr = ssr.replace('?t=', ':');
      ssr = /(.+):/.exec(ssr)[1];
    }
    if (document.querySelector("#full-image").src == document.querySelector("body > div.images > img:nth-child(" + now + ")").src) {
      dell = 1;
    }
    else {
      dell = 0;
    }
    cout(dell);
    const username = 'YOUR_GITHUB_USERNAME';
const repo = 'YOUR_REPO_NAME';
const filePath = 'path/to/your/file.json';
const branch = 'main'; // Replace with the branch name if not using the default branch

const url = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}?ref=${branch}`;

// Step 1: Read the existing JSON file
fetch(url, {
  headers: {
    Authorization: `token ${token}`, // Include this line for private repositories
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Step 2: Parse the JSON content
    const contentBase64 = data.content;
    const content = atob(contentBase64);
    const jsonData = JSON.parse(content);

    // Step 3: Modify the parsed data
    jsonData.push(4); // Append 4 to the array

    // Step 4: Update the file with the modified data
    const updatedContent = JSON.stringify(jsonData, null, 2); // Convert data back to JSON
    const updatedContentBase64 = btoa(updatedContent); // Encode content to base64

    // Create a new branch or use an existing one
    const newBranchName = 'update-json-file-branch';

    // Create a new commit with the updated content
    return fetch(`https://api.github.com/repos/${username}/${repo}/git/refs/heads/${newBranchName}`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`, // Include this line for private repositories
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${newBranchName}`,
        sha: data.sha,
      }),
    });
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log('File updated successfully!');
  })
  .catch(error => {
    console.error('Error updating JSON file:', error.message);
  });

    /*var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
        cout(JSON.parse(this.responseText).done);
        snackbar(JSON.parse(this.responseText).done);
        var anum = parseInt(document.querySelector("#full-image").getAttribute("num"));
        DATA.splice(anum, 1);
        document.querySelector("#full-image").src = DATA[anum];
        if (dell == 1) {
          document.querySelector("body > div.images > img:nth-child(" + now + ")").src = DATA[anum];
          //document.querySelector("body > div.images > img:nth-child("+now+")").setAttribute('num',anum)        
        }
        if (document.querySelector("#full-image").getAttribute('num') < document.querySelector("body > div.images > img:nth-child(" + now + ")").getAttribute('num')) {
          document.querySelector("body > div.images > img:nth-child(" + now + ")").setAttribute('num', (document.querySelector("body > div.images > img:nth-child(" + now + ")").getAttribute('num') - 1));
        }

      }
    };
    xhttp.open("POST", outlink+"/adddeletedir", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.send(JSON.stringify({ dir: ssr }));*/
  }
  else {
    cout('n');
  }
}
var getoutdir = () => {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      cout(this.responseText);
      DeleteAll(this.responseText);
    }
  };
  xhttp.open("GET", outlink+"/getdeletedir", true);
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
    xhttp.open("POST", outlink+"/addhold", true);
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
    xhttp.open("POST", outlink+"/delhold", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.send(JSON.stringify({ hold: a }));
  
}
function containsObject(obj, list) {
  var res = _.find(list, function(val){ return _.isEqual(obj, val)});
  return (_.isObject(res))? true:false;
 }
var getouthold = (flush=false) => {
  var holded=JSON.parse(localStorage.getItem('holdl'));
  if(holded==null){
    holded=[];
    localStorage.setItem('holdl',JSON.stringify(holded));
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
      breaker: {
      cout(this.responseText);
      if(flush){
        localStorage.setItem('holdl',this.responseText);
        break breaker;
      }
      var res=JSON.parse(this.responseText);
      res.forEach(function (obj) {
        if(!(containsObject(obj,holded))){
          console.log(obj.now);
        holded.push(obj);
        }
      });
      localStorage.setItem('holdl',JSON.stringify(holded));

      //DeleteAll(this.responseText);
    }
  }
  };
  xhttp.open("GET", outlink+"/gethold", true);
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
  xhttp.open("GET", outlink+"/getrotatedir", true);
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
  xhttp.open("GET", outlink+"/cleardelete", true);
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
  xhttp.open("GET", outlink+"/clearrotate", true);
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
    canvas.width = degrees % 180 === 0 ? image.width : image.height;
    canvas.height = degrees % 180 === 0 ? image.height : image.width;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.drawImage(image, image.width / -2, image.height / -2);

    callback(canvas.toDataURL());
  };

  image.src = srcBase64;
}
var rotater = (deg,src) => {
  rotatef = true;
  const imgr = document.querySelector("#full-image");
  var psrc = imgr.attributes.src.value;
  rotateweb(imgr.attributes.src.value, deg, function (resultBase64) {
    imgr.setAttribute('src', resultBase64);
    var nsrc = resultBase64;
    if (psrc == document.querySelector("body > div.images > img:nth-child(" + now + ")").src) {
      document.querySelector("body > div.images > img:nth-child(" + now + ")").src=resultBase64;
    }
    DATA[parseInt(imgr.getAttribute('num'))] = resultBase64;
    track_rotate(psrc, nsrc);
    var path=src.replace(gitlink,'');
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
  var blob = new Blob([ab], {type: 'image/jpeg'});
  return blob;

}
