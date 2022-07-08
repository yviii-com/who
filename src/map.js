// 默认完整映射关系
import _main from './main';
import _prefix from './prefix';
import _branch from './branch';

var _map = {};

// 分支关系
for(var key in _branch){
    var tag = key.match(/\{.+?\}/)[0];
    var nameList = _branch[key];
    for(var k in _prefix[tag]){
        var prefixList = _prefix[tag][k];
        var newKey = key.replace(tag,k);
        var isFilter = ['h,h','w,w','w,h','h,w'].some(pair=>(newKey.indexOf(pair)>-1));
        var newList = [];
            if(!isFilter){
                prefixList.forEach(function(prefix){
                nameList.forEach(function(name){
                    if(name.indexOf('?')>-1){
                        newList.push(name.replace('?',prefix));
                    }else{
                        newList.push(prefix+name);
                    }
                });
            });
            _map[newKey] = [].concat(_map[newKey]||[],newList);
        }
    }
}
// 主要关系
for(var key in _main){
    _map[key] = [].concat(_main[key],_map[key]||[]);
}
_map['o']=['passer-by.com','\u4f5c\u8005'];
// 配偶关系
var branch = {
    'w':['妻','内','岳','岳家','丈人'],
    'h':['夫','外','公','婆家','婆婆'],
};
var allName = {};
for(var key in _map){
    _map[key].forEach(function(name){
        allName[name]=true;
    });
}
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
                    if(!allName[newName]){  // 配偶组合的称呼不得已原有称呼冲突(如：妻舅!=妻子的舅舅;外舅公!=老公的舅公)
                        _map[newKey].push(newName);
                    }
                });
            });
        }
    }
}

export default _map;
