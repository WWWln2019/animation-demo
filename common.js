function getStyle(ele, attr) {
    return window.getComputedStyle ? window.getComputedStyle(ele, null)[attr] : ele.currentStyle[attr] || 0;
}

function getComputed(ele, attr, currentValue, targetValue, step) {
    var value = null;
    var isFloat = false;
    if (attr == "backgroundColor") {
        value = currentValue;
        currentValue = currentValue.currentValue;
    }
    //float
    if (/[.]+/.test(Math.abs(currentValue) + "") || /[.]+/.test(Math.abs(targetValue) + "")) {
        isFloat = true;
        currentValue = currentValue * 100;
        targetValue = targetValue * 100;
    }
    if (!step) {
        step = (parseInt(targetValue) - parseInt(currentValue)) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
    } else {
        step = targetValue - currentValue > 0 ? step : -step;
    }
    currentValue += step;
    if (Math.abs(targetValue - currentValue) <= Math.abs(step)) {
        currentValue = targetValue;
    }
    currentValue = isFloat ? currentValue / 100 : currentValue;
    switch (attr) {
        case "opacity":
        case "zIndex":
            ele.style[attr] = currentValue;
            break;
        case  "backgroundColor":
            var oldValue = getRGB(getStyle(ele, attr));
            oldValue[value.index] = currentValue;
            ele.style[attr] = oldValue.length == 4 ? "rgba(" + oldValue.toString() + ")" : "rgb(" + oldValue.toString() + ")";
            break;
        default:
            ele.style[attr] = ""+currentValue + "px";
    }
}

/**
 *
 * @param backgroundColor
 * @returns {RegExpMatchArray | Promise<Response | undefined> | *}
 */
function getRGB(backgroundColor) {
    if (/^#[0-9a-fA-F]{6}$/.test(backgroundColor)) {
        var rgb = backgroundColor.match(/[0-9a-fA-F]{2}/g);
        var afRGB = {a: 10, b: 11, c: 12, d: 13, e: 14, f: 15};
        rgb.forEach(function (color0x, index) {
            var color = [];
            for (var i = 0; i < color0x.length; i++) {
                if (/^[a-fA-F]$/.test(color0x[i])) {
                    color[i] = afRGB[color0x[i]];
                } else {
                    color[i] = color0x[i];
                }
            }
            rgb[index] = color[0] * 16 + color[1]
        })
        return rgb;
    } else if (/(rgb)+/.test(backgroundColor)) {
        return backgroundColor.match(/[0-9.]+/g);
    }
}

/**
 *
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
function isEqual(obj1, obj2) {
    if (typeof obj1 == "object" && typeof obj2 == "object") {
        if (obj1.length != obj2.length) {
            return false;
        }
        for (var attr in obj1) {
            if (!isEqual(obj1[attr], obj2[attr])) {
                return false;
            }
        }
        return true;
    }
    return obj1 == obj2;
}
