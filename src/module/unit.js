/*
 * 数值转换
*/

var textAttr = ['','一','二','三','四','五','六','七','八','九','十'];

// 中文数字转阿拉伯数字
export function zh2number(text){
    var num = 0;
    var map = {'大':1,'小':99};
    if(map[text]){
        num = map[text];
    }else{
        var [unit,dec=0] = text.replace(/^十/,'一十').split('十').map(word=> textAttr.indexOf(word)).reverse();
        num = dec*10+unit;
    }
    return num;
};

// 阿拉伯数字转中文数字
export function number2zh(num){
    var text = '';
    var map = {1:'大',99:'小'};
    if(map[num]){
        text = map[num];
    }else{
        var dec = ~~(num/10);
        var unit = num%10;
        text = (dec?(textAttr[dec]+'十').replace('一十','十'):'')+textAttr[unit];
    }
    return text;
};
