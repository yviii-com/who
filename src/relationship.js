import {
    unique,
    getSelectors,
    selector2id,
    getItemsById,
    reverseId,
    getChainById,
    mergeSelector,
    setMode,
    getDataByMode
} from './method';

var _data = getDataByMode();     // 最终数据

// 对外方法
var relationship = function (parameter){
    var options = Object.assign({
        text:'',
        target:'',
        sex:-1,
        type:'default',     // 'chain'表示关系链
        reverse:false,      // true表示反向
        mode:'default',     // 用户自定义模式
    },parameter);
    _data = getDataByMode(options.mode);
    var from_selectors = getSelectors(options.text);
    var to_selectors = getSelectors(options.target);
    if(!to_selectors.length){
        to_selectors = [''];
    }
    // console.log('[selectors]',from_selectors,to_selectors);
    var result = [];                            //匹配结果
    from_selectors.forEach(function(from){
        to_selectors.forEach(function(to){
            var data = mergeSelector(from,to,options.sex);
            // console.log('[data]',from,to,data);
            var ids = data?selector2id(data['selector'],data['sex']):null;
            // console.log('[ids]',data['selector'],data['sex'],ids);
            if(ids){
                ids.forEach(function(id){
                    var temps = [id];
                    var sex = data['sex'];
                    if(options.reverse){
                        temps = reverseId(id,data['sex']);
                        if(id.match(/([fhs1](&[ol])?|[olx]b)$/)){
                            sex = 1;
                        }else{
                            sex = 0;
                        }
                    }
                    if(options.type=='chain'){
                        temps.forEach(function(id){
                            var item = getChainById(id);
                            if(item){
                                if(id.match(/^[^hw]/)){
                                    if(data['sex']==0){
                                        item = '(女性)'+item;
                                    }else if(data['sex']==1){
                                        item = '(男性)'+item;
                                    }
                                }
                                result.push(item);
                            }
                        });
                    }else{
                        temps.forEach(function(id){
                            var items = getItemsById(id);
                            if(!items.length){
                                items = getItemsById(sex+','+id);
                            }
                            if(items.length){
                                result = result.concat(items);
                            }
                        });
                    }
                });
            }
        });
    });
    return unique(result);
};
// 获取数据表
relationship.data = _data;
// 获取数据量
relationship.dataCount = Object.keys(_data).length;
// 设置语言模式
relationship.setMode = setMode;

export default relationship;
