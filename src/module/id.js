/*
 * 标识符 - 唯一性关系链，将【关系链】转换成【中文表述】
*/
import _pair from './data/pair';

import {number2zh} from './unit';
import {selector2id} from './selector';
import {modeData as _data} from './mode';

// 逆转ID
export function reverseId(id,sex){
    var hash = {
        f:['d','s'],
        m:['d','s'],
        h:['w',''],
        w:['','h'],
        s:['m','f'],
        d:['m','f'],
        lb:['os','ob'],
        ob:['ls','lb'],
        xb:['xs','xb'],
        ls:['os','ob'],
        os:['ls','lb'],
        xs:['xs','xb']
    };
    var age = '';
    if(id.match(/&o$/)){
        age = '&l';
    }else if(id.match(/&l$/)){
        age = '&o';
    }
    if(id){
        id = id.replace(/&[ol\d+]/g,'');
        //性别判断
        if(sex<0){
            if(id.match(/^w/)){
                sex = 1;
            }else if(id.match(/^h/)){
                sex = 0;
            }
        }
        var result = [];
        var doing = function(sex){
            var sid = (','+sex+','+id).replace(/,[fhs]|,[olx]b/g,',1').replace(/,[mwd]|,[olx]s/g,',0');
            sid = sid.substring(0,sid.length-2);
            var id_arr = id.split(',').reverse();
            var sid_arr = sid.split(',').reverse();
            var arr = id_arr.map((id,i)=>hash[id][sid_arr[i]]);
            var r_id = arr.join(',');
            var gen = getGenById(r_id);
            return r_id +(gen?'':age);
        };
        if(sex<0){
            result.push(doing(1));
            result.push(doing(0));
        }else{
            result.push(doing(sex));
        }
        return result;
    }
    return [''];
};

// ID列表去重
export function filterId(arr){
    var sameList = arr.filter(item=>item==item.replace(/[ol](?=[s|b])/g,'x').replace(/&[ol]/,''));
    return arr.filter(item=>{
        var temp = item.replace(/[ol](?=[s|b])/g,'x').replace(/&[ol]/,'');
        return sameList.includes(item)||item!=temp&&!sameList.includes(temp);
    }).filter((item,idx,arr) => arr.indexOf(item) === idx);
};

// 通过ID获取世代数
export function getGenById(id){
    var gMap = {'f':1,'m':1,'s':-1,'d':-1};
    var arr = id.split(',');
    var gen = 0;
    arr.forEach(function(sub){
        var s = sub.replace(/&[ol\d]+/,'');
        gen += gMap[s]||0;
    });
    return gen;
};

// 通过ID获取关系称呼
export function getItemsById(id){
    var items = [];
    var getData = function(key){
        var res = [];
        if(_data[key]){
            res.push(_data[key][0]);
        }else{
            var ids = [];
            if(_data[key+'&o']){
                ids.push(key+'&o');
            }
            if(_data[key+'&l']){
                ids.push(key+'&l');
            }
            var k = key.replace(/[ol](b|s)/,'x$1');
            if(_data[k]){
                ids.push(k);
            }
            res = filterId(ids).map(function(id){
                return _data[id][0];
            });

        }
        return res;
    };
    // 对排序进行处理
    if(id.match(/&([\d]+)(,[hw])?$/)){
        var num = id.match(/&([\d]+)(,[hw])?$/)[1];
        var zh = number2zh(num);
        id = id.replace(/&\d+/g,'');
        if(_data[id]){
            var item = '';
            var gen = getGenById(id);
            if(gen<3&&!id.match(/[hw],/)){
                _data[id].forEach(function(name){
                    if(!item&&name.includes('几')){
                        item = name.replace('几',zh);
                    }
                });
                if(!item){
                    item = _data[id][0].match(/^[大小]/)?_data[id][0].replace(/^[大小]/,zh):zh+_data[id][0];
                }
            }else{
                item = _data[id][0]
            }
            items.push(item);
        }
    }else{
        id = id.replace(/&\d+/g,'');
    }
    // 直接匹配称呼
    if(!items.length){
        items = getData(id);
    }
    // 忽略年龄条件查找
    if(!items.length){
        id = id.replace(/&[ol]/g,'');
        items = getData(id);
    }
    // 忽略年龄条件查找
    if(!items.length){
        id = id.replace(/[ol](b|s)/g,'x$1');
        items = getData(id);
    }
    // 缩小访问查找
    if(!items.length){
        var l = id.replace(/x/g,'l');
        var o = id.replace(/x/g,'o');
        items = items.concat(getData(o),getData(l));
    }
    return items;
};

// 通过ID获取关系链
var data = Object.assign({},_data,{
    'xb':['兄弟'],
    'xs':['姐妹']
});
export function getChainById(id,sex){
    var arr = id.split(',');
    var item = arr.map(function(sign){
        var key = sign.replace(/&[ol\d]+/,'');
        return data[key][0];
    }).join('的');
    if(sex&&sex>-1&&data[sex+','+id]){
        if(sex==0){
            item = '(女性)'+item;
        }else if(sex==1){
            item = '(男性)'+item;
        }
    }
    return item
};

// 通过ID获取关系合称
export function getPairsById(id1,id2){
    var result = [];
    var result_x = [];
    var result_r = [];
    id1 = id1.replace(/&\d+/,'');
    id2 = id2.replace(/&\d+/,'');
    var id1_x = id1.replace(/([ol])([bs])/,'x$2');
    var id2_x = id2.replace(/([ol])([bs])/,'x$2');
    var id1_r = id1.replace(/&[ol]/,'');
    var id2_r = id2.replace(/&[ol]/,'');
    for(var key in _pair){
        var selectors = key.split('#');
        if(selectors.length>1){
            var list1 = selector2id(selectors[0]);
            var list2 = selector2id(selectors[1]);
            var list1_r = list1.map(function(selector){
                return selector.replace(/&[ol\d]+/,'').replace(/([ol])([bs])/,'x$2');
            });
            var list2_r = list2.map(function(selector){
                return selector.replace(/&[ol\d]+/,'').replace(/([ol])([bs])/,'x$2');
            });
            if(list1.includes(id1)&&list2.includes(id2)||list1.includes(id2)&&list2.includes(id1)){
                result.push(_pair[key][0]);
            }
            if(list1_r.includes(id1_x)&&list2_r.includes(id2_x)||list1_r.includes(id2_x)&&list2_r.includes(id1_x)){
                result_x.push(_pair[key][0]);
            }
            if(list1_r.includes(id1_r)&&list2_r.includes(id2_r)||list1_r.includes(id2_r)&&list2_r.includes(id1_r)){
                result_r.push(_pair[key][0]);
            }
        }
    }
    if(!result.length){
        result = result_x;
    }
    if(!result.length){
        result = result_r;
    }
    return result;
};
