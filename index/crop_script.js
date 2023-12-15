
var gitlink=parent.gitlink;
var token = parent.token;
var username = parent.username;
var repo = parent.repo;
var blobtoDataURL = function (blob) {
    return new Promise((resolve, reject) => {
        var a = new FileReader();
        a.onload = function (e) {
            resolve(e.target.result);
        }
        a.readAsDataURL(blob);
    })
}

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
            /*if (response.status==200) {
              snackbar("Updated");
            }
            if (response.status==401) {
                snackbar("Auth Error");
            }
            if (response.status==422) {
                snackbar("Not Found");
            }*/
            parent.close_cropedit(response.status);
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

function t(e) {
    return e.complete && 0 !== e.naturalHeight && 0 !== e.naturalWidth && (function (t) {
        var e = document.getElementById("img-container");
        null === e && ((e = document.createElement("div")).id = "img-container", e.style.maxWidth = t.naturalWidth, e.style.maxHeight = t.naturalHeight, t.parentNode.appendChild(e), e.appendChild(t), function (e, t, n, o) {
            "insertRule" in e ? e.insertRule(t + "{" + n + "}", o) : "addRule" in e && e.addRule(t, n, o)
        }(function () {
            var e = document.createElement("style");
            return e.appendChild(document.createTextNode("")), document.head.appendChild(e), e.sheet
        }(), "header", "float: left"));
        var n = new Cropper(t, {
            highlight: !1,
            autoCropArea: 1,
            rotatable: !1,
            scalable: !1,
            viewMode: 2,
            zoomable: !1,
            dragMode: 'move',
            lineWidth: 9 ,

            ready: function () {
              n.crop();
              elCropBox = document.querySelector(".cropper-crop-box");
          
              if (null !== elCropBox) {
                  // Add double-click event listener
                  elCropBox.addEventListener("dblclick", function (e) {
                      n.getCroppedCanvas().toBlob(function (e) {
                          console.log(e);
          
                          var formData = new FormData();
                          formData.append('croppedImage', e);
          
                          if (imagesrc.includes('?t=')) {
                              imagesrc = imagesrc.replace('?t=', ':');
                              imagesrc = /(.+):/.exec(imagesrc)[1];
                          }
          
                          formData.append('src', imagesrc.replace('..', ''));
                          formData.append('form_key', window.FORM_KEY);
          
                          if (parent.web) {
                              // Display alert only for web (GitHub) saving
                              path = imagesrc.replace(gitlink, '');
                              parent.croppedImage = e;
                              updateFile(path, e);
                          } else {
                              // Handle non-web saving (local server)
                              $.ajax('http://'+(new URL(document.URL)).hostname+':15656/func.php', {
                                  method: "POST",
                                  data: formData,
                                  processData: false,
                                  contentType: false,
                                  success: function (data) {
                                      //console.log(data);
                                      parent.close_cropedit();
                                  },
                                  error: function (data) {
                                      console.log(data);
                                  }
                              });
                          }
                          //e = URL.createObjectURL(e);
                          //t.src = e, n.destroy()
                      }, 'image/jpeg');
                  });
          
                  // Hammer.js double-tap event
                  var hammer = new Hammer(elCropBox);
                  hammer.on('doubletap', function (event) {
                      // Call the double-click event listener
                      elCropBox.dispatchEvent(new Event("dblclick"));
                  });
              }
          }
          
        })
    }(e), 1)
}
//$(window).load(function(){
  var height;
  var width;
  if(parent.phone){
    var ratio = window.devicePixelRatio || 1;
width = (screen.availWidth * ratio)*.8;
height = (screen.availHeight * ratio)*.8;
  }
  else{
height = screen.availHeight * .8;
width = screen.availWidth * .8;
  }
document.querySelector("#crop-img").style.height = height + "px";

var imagesrc = parent.cropeditval.val;//localStorage.getItem("crop");
var imagebloburl = parent.cropeditval.blob_url;//localStorage.getItem("crop");
//console.log(imagesrc);
if(parent.web){
document.querySelector("#crop-img").src = (imagesrc==imagebloburl)?imagesrc:imagebloburl;
}
else{
document.querySelector("#crop-img").src = imagesrc;
}
/*
var randarr = JSON.parse(localStorage.getItem("croprand"));
var rand = randarr[randarr.length - 1];
*/

var e;
null !== (e = document.querySelector("#crop-img")) && (t(e) || (document.querySelector("#crop-img").onload = function () {
    t(e)
}))
    //});
