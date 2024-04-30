/*
 * 完整关系链数据 - 合并各类关系链数据
*/
import _prefix from './data/prefix.js';
import _branch from './data/branch.js';
import _main from './data/main.js';
import _multipie from './data/multiple.js';

import {expandSelector} from './selector.js';

let _map = Object.assign({},_multipie);

// 分支 - 前缀处理
let prefixMap = {};
for(let key in _prefix){
    prefixMap[key] = {};
    for(let selector in _prefix[key]){
        expandSelector(selector).forEach(function(s){
            prefixMap[key][s] = _prefix[key][selector];
        });
    }
}
// 分支 - 节点处理
let branchMap = {};
for(let selector in _branch){
    expandSelector(selector).forEach(function(s){
        branchMap[s] = _branch[selector];
    });
}
// 分支 - 合并
let getMap = function(prefixMap,branchMap){
    let map = {};
    for(let key in branchMap){
        let tag = key.match(/\{.+?\}/)[0];
        let nameList = branchMap[key];
        for(let k in prefixMap[tag]){
            let prefixList = prefixMap[tag][k];
            let newKey = key.replace(tag,k);
            let isFilter = ['h,h','w,w','w,h','h,w'].some(pair=>(newKey.includes(pair)));
            if(!isFilter){
                let newList = [];
                prefixList.forEach(function(prefix){
                    nameList.forEach(function(name){
                        if(name.includes('?')){
                            newList.push(name.replace('?',prefix));
                        }else{
                            newList.push(prefix+name);
                        }
                    });
                });
                if(!map[newKey]){
                    map[newKey] = _map[newKey]||[];
                }
                map[newKey] = newList.concat(map[newKey]);
            }
        }
    }
    return map;
};
_map = Object.assign({},_map,getMap(prefixMap,branchMap));

// 主要关系
for(let key in _main){
    _map[key] = [].concat(_main[key],_map[key]||[]);
}

// 版权彩蛋
_map['o']=['passer-by.com','\u4f5c\u8005'];

// 配偶关系
const mateMap = {
    'w':['妻','内','岳','岳家','丈人'],
    'h':['夫','外','公','婆家','婆婆'],
};
let nameSet = new Set(Object.values(_map).flat());
for(let key in _map){
    if(key.match(/^[fm]/)||key.match(/^[olx][bs]$|^[olx][bs],[^mf]/)){      // 只对长辈或者兄弟辈匹配
        for(let k in mateMap){
            let newKey = k+','+key;
            if(key.match(/[fm]/)){
                let newKey_x = newKey.replace(/,[ol]([sb])(,[wh])?$/,',x$1$2').replace(/(,[sd])&[ol](,[wh])?$/,'$1$2');
                if(newKey_x!=newKey&&_map[newKey_x]){       // 不扩大解释年龄
                    continue;
                }
            }
            if(!_map[newKey]){
                _map[newKey] = [];
            }
            let prefixList = mateMap[k];
            let nameList = _map[key];
            prefixList.forEach(function(prefix){
                nameList.forEach(function(name){
                    let newName = prefix+name;
                    if(!nameSet.has(newName)){              // 配偶组合的称呼不得与原有称呼冲突(如：妻舅!=妻子的舅舅;外舅公!=老公的舅公)
                        _map[newKey].push(newName);
                    }
                });
            });
        }
    }
}

export default _map;
