
var gitlink='https://raw.githubusercontent.com/backup1122/galleryfiles/master/';
const token = localStorage.getItem('token');
const username = 'backup1122';
const repo = 'galleryfiles';
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
      .then(response => response.json())
      .then(updatedFile => {
        console.log('File updated:', updatedFile);
        parent.close_cropedit();
        
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
                              alert('Image will be saved to GitHub');
                              path = imagesrc.replace(gitlink, '');
                              parent.croppedImage = e;
                              updateFile(path, e);
                          } else {
                              // Handle non-web saving (local server)
                              $.ajax('http://localhost:15656/func.php', {
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
var height = screen.availHeight * .8;
var width = screen.availWidth * .8;
document.querySelector("#crop-img").style.height = height + "px";

var imagesrc = parent.cropeditval.val;//localStorage.getItem("crop");
//console.log(imagesrc);
document.querySelector("#crop-img").src = imagesrc;
/*
var randarr = JSON.parse(localStorage.getItem("croprand"));
var rand = randarr[randarr.length - 1];
*/

var e;
null !== (e = document.querySelector("#crop-img")) && (t(e) || (document.querySelector("#crop-img").onload = function () {
    t(e)
}))
    //});
