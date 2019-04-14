//变速
function variableAnimateVer1(ele, target) {
    var timeId = setInterval(function () {
        var cur = ele.offsetLeft;
        var step = target - cur / 10;
        step = target - cur > 0 ? step : -step;
        if (cur == target) {
            clearInterval(timeId);
        }
        if (target - cur < 10) {
            ele.style.left = target + "px";
            clearInterval(timeId);
        } else {
            ele.style.left = cur + step + "px";
        }

    }, 200)
}

/**
 * {
 *     width:100,
 *     height:200,
 *     opacity:0.4,
 *     backgroundColor:pink,
 *     zIndex:999,
 *}
 * @param ele
 * @param target
 * @param callback
 */
function variableAnimate(ele, target, speed, callback) {
    console.log(ele.timeId);
    clearInterval(ele.timeId);
    ele.timeId = setInterval(function () {
        var currentValue;
        var targetValue;
        var isCompleted = true;
        for (var attr in target) {
            switch (attr) {
                case "opacity":
                    currentValue = getStyle(ele, attr);
                    targetValue = target[attr];
                    getComputed(ele, attr, currentValue, targetValue);
                    break;
                case "zIndex":
                    ele.style[attr] = target[attr];
                    break;
                case  "backgroundColor":
                    //rgb()
                    var curStyle = getStyle(ele, attr);
                    currentValue = getRGB(curStyle);
                    targetValue = getRGB(target[attr]);
                    currentValue.forEach(function (value, index) {
                        getComputed(ele, attr, {
                            index,
                            currentValue: Number(value),
                            //oldValue: currentValue.match(reg)
                        }, parseInt(targetValue[index]));
                    });
                    break;
                default:
                    //可以相减的属性
                    /*console.log(attr+"===="+parseInt(getStyle(ele, attr)));*/
                    currentValue = parseInt(getStyle(ele, attr));
                    targetValue = target[attr];
                    getComputed(ele, attr, currentValue, targetValue);
                /*step = targetValue - currentValue > 0 ? step : -step;
                currentValue += step;
                if (Math.abs(targetValue - currentValue) <= Math.abs(step)) {
                    ele.style[attr] = targetValue + "px";
                    // clearInterval(ele.timeId);
                } else {
                    ele.style[attr] = currentValue + "px";
                }*/
            }
            if (!isEqual(currentValue, targetValue)) {
                isCompleted = false;
            }
        }
        if (isCompleted) {
            console.log("finished...")
            clearInterval(ele.timeId);
            callback && callback();
        }
    }, speed || 200);
}