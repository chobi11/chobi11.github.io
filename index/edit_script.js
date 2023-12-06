
(function () {
  var gitlink='https://raw.githubusercontent.com/backup1122/galleryfiles/master/';
const token = localStorage.getItem('token');
const username = 'backup1122';
const repo = 'galleryfiles';
if(parent.phone){
  document.querySelector("#tools").style.zoom=2;
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

  "use strict";
  const [$, $$] = ABOUtils.DOM.selectors(),
  _cl = ABOUtils.Debug.log2;


  var imagesrc = parent.cropeditval.val;//localStorage.getItem("crop");
  var imagebloburl = parent.cropeditval.blob_url;//localStorage.getItem("crop");
  //console.log(imagesrc);
  if(parent.web){
src = (imagesrc==imagebloburl)?imagesrc:imagebloburl;
}
else{
src = imagesrc;
}
  //Global state model. Can be changed from within Vue or from the outside.
  const _svgState = {
    img: {
      //url: '..test/test3.jpg',
      url: src,
      //filename: 'test.jpg',
      //size: [600, 1200],
      size: [src.width, src.height],
      pos: [0, 0],
      rot: 0 },

    stroke: {
      width: 20,
      color: 'red' },

    doodles: [] },

  _editorState = {
    erasing: false,
    cleared: [] },

  _undoer = new UndoManager();

  let _svg, _zoomer,
  _currDoodle, _eraseState;


  Vue.component('doodle', {
    template: '<path :d="pathData" :stroke="dood.color" :stroke-width="dood.strokeWidth" :data-index="di" />',
    props: {
      dood: Object,
      di: Number },

    computed: {
      pathData() {return 'M' + this.dood.points;} },

    methods: {} });



  new Vue({
    el: '#app',
    data: {
      svg: _svgState,
      editor: _editorState,
      viewState: {
        showHelp: false } },


    computed: {},

    watch: {
      //If the stroke settings are changed, we probably want to stop erasing and draw a new doodle:
      //https://stackoverflow.com/questions/42133894/vue-js-how-to-properly-watch-for-nested-data
      'svg.stroke': {
        handler: function (val, oldVal) {this.editor.erasing = false;},
        deep: true } },


    methods: {
      rotate() {
        const img = this.svg.img;
        console.log('Rot', img.rot);

        //Rotate everything around the center of what's currently visible:
        const [left, top, width, height] = _zoomer.getViewBox(),
        center = [left + width / 2, top + height / 2];

        let allDoods = this.svg.doodles;
        //Also rotate the cleared doodles, in case the clearing is undone later:
        _editorState.cleared.forEach(doods => allDoods = allDoods.concat(doods));
        allDoods.forEach(d => {
          console.log(d);
          d.points = d.points.map(p => rotate90deg(p, center));
        });

        img.pos = rotate90deg(img.pos, center);
        img.rot = (img.rot + 1) % 4;
      },
      undo() {
        _undoer.undo();
      },
      clear() {
        const doods = this.svg.doodles;
        if (doods && doods.length) {
          const doIt = () => {
            this.editor.cleared.push(doods);
            this.svg.doodles = [];
          };

          doIt();
          _undoer.add({
            undo() {_svgState.doodles = _editorState.cleared.pop();},
            redo: doIt });

        }
      },
      download() {exportJPG();} } });




  function init() {
    _svg = $('#image svg');
    //_img = $('#image svg image');

    //Avoid hiding the toolbar behind the browser address bar on mobile:
    //https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    let prevH;
    function maxHeight() {
      const h = window.innerHeight;
      if (h !== prevH) {
        console.log('Max height', h);
        document.body.style.maxHeight = h + 'px';
        //Force the SVG zoomer to refresh its viewport.
        //This is needed when the UI changes its size without the browser resizing,
        //for example when the on-screen keyboard appears/disappears on mobile.
        window.dispatchEvent(new Event('resize'));

        prevH = h;
      }
    }
    maxHeight();
    setInterval(maxHeight, 1000);


    /* Image to draw on */
    function handleImage(result) {
      loadImg(result.url, function () {actuallyHandleImage(this, result.url, result.file);});
    }
    function actuallyHandleImage(img, url, file) {
      _svgState.img = {
        url: url,
        //filename: file.name,
        //https://stackoverflow.com/questions/16080273/doesnt-svg-support-auto-width-and-height-for-images
        size: [
        img.naturalWidth || img.width,
        img.naturalHeight || img.height],

        pos: [0, 0],
        rot: 0 };

      _cl('img-load', _svgState.img.size);
    }
    ABOUtils.DOM.dropImage(document, handleImage);
    ABOUtils.DOM.dropImage($('#image-input input'), handleImage);


    /* Stroke color */
    const pickerElm = $('#stroke-color'),
    picker = new Picker({
      parent: pickerElm,
      popup: 'bottom',
      onChange: color => {
        pickerElm.style.color = _svgState.stroke.color = color.rgbaString;
      } });

    picker.setColor('#f0ba');


    /* Zoom/pan */
    _zoomer = function initSvgZoom() {
      const imgContainer = $('#image'),
      zoomer = zoomableSvg('#app svg', {
        container: imgContainer });


      //Mouse interaction: Left-click draws a doodle, so we must pan with right-click
      let panStart, didPan;
      function isRightButton(e) {return e.buttons === 2 || e.which === 3;}
      imgContainer.addEventListener('mousedown', e => {
        if (!isRightButton(e)) {return;}
        panStart = [e.clientX, e.clientY];
        didPan = false;
      });
      imgContainer.addEventListener('mousemove', e => {
        if (!isRightButton(e)) {return;}
        const panPos = [e.clientX, e.clientY],
        panDiff = new zoomer.Coord(panPos[0] - panStart[0], panPos[1] - panStart[1]);

        zoomer.moveViewport(panDiff);

        panStart = panPos;
        if (panDiff.x || panDiff.y) {didPan = true;}
      });
      imgContainer.addEventListener('contextmenu', e => {
        if (didPan) {e.preventDefault();}
      });

      return zoomer;
    }();


    /* Draw doodles */
    (function initDraw() {

      let cancelledByClick = false;
      dragTracker({
        container: _svg,
        //propagateEvents: true,
        callbackDragStart: (_, pos) => {
          //Remove focus from toolbar:
          if (picker.domElement) {picker.closeHandler({ type: 'mousedown' });};
          document.activeElement.blur();

          if (_editorState.erasing) {
            eraseStart(pos);
          } else
          {
            doodleStart(pos);
          }
        },
        callback: (_, pos) => {
          if (_editorState.erasing) {
            eraseMove(pos);
          } else
          {
            doodleAppend(pos);
          }
        },
        callbackDragEnd: (_, pos, start, cancelled) => {
          //We do allow clicking to erase a single doodle:
          if (cancelledByClick && _editorState.erasing) {cancelled = false;}
          cancelledByClick = false;

          _eraseState = null;

          //Multi-touch (pinch-to-zoom)
          //Cancel current drawing or erasing session:
          if (cancelled) {
            console.log('Cancelled', cancelled);
            _undoer.undo();
          } else
          if (_editorState.erasing) {
          } else
          {
            doodleEnd(pos);
          }
        },
        callbackClick: () => {
          cancelledByClick = true;
          //TODO: Trigger a click on a random element to remove focus from the toolbar
          //https://gomakethings.com/how-to-simulate-a-click-event-with-javascript/
          //  $$1('header').click();
        } });

    })();
  }

  function getSvgPos(pos, doodle) {
    const coord = _zoomer.vp2vb({
      x: pos[0],
      y: pos[1] });


    return [coord.x, coord.y];
  }

  function doodleStart(pos) {
    const curr = _currDoodle = {
      color: _svgState.stroke.color,
      strokeWidth: _svgState.stroke.width,
      isErased: false };

    curr.points = [getSvgPos(pos, curr)];

    const doods = _svgState.doodles;
    doods.push(curr);
    _undoer.add({
      undo() {doods.pop();},
      redo() {doods.push(curr);} });

  }
  function doodleAppend(pos) {
    _currDoodle.points.push(getSvgPos(pos, _currDoodle));
  }
  function doodleEnd(pos) {
    const curr = _currDoodle;
    //http://mourner.github.io/simplify-js/
    const ptsXY = curr.points.map(p => ({ x: p[0], y: p[1] })),
    ptsSimpl = simplify(ptsXY, Math.sqrt(curr.strokeWidth / 2)).map(p => [p.x, p.y]);

    curr.points = ptsSimpl;
    _cl('simplified', ptsXY.length, curr.points.length);
  }

  function erasePoint(pos) {
    const svgPos = _svg.getBoundingClientRect(),
    x = pos[0] + svgPos.left,
    y = pos[1] + svgPos.top;

    //https://stackoverflow.com/questions/3918842/how-to-find-out-the-actual-event-target-of-touchmove-javascript-event
    const currHover = document.elementFromPoint(x, y);
    if (currHover && currHover.nodeName === 'path') {
      const i = currHover.dataset.index,
      dood = _svgState.doodles[i];
      if (dood) {
        dood.isErased = true;
        _eraseState.erased.push(dood);
      }
    }
  }
  function eraseStart(pos) {
    const state = _eraseState = {
      prevPos: pos,
      erased: [] };

    _undoer.add({
      undo() {state.erased.forEach(d => d.isErased = false);},
      redo() {state.erased.forEach(d => d.isErased = true);} });

    erasePoint(pos);
  }
  function eraseMove(pos) {
    const [x0, y0] = _eraseState.prevPos.map(Math.round),
    [x1, y1] = pos.map(Math.round);
    _eraseState.prevPos = pos;

    //Use Bresenham's line algorithm to check all screen pixels we moved across since the last time.
    //If we don't do this, it's easy to skip doodles when erasing fast:
    //http://members.chello.at/easyfilter/bresenham.html
    const dx = Math.abs(x1 - x0),
    dy = -Math.abs(y1 - y0),
    sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;

    let [x, y] = [x0, y0],
    err = dx + dy,
    e2;
    for (;;) {
      erasePoint([x, y]);

      if (x === x1 && y === y1) {break;}
      e2 = 2 * err;
      if (e2 >= dy) {err += dy;x += sx;}
      if (e2 <= dx) {err += dx;y += sy;}
    }
  }

  function rotate90deg(point, center) {
    const [cx, cy] = center,
    dx = cy - point[1],
    dy = point[0] - cx;

    const newPoint = [cx + dx, cy + dy];
    return newPoint;
  }

  //Export JPG:
  function exportJPG() {
    _cl('export');

    const [xMin, yMin, w, h] = findViewBox();
    _cl('..svg-vb', xMin, yMin, w, h);

    /* Serialize the SVG and create a URL for it */

    const tmpSvg = _svg.cloneNode(true);
    tmpSvg.setAttribute('viewBox', '' + [xMin, yMin, w, h]);
    tmpSvg.setAttribute('width', w);
    tmpSvg.setAttribute('height', h);

    //The SVG's embedded source image doesn't transfer to 'img',
    //so we must paint the canvas in two steps
    const svgImg = tmpSvg.querySelector('image');
    svgImg.parentNode.removeChild(svgImg);

    const serializer = new XMLSerializer(),
    svgCode = serializer.serializeToString(tmpSvg),
    svgBlob = new Blob([svgCode], { type: 'image/svg+xml' }),
    svgUrl = URL.createObjectURL(svgBlob);
    _cl('..svg-blob', /*svgCode,*/svgUrl);

    /* Create a blank canvas, and paint the SVG on it */

    const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    //https://stackoverflow.com/questions/27736288/how-to-fill-the-whole-canvas-with-specific-color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);

    function handleImg() {
      const img = this;
      _cl('..loaded', img.src);

      //The SVG's embedded source image doesn't transfer to 'img',
      //so we must paint the canvas in two steps.
      //In the first step, where we only paint the source image,
      //we must place it correctly within the viewBox we found above:
      const step0 = img.src !== svgUrl;
      if (step0) {
        //If the drawing has been rotated, we must calculate the correct position for the image
        const state = _svgState.img,
        x = state.pos[0] - xMin,
        y = state.pos[1] - yMin;

        //https://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
        ctx.translate(x, y);
        ctx.rotate(state.rot * Math.PI / 2);
        ctx.drawImage(img, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        //We have painted the source image.
        //Now load and paint the doodles on top of that:
        loadImg(svgUrl, handleImg);
      } else
      {
        //Paint the doodles..
        ctx.drawImage(img, 0, 0);

        //..and export the JPG
        const quality = .9; //JPG at 90% quality
        //name = _svgState.img.filename;
        canvas.toBlob(function (e) {
          console.log(e);

          var formData = new FormData();

          formData.append('croppedImage', e);
          var imagesrc = parent.cropeditval.val;
          if (imagesrc.includes('?t=')) {
            imagesrc = imagesrc.replace('?t=', ':');
            imagesrc = /(.+):/.exec(imagesrc)[1];
        }
          
          formData.append('src', imagesrc.replace('..', ''));
          formData.append('form_key', window.FORM_KEY);
          
          if(parent.web){
          path = imagesrc.replace(gitlink, '');
          parent.croppedImage = e;
          updateFile(path, e);
          }

else{
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
              console.log(this.responseText);
              console.log('done');
              parent.close_cropedit();
            }
          };
        
          xhttp.open("POST", "http://"+(new URL(document.URL)).hostname+":15656/func.php", true);
        
          //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send(formData);
        }
          /*$.ajax('http://localhost:15656/func.php', {
              method: "POST",
              data: formData,
              processData: false,
              contentType: false,
              success: function (data) {
                  //console.log(data);
                  //parent.close_crop();
              },
              error: function (data) {
                  console.log(data);
              }
          });*/

          //e = URL.createObjectURL(e);
          //t.src = e, n.destroy()
      }, 'image/jpeg', quality);
      }
    }
    //The SVG's embedded source image doesn't transfer to 'img',
    //so we must paint the canvas in two steps
    loadImg(_svgState.img.url /*svgUrl*/, handleImg);

    //document.body.appendChild(tmpSvg);
    //document.body.appendChild(img);
    //document.body.appendChild(canvas);
  }

  function findViewBox() {
    const extent = $('#container').getBBox();
    return [extent.x, extent.y, extent.width, extent.height].map(Math.round);
  }

  function loadImg(url, callback) {
    const img = new Image();
    //Avoids error "Failed to execute 'toBlob' on 'HTMLCanvasElement': Tainted canvases may not be exported."
    //https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
    img.crossOrigin = "Anonymous";

    //https://stackoverflow.com/questions/28545619/javascript-which-parameters-are-there-for-the-onerror-event-with-image-objects
    img.onerror = function (e) {
      alert(`ERROR loading image (${url}): ${e.message}`);
    };
    img.onload = callback;

    img.src = url;
  }
/*
  function downloadBlob(blob, filename) {
    _cl('download');

    const url = typeof blob === 'string' ? blob : URL.createObjectURL(blob),
    link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';

    document.body.appendChild(link);
    _cl('..click');
    link.click();
    document.body.removeChild(link);

    //Edge needs a little time before the blob goes away..
    if (url !== blob) {setTimeout(() => URL.revokeObjectURL(url), 1000);}
  }

*/
  window.addEventListener('load', init);


})();