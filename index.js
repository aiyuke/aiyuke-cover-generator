var Draw = (function () {
    function Draw() {
        var _this = this;
        this.OVERLAY_OFFSET_Y = 180;
        this.RATIO = 600 / 388;
        this.RATE = 1;
        this.WIDTH = 600;
        this.HEIGHT = 388;
        this.ORIGIN_IMG_WIDTH = 600;
        this.fontSize = 60;
        this.selectedWidth = 0;
        this.curOffset = 185;
        this.img = document.querySelector('img');
        this.originImg = document.querySelector('.origin-img img');
        this.input = document.querySelector('#input');
        this.undoButton = document.querySelector('#undo');
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.upBtn = document.querySelector('#up');
        this.downBtn = document.querySelector('#down');
        this.file = document.querySelector('input[type=file]');
        this.isDark = document.querySelector('#is-dark');
        this.isWatermark = document.querySelector('#is-add-watermark');
        this.isOverlay = document.querySelector('#is-add-overlay');
        this.cropper = document.querySelector('.cropper');
        this.handlers = document.querySelectorAll('.cropper div');
        this.selected = document.querySelector('.selected');
        this.downloadBtn = document.getElementById('download');
        this.fontInput = document.querySelector('#font');
        this.isPing = document.querySelector('#is-ping');
        this.mousePosition = { x: 0, y: 0, isDown: false };
        this.offset = [0, 0];
        this.originImageRatio = 1;
        this.watermark = new Image;
        this.watermarkPing = new Image;
        this.overlay = new Image;
        this.overlayDark = new Image;
        this.overlayPing = new Image;
        this.input.addEventListener('keyup', function () {
            _this.draw();
        });
        this.isDark.addEventListener('change', function () {
            _this.draw();
        });
        this.isWatermark.addEventListener('change', function () {
            _this.draw();
        });
        this.isOverlay.addEventListener('change', function (e) {
            _this.draw();
        });
        this.originImg.addEventListener('load', function () {
            var _a = _this.originImg, naturalWidth = _a.naturalWidth, naturalHeight = _a.naturalHeight;
            _this.originImageRatio = naturalWidth / _this.ORIGIN_IMG_WIDTH;
            var height = _this.originImageRatio / naturalHeight;
            _this.selectedWidth = _this.ORIGIN_IMG_WIDTH;
            _this.cropper.style.width = _this.ORIGIN_IMG_WIDTH + 'px';
            _this.cropper.style.height = height + 'px';
            document.querySelector('.origin-img > div').style.width = _this.ORIGIN_IMG_WIDTH + 'px';
            document.querySelector('.origin-img > div').style.height = height + 'px';
            _this.selected.style.width = _this.ORIGIN_IMG_WIDTH + 'px';
            _this.selected.style.height = (_this.ORIGIN_IMG_WIDTH / _this.RATIO) + 'px';
            document.querySelector('.origin-img').style.display = 'block';
            _this.draw();
        });
        this.upBtn.addEventListener('click', function () {
            _this.curOffset += 5;
            _this.draw();
        });
        this.downBtn.addEventListener('click', function () {
            _this.curOffset -= 5;
            _this.draw();
        });
        this.selected.addEventListener('mousedown', function (e) {
            _this.dragStartX = e.clientX;
            _this.dragStartY = e.clientY;
            _this.mousePosition.isDown = true;
            _this.offset = [
                _this.selected.offsetLeft - e.clientX,
                _this.selected.offsetTop - e.clientY
            ];
            console.log('123', _this.offset);
        }, true);
        this.selected.addEventListener('mouseup', function (e) {
            _this.mousePosition.isDown = false;
        }, true);
        this.selected.addEventListener('mousemove', function (e) {
            e.preventDefault();
            if (_this.mousePosition.isDown) {
                _this.mousePosition = {
                    x: e.clientX,
                    y: e.clientY,
                    isDown: true
                };
                var left = _this.mousePosition.x + _this.offset[0];
                var top_1 = _this.mousePosition.y + _this.offset[1];
                // if (
                //     left >= 0 && left <= this.ORIGIN_IMG_WIDTH - this.selectedWidth
                //     && top >= 0 && top <= this.originImg.offsetHeight - this.selected.offsetHeight
                // ) {
                _this.selected.style.left = left + 'px';
                _this.selected.style.top = top_1 + 'px';
                _this.draw();
                // }
            }
        }, true);
        this.file.addEventListener('change', function () {
            _this.handleFile();
        });
        document.addEventListener('keydown', function (e) {
            var top, left;
            var topMax = _this.originImg.height;
            var leftMax = _this.originImg.width;
            switch (e.keyCode) {
                case 38:
                    e.preventDefault();
                    _this.selectedWidth += 5;
                    _this.selected.style.width = _this.selectedWidth + 'px';
                    _this.selected.style.height = _this.selectedWidth / _this.RATIO + 'px';
                    break;
                case 40:
                    e.preventDefault();
                    _this.selectedWidth -= 5;
                    _this.selected.style.width = _this.selectedWidth + 'px';
                    _this.selected.style.height = (_this.selectedWidth / _this.RATIO) + 'px';
                    break;
            }
            if ([38, 39, 37, 40].indexOf(e.keyCode) > -1) {
                _this.draw();
            }
        });
        document.addEventListener('paste', function (e) {
            console.log(e);
            var items = e.clipboardData.items;
            console.log(JSON.stringify(items));
            for (var index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        _this.originImg.src = event.target.result;
                    };
                    reader.readAsDataURL(blob);
                }
            }
        });
        this.downloadBtn.addEventListener('click', function (e) {
            var a = document.createElement('a');
            a.href = _this.canvas.toDataURL('image/jpeg');
            a.setAttribute('download', 'cover_img.jpg');
            document.body.appendChild(a);
            a.click();
        });
        document.querySelector('#download-2').addEventListener('click', function (e) {
            var a = document.createElement('a');
            a.href = _this.canvas.toDataURL();
            a.setAttribute('download', 'cover_img.png');
            document.body.appendChild(a);
            a.click();
        });
        this.fontInput.addEventListener('change', function (e) {
            if (!isNaN(_this.fontInput.value)) {
                _this.fontSize = _this.fontInput.value;
                _this.draw();
            }
        });
        this.isPing.addEventListener('change', function (e) {
            _this.draw();
        });
        this.watermark.src = "data:img/jpg;base64,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";
        this.watermarkPing.src = 'data:img/jpg;base64,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';
        this.overlay.src = 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAByCAYAAACPzq+lAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAUPUlEQVR42u3df0zUd57H8TfKrxnEgdEROuKvHVq3K1hlYXB7oF/SO7TnAZvSbL0Eku5x9dY9aC/sJtTdSJTupWe25Q8x201b9jY3zZ12z6RO47XFNMyW3hWQqu1iu9GZxR8wVaaCs8oM4OjcH/Cl4whi5UPZ7T4fiX84853v9/MdTeaVz+f9eX9jBACAuVUuIivnehCASvPmegAAgL9o9wvhCl9DBCwAwFyJE5GCuR4EMBsIWACAubJORMxzPQhgNhCwAABzYaGI5M/1IIDZQsACAMyFh0UkYa4HAcwWAhYA4KtmFZE1cz0IYDYRsAAAX7XCuR7A111VVRW1bXMsZq4HAAD4i/KgiPztXA/iXtTX11stFothuuNSUlIMDzzwgDXytUuXLg2WlpYe+yrG2dTUZKuurt7hdru77r///gNz9X1NRdM0Q3l5uVVEZMWKFea0tLTU/Pz8li97nnA4/EJnZ2fLkSNHuh9//PG8tWvXHp7re4tEwAIAfFUSRaRCREwzOckD6+0p5U/vLEwyp6X+0fdZv+ejzvMnevqv/yHh/pWSsswq5pQFyVd7e4OHnj8a8p0PqBp8f3//DovFYrvXz8fExPxYZCwYTHVMZ2dny6pVq2xTXcfn83mWLFny0p2uo2ma4Y033thhMpms+/fvf6mmpsZzp+NVjcfpdOalpaWlioiYzWazyWRK1Y9LSkoyG43G1KmuU1RUtMvlcgUjzxE1Dk/0fegBy2AwGLKzswv9fr/3Rz/60a+bm5sHZvrv1dnZ2XIvoS9S7Ew+DADAl/BtmWG4EhFZ8a21i76RlZM1L9lsXrh4yWeJcfPjby7xjdy4YV197kbKcpH5MmpcsHD+4mUfqAxY77zzTpvJZOp69NFHy4aGhgYcDsdhEZFNmzZlZWdnF7rd7q633377mB4EOjo6inNycjYeOHDgQGVlZbd+ns7Oztt+uM1mszkzMzNXRKS9vb0rLS3ttlBkt9uLI/9+p2Ckq66u3lFdXT3pe3rgUzWetLS01MjXfD6fR0QkPj7eYDQaU91ud9fAwMCAiMjp06e9V65cCYqInDx5ctDlcgVFRDZs2JA7RShqEZFJg+LatWsPO51Ob0lJyROapln1gHWn7/tOou/rXhGwAABfBbOI5M70JIak5PlaeVVewqLliwIBv1gXJqQXFH475fvGuLAvGJPY9dk1ee3UFfm/C6HUuHVb18jvP/BJ+GZYxQ3oIam/vz/XYrHYVqxYYS4tLT2maZr3yJEjWStXrszy+XzviYwtJ9rt9uJAIDDY3Nx8SzCoq6trq62tzYpcMhxf1ssVESktLT3mdDrzDh8+7IkMC+Fw+LYffp/P5+np6fGIiOgzTZFBZjLRM1KqxjM+43NbmNGXLCPD51T02TD9M/oMnNPpzOvv798RfXxWVlZef3+/TUTE7/d7N2/eXOh0Og2R9xI9E6VpmkEPdJOZ7Hu+FwQsAMBX4WFR8JuzbtPmJUu/tW7NwOUTkm1cIHlLl8xLNhmMEhMvK0Ukb+USeXL9NWn47YV5/yYF2fPM1o6bl3uVzGJ1dHQUi4hcvHjRa7FYbBs3bizs6OhIFREZGBjwZmRkrKmsrNy4devWgVWrVtn01/fu3Vso8sUP/d69ewvtdntxa2trYlFRUVv0derr660lJSVPrF+//lRzc/O/32lMPT09nvz8/Jb6+nrrrl27NoqIfPrpp55z585NGrB8Pl9w69atEhmwVI5nLo2Ojk4ami5cuPB9t9vt1u/t9ddffzI+Pt6QkpLSGHnc0NDQTz0eT/fdXOtuELAAALNtuYisVnGiNFty+tnzLydm3OyX72T+ixhSbl9xNCQukOc3Z8pvw2aL97+WZZy73HtaxbWjl45MJpPVbrffUsyuL6vpMjIy1mRkZOgtKVpExmaMjhw5kldQULC5qqrqVPSSVkNDg/epp546lZGRscbhcGRFLi9G6uzsbOns7PSMh6sfxsbGJoqIlJSUPDHVPfh8Ps/BgwdvmWlSNZ5IVVVV5nXr1qWKiGRlZVlFRLZs2ZLX0dFhs1qtSxMSEhJFvqjNmq7mqbS09FhVVVX0DNoL3d3dx6arlUpISEjU701ExGKx2Hp7e09dv379Z++///47RUVFbQ6HI8toNKaePXvWm52dPZP/JhNo0wAAmG1K2jKkpscZY83OtQNnfx6Tn7FBDCmL73B0nPzkr9IM/2Rb8WiZyH2qbqSzs7MlJibmx/oft9vd5fP5PJGvRf+JrgFyuVzBd999tyU2NjZx9+7dZZNdZ/fu3YdFRB577LGyqcaSn5/fkpKSYti1a9cP9dfcbndXUVHRrsjr79+//6VQKDQsMlZPVVNT44kMJarG09HRURwOh18Ih8MvvPrqqz8Zr//aoWlamchY+LTb7cXJyckTRexer9ejB8U7fe8OhyPr1Vdf/Yk+i6jTZwpFRD7++OOyM2fObNM07Zadnjt37jyo39szzzxTqN/P4OBgX0FBwWZN0wybN28uDIVCw42NjcxgAQD+LGSLSPpMT2JYEBv3N/9w35YE8/msJQv+Wpbdt2naz3w7WSRh9bJlD78rZXHzY99sD4Uv94ZuDN/L9auqqsx60XZTU5NNZKwdQ2ZmZq7P5/Por03F5/N56uvrrQ0NDV6RsRmZ/v7+XLPZbI0OBCIizc3NA88880xbdnZ24VSzRh0dHcV2u73Y7/d7GxsbDxQVFdk0TSt74403rA6H4/DJkycHn3322eLMzMzcUCg0/Nprr/16qtknFeMZD0ktIiKBQCDY3d3tFRmbwdI0rexudjTq96T/XS/S379//0t+v99rt9uL6+vru/Xv0WKx2KqqqsxlZWU2fSehzWa7pcaqubl5YPv27S12u704PT192OfzeZqbmwfWrVvXUl1dvUPfcdnZ2dlyp9qsL4uABQCYLUYZq72asS1PLS+674G4h6+OLJJFC78psfMSp/1Mkohkhq9K3DzJ/OlCw+Mf3pz3yT9+7j96L9ffvn17rsVisVksFpvdbr/lPYvFYquurt4x3Tmqq6vLGhoaJlos7Ny586DH4wnW1tZmTXb8008/3VJeXt4tInLmzJlt0e9funRp0Ofzeb73ve/92uVyBRsaGrwOh2OwoqLiycjx9Pb2ntq9e/fh6KW/aDMdz3h4ui1ANTU1iaZpd/U96yFN38WoF+yfPHly0OfzHdizZ09tbW3ttoaGhon6qeeff/4Ji8Vi8/v93u9+97svTRaS6urq2o4ePboxNjY2cXyJVGpqajxbtmzp0gNoXV1d210N8i4RsAAAs8UuIgtUnGjZN5Nyw+ERSYwzyNLFi+VG6Oa0nwneCEl8v1diwyJpcXHLVodjrt3r9V9++eWuyGWsFStWmEtKSp6IqGmals/nu+2H//XXX3/SYrHYAoHA4GSf0VtATPaeXpdUXl5u3bt3r81qtS5NT0+fmEkLBAKDRqMxNSMjY82LL76Y+uyzz3oHBgYGImeXomeUZjKeuxFdm2U0Gg0iY0t97e3tXeO7/zz6LsbonYdbt25tWbVqla2+vn6i9m26cBXNbrfbZDwItre3d2dmZuYODQ0NqJy9EiFgAQBmx2IRyVF1soFLwXMLrWI2Jy+SjCVGCYz0S/jKMjGlTH78NRG59skpif/wpITmS+jEzfCH7SPXz9zr9cdnfyZmgC5cuLBRRGRkZGR4/Ad7StFNMjVNM+g790REfve737V99NFHnoqKiif1YxwOR9Zjjz1WZjQaU/UlwD179tTq70/WRDMUCg2fPXu2+9NPP/U0NjZ2u1yuYFNTk23Tpk1Z6enp1sgCfE3TxO12d4mIR8V4qqqqzJqmWfUO9gaDwZCenm4VGStkFxlb7pvqO9KXX6eTn5/f0traWqjXnfl8Po/FYrGdP3/ec6eAtG/fvuLY2NjEUCg0nJOTs1HTtDaXyxUsKSkpFhnbsOB0OvNUdtsnYAEAZkOBKHxayP/+98WjBRWLFi1dvHB5fMKIBG+clGufmyQcu1AWLvhix1ZYxsJV/7BIuH6/zD9zXrqSjMdqP7/6lud6SEm7BqfTmafvDMzIyFij74iLlpqaunR8Z99Ek8zIoBIIBAZ/9atfHaipqZmo4TIYDIbI8BS5u27Pnj0T525vb+9av379sNfr7bNarUuHh4eDeu+rtLS0VL01hIhIMBgM9vT0eHp6ejxms9n89ttvHxMROXTokFfVeLZv354bWTsVCoWGBwcH+0REhoaGBvRGo5EtJA4dOuTVQ9F0valExkKcvhwYCAQGY2NjE3t6ejwjIyPD47Vhnslqw+rr663Z2dmFvb29p1wu17GKioon9+3bV3z58uUBvfYqJydn4yOPPFKsaRpF7gCAP1mrROSeHykzmZ6Pr/Xf+M/rv1m0fVH5TUlcOZpwWmKunJfBC4+If/E3xWAQiYkRGYkTGXJ/LvN+3igL214VT5Z88s+/Hzlyr8Xt0fSeUKFQaPj48ePv2e324vj4eEP08tTHH39cpi9dRdb2PPTQQza9LUFdXV1bdKgIBoPB+Ph4gz5LpBdzRxufaTkmMjabFdEKYlo1NTUTzyfct2+fkvHU1dW1lZeXeyYrYr+bRqMOh2NbcnJyanRvKl1ra2thQUHB5tjY2ES329311FNPHW5tbX1OZGxH4C9/+Uvbtm3btp05c+YX0WOsra3dFgqFhvU6tM2bN3tsNlvWgw8+aPD7/d78/PwWp9M5WFJS8kRkMJ0pAhYAQKX5oqgtQ7TzJ0c+O/HWlbfCf2esGo2fF58Yc0QWXfyFDP3x7+WqaaPEJMZIjN8jyYdeE8Pn70rsXrn54em4T3q7rysJVw6HI2vbtm3bQqHQ8HPPPfeLhoYGb0dHh9jt9uKjR4/+9K233jp87ty5gcrKyjKTyWSNLEDXz/H000+3bNy48dhUQUVE5G5riSLdzTMKJ1tWVDUel8sVdLlcd7XMN5nk5OTUuLg4g/5A7U2bNmWJiFRWVpZVVlbK1atXB0VE3nzzzYPRy3jNzc0DmqYdqKioeHLXrl0/zM3NPRx5TFJSkvn48ePv6UX+O3fuPKjvrmxsbDwgMhZYh4aGlHRw1xGwAAAqrRURy2yd/Ph7n537/KKvP8WakTFqKpCF107Iff27ZHQgXkYTjRITvCLzc0XkUZGAwRjo+p9R74wvKl+0DwiFQsMHDhyYmMmJnP2IbPDZ29t7atmyZbd1PR8PIreFlS1btuRFHhP9fmRRt0pf5XjGQ9NtIay1tbXQZDJZe3t7T1VXV5dFhsCkpCTz4OBg3yuvvPJOX1/fsB6Soq9fWVnZbTKZDpaUlDyxYcOGXBmf3RMR+cEPftAYuYOyubl5wOPxHC4vL78lWCYlJf2rpmmG1tZWHpUDAPiTkiwi35nNC1z1B0MfnfzDJ0VLFmZcj02T3qU/llDc62LyfRCKGx6NCSfK/JsL4kTmx8knXeHTLb+9cUnFdVevXp2lz1z19fUNNzU12ex2uy3yuX6hUGh4dHQ0qO/cu379+s8GBwf79GcFRha7V1VVmbdv354rImK1WpfqS3ynT5+e+MF3Op15aWlpqSIiOTk5E0X1k40vNTV16WTP6os+Zqr3VI8nkr57Mjs7u7C/v/+WYBQfH28wmUxWEZETJ050i4j4/f62K1euBCdbTtQbjerXj1RaWnqsvr6+77333rtlB+Rk7SkiZ9z0f8tAIBBcv359nihCwAIAqLJBRAwzPss0Dv7HB8dXfcOyzJIetF6NWTxy6o/ln108GX/WGnw/7lvLb65YZE5YfPXajasv/eZ628XL4REV12xsbDzQ19c3vG/fvh1Go3GiE3kgEBh0u91d7e3t3XqBtcPhyHrooYdsy5cvt+m9s0REDAZDm4zP4CxdujQx+tE7fr/fG/lg6A0bNuRGzuaEQqHhV1555Z3Z+E5nczwNDQ1evb1C9Hujo6NB/YHVd7ODb/Xq1Vl6IAuFQsNHjhzpjr7Wl713u91uiy7Qn66z/N1QtsMDAPAXLU1EKuZ6ELOtvr7eunXr1qzTp097XS6Xd7rmnSJjMyQpKSmG5ubmW1oJRHZ/9/l8wehwENkzSuT2nlU6p9OZJzJR+D4lfQZqqmf3qRrPbH//FovFcDfX14+d7jhN0wzl5eUTM2uRuxtngoAFAFDhcRFZMdeDAP5U8LBnAMBM3S+EK+AWBCwAwEzEySy1ZQD+nBGwAAAzkSMiqTM+C/A1Q8ACANwrk4w90BlAlBgRqRWK3QEAAJSZJ4QrAAAApVgiBAAAUIyABQAAoBgBCwAAQDECFgAAgGIELAAAAMUIWAAAAIoRsAAAABQjYAEAAChGwAIAAFCMgAUAAKAYAQsAAEAxAhYAAIBiBCwAAADFCFgAAACKEbAAAAAUI2ABAAAoRsACAABQjIAFAACgGAELAABAMQIWAACAYgQsAAAAxQhYAAAAihGwAAAAFCNgAQAAKEbAAgAAUIyABQAAoBgBCwAAQDECFgAAgGIELAAAAMUIWAAAAIoRsAAAABQjYAEAAChGwAIAAFCMgAUAAKAYAQsAAEAxAhYAAIBiBCwAAADFCFgAAACKEbAAAAAUI2ABAAAoRsACAABQjIAFAACgGAELAABAMQIWAACAYgQsAAAAxQhYAAAAihGwAAAAFCNgAQAAKEbAAgAAUIyABQAAoBgBCwAAQDECFgAAgGIELAAAAMUIWAAAAIoRsAAAABQjYAEAAChGwAIAAFCMgAUAAKAYAQsAAEAxAhYAAIBiBCwAAADFCFgAAACKEbAAAAAUI2ABAAAoRsACAABQjIAFAACgGAELAABAMQIWAACAYgQsAAAAxQhYAAAAihGwAAAAFCNgAQAAKEbAAgAAUIyABQAAoBgBCwAAQDECFgAAgGIELAAAAMUIWAAAAIoRsAAAABQjYAEAACg2T0TCcz0IAACAr5P/Bx0uBvDTbd8+AAAAAElFTkSuQmCC';
        this.overlayDark.src = 'data:img/jpg;base64,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';
        this.overlayPing.src = 'data:img/jpg;base64,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RCQzBiwiIiIimTFgEREREcmMAYuIiIhIZgxYRERERDJjwCIiIiKSGQMWERERkcwYsIiIiIhkxoBFREREJDMGLCIiIiKZMWARERERyYwBi4iIiEhmDFhEREREMmPAIiIiIpIZAxYRERGRzBiwiIiIiGTGgEVEREQkMwYsIiIiIpkxYBERERHJjAGLiIiISGYMWEREREQyY8AiIiIikhkDFhEREZHMGLCIiIiIZMaARURERCQzBiwiIiIimTFgEREREcmMAYuIiIhIZgxYRERERDJjwCIiIiKSGQMWERERkcwYsIiIiIhkxoBFREREJDMGLCIiIiKZMWARERERyYwBi4iIiEhmDFhEREREMmPAIiIiIpIZAxYRERGRzBiwiIiIiGTGgEVEREQkMwYsIiIiIpkxYBERERHJjAGLiIiISGYMWEREREQyY8AiIiIikhkDFhEREZHMGLCIiIiIZMaARURERCQzBiwiIiIimTFgEREREcmMAYuIiIhIZgxYRERERDJjwCIiIiKSGQMWERERkcwYsIiIiIhkxoBFREREJDMGLCIiIiKZMWARERERyYwBi4iIiEhmDFhEREREMmPAIiIiIpIZAxYRERGRzBiwiIiIiGTGgEVEREQkMwYsIiIiIpkxYBERERHJjAGLiIiISGYMWEREREQyY8AiIiIikhkDFhEREZHMGLCIiIiIZMaARURERCQzBiwiIiIimTFgEREREcmMAYuIiIhIZgxYRERERDJTABBHuggiIiKib5P/AzD6z6kSISAHAAAAAElFTkSuQmCC';
        this.canvas.width = 600;
        this.canvas.height = 388;
    }
    Draw.prototype.draw = function () {
        this.drawImage();
        this.drawWatermark();
        this.drawOverlay();
        this.drawText();
    };
    Draw.prototype.drawImage = function () {
        // let { top, left } = this.selected.style
        var width = this.selectedWidth * this.originImageRatio;
        var height = this.selectedWidth / this.RATIO * this.originImageRatio;
        var left = (this.offset[0] + this.mousePosition.x) * this.originImageRatio;
        var top = (this.offset[1] + this.mousePosition.y) * this.originImageRatio;
        console.log(top, left, width, height);
        console.log('ratio', this.originImageRatio);
        console.log('offse', this.offset);
        this.ctx.drawImage(this.originImg, left, top, width, height, 0, 0, 600, 388);
    };
    Draw.prototype.drawWatermark = function () {
        if (this.isWatermark.checked) {
            if (this.isPing.checked) {
                this.ctx.drawImage(this.watermarkPing, 20, this.canvas.height - 40);
            }
            else {
                this.ctx.drawImage(this.watermark, 20, this.canvas.height - 40);
            }
        }
    };
    Draw.prototype.drawOverlay = function () {
        if (this.isOverlay.checked) {
            if (this.isPing.checked) {
                this.ctx.drawImage(this.overlayPing, 0, this.canvas.height - this.curOffset, this.canvas.width, this.overlayPing.height);
            }
            else {
                var overlay = this.isDark.checked ? this.overlayDark : this.overlay;
                console.log('drawoverlay');
                this.ctx.drawImage(overlay, 0, this.canvas.height - this.curOffset, this.canvas.width, overlay.height);
            }
        }
    };
    Draw.prototype.drawText = function () {
        this.ctx.font = "bold " + this.fontSize + "px MicrosoftYaHei-Bold, PingFangSC-Semibold";
        this.ctx.fillStyle = '#fafaf6';
        this.ctx.textAlign = "center";
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowColor = "rgba(0,0,0,0.3)";
        this.ctx.shadowBlur = 5;
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.input.value, this.canvas.width / 2, (this.canvas.height - this.curOffset) + 73);
    };
    Draw.prototype.handleFile = function () {
        var _this = this;
        var file = this.file.files[0];
        var reader = new FileReader;
        reader.addEventListener('load', function () {
            _this.originImg.src = reader.result;
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    return Draw;
}());
new Draw;
