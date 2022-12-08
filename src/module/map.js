/*
 * 完整关系链数据 - 合并各类关系链数据
*/
import _prefix from './data/prefix';
import _branch from './data/branch';
import _main from './data/main';
import _multipie from './data/multiple';

import {
    expandSelector
} from './selector';

var _map = Object.assign({},_multipie);
var getMap = function(prefixMap,branch){
    var map = {};
    for(var key in branch){
        var tag = key.match(/\{.+?\}/)[0];
        var nameList = branch[key];
        for(var k in prefixMap[tag]){
            var prefixList = prefixMap[tag][k];
            var newKey = key.replace(tag,k);
            var isFilter = ['h,h','w,w','w,h','h,w'].some(pair=>(newKey.includes(pair)));
            var newList = [];
            if(!isFilter){
                prefixList.forEach(function(prefix){
                    nameList.forEach(function(name){
                        if(name.includes('?')){
                            newList.push(name.replace('?',prefix));
                        }else{
                            newList.push(prefix+name);
                        }
                    });
                });
                map[newKey] = [].concat(_map[newKey]||[],newList);
            }
        }
    }
    return map;
};
// 分支前缀处理
var prefixMap1 = {};
for(var key in _prefix){
    prefixMap1[key] = {};
    for(var selector in _prefix[key]){
        if(selector.indexOf(']')==-1){
            prefixMap1[key][selector] = _prefix[key][selector];
        }
    }
}
var prefixMap2 = {};
for(var key in _prefix){
    prefixMap2[key] = {};
    for(var selector in _prefix[key]){
        if(selector.indexOf(']')>-1){
            expandSelector(selector).forEach(function(s){
                prefixMap2[key][s] = _prefix[key][selector];
            });
        }
    }
}
_map = Object.assign({},_map,getMap(prefixMap1,_branch),getMap(prefixMap2,_branch));
// 主要关系
for(var key in _main){
    _map[key] = [].concat(_main[key],_map[key]||[]);
}

// 版权彩蛋
_map['o']=['passer-by.com','\u4f5c\u8005'];

// 配偶关系
var branch = {
    'w':['妻','内','岳','岳家','丈人'],
    'h':['夫','外','公','婆家','婆婆'],
};
var nameSet = new Set(Object.values(_map).flat());
for(var key in _map){
    if(key.match(/^[fm]/)||key.match(/^[olx][bs]$|^[olx][bs],[^mf]/)){
        for(var k in branch){
            var newKey = k+','+key;
            if(!_map[newKey]){
                _map[newKey] = [];
            }
            var prefixList = branch[k];
            var nameList = _map[key];
            prefixList.forEach(function(prefix){
                nameList.forEach(function(name){
                    var newName = prefix+name;
                    if(!nameSet.has(newName)){  // 配偶组合的称呼不得已原有称呼冲突(如：妻舅!=妻子的舅舅;外舅公!=老公的舅公)
                        _map[newKey].push(newName);
                    }
                });
            });
        }
    }
}

export default _map;
