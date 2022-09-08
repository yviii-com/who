// 通用方法
import _filter from './filter';
import _map from './map';
import _pair from './pair';

var _mode = {};                         // 模式数据
var _data = Object.assign({},_map);     // 最终数据

// 中文数字转阿拉伯数字
var zh2number = function(text){
    var num = 0;
    var map = {'大':1,'小':99};
    var textAttr = ['','一','二','三','四','五','六','七','八','九','十'];
    if(map[text]){
        num = map[text];
    }else{
        if(text.includes('十')){
            var numAttr = text.split('十');
            if(!numAttr[0]){
                num = 10;
            }else{
                num = textAttr.indexOf(numAttr[0])*10;
            }
            num += textAttr.indexOf(numAttr[1]);
        }else{
            num += textAttr.includes(text)?textAttr.indexOf(text):0;
        }
    }
    return num;
};

// 阿拉伯数字转中文数字
var number2zh = function(num){
    var text = '';
    var map = {1:'大',99:'小'};
    var textAttr = ['','一','二','三','四','五','六','七','八','九','十'];
    if(map[num]){
        text = map[num];
    }else{
        var dec = ~~(num/10);
        var unit = num%10;
        if(dec){
            if(dec>1){
                text = dec<textAttr.length?textAttr[dec]:'';
            }
            text += '十';
            text += unit<textAttr.length?textAttr[unit]:'';
        }else{
            text += num<textAttr.length?textAttr[num]:'';
        }
    }
    return text;
};

// 获得代数
var getGen = function(id){
    var gMap = {'f':1,'m':1,'s':-1,'d':-1};
    var arr = id.split(',');
    var gen = 0;
    arr.forEach(function(sub){
        var s = sub.replace(/&[ol\d]+/,'');
        gen += gMap[s]||0;
    });
    return gen;
};

// 获得最简
var getOptimal = function(options){
    var from = options['from'];
    var to = options['to']
    var sex = options['sex'];
    var from_chain = options['from'].split(',');
    var to_chain = options['to'].split(',');
    for(var i=0;i<from_chain.length&&i<to_chain.length;i++){
        if(from_chain[i]==to_chain[i]){
            from = from_chain.slice(i+1).join(',');
            to = to_chain.slice(i+1).join(',');
            sex = from_chain[i].match(/^([fhs1](&[ol\d]+)?|[olx]b)(&[ol\d]+)?/)?1:0;
            continue;
        }else{
            if(getGen(from_chain[i])==getGen(to_chain[i])&&from_chain[i].match(/^[xol][bs]|^[sd]/)){
                var from_match = from_chain[i].match(/&([ol\d]+)/);
                var to_match = to_chain[i].match(/&([ol\d]+)/);
                if(!from_match){
                    from_match = from_chain[i].match(/([ol])[bs]/);
                }
                if(!to_match){
                    to_match = to_chain[i].match(/([ol])[bs]/);
                }
                var from_attr = from_match?from_match[1]:'';
                var to_attr = to_match?to_match[1]:'';
                if(from_attr&&to_attr){
                    if(!isNaN(from_attr)&&!isNaN(to_attr)){
                        if(+from_attr>+to_attr){
                            from_chain[i] = from_chain[i].replace(/^[xol]b|^s/,'lb').replace(/^[xol]s|^d/,'ls');
                        }else if(+from_attr<+to_attr){
                            from_chain[i] = from_chain[i].replace(/^[xol]b|^s/,'ob').replace(/^[xol]s|^d/,'os');
                        }
                    }else if(!isNaN(from_attr)&&to_attr=='o'||from_attr=='l'&&!isNaN(to_attr)){
                        from_chain[i] = from_chain[i].replace(/^[xol]b|^s/,'lb').replace(/^[xol]s|^d/,'ls');
                    }else if(!isNaN(from_attr)&&to_attr=='l'||from_attr=='o'&&!isNaN(to_attr)){
                        from_chain[i] = from_chain[i].replace(/^[xol]b|^s/,'ob').replace(/^[xol]s|^d/,'os');
                    }
                    from = from_chain.slice(i).join(',');
                    to = to_chain.slice(i+1).join(',');
                    sex = to_chain[i].match(/^([fhs1](&[ol\d]+)?|[olx]b)(&[ol\d]+)?/)?1:0;
                }else if(options['optimal']){
                    from_match = from_chain[i].match(/([xol])[bs]/);
                    to_match = to_chain[i].match(/([xol])[bs]/);
                    from_attr = from_match?from_match[1]:'';
                    to_attr = to_match?to_match[1]:'';
                    if(from_attr=='x'||to_attr=='x'){
                        from = from_chain.slice(i+1).join(',');
                        to = to_chain.slice(i+1).join(',');
                        sex = from_chain[i].match(/^([fhs1](&[ol\d]+)?|[olx]b)(&[ol\d]+)?/)?1:0;
                        continue;
                    }
                }
            }
            break;
        }
    }
    return {
        'from':from,
        'to':to,
        'sex':sex
    };
};

// 数组去重
export function unique(arr){
    var sameList = arr.filter(item=>item==item.replace(/[ol](?=s|b)/,'x').replace(/&[ol]/,''));
    return arr.filter(item=>{
        var temp = item.replace(/[ol](?=s|b)/,'x').replace(/&[ol]/,'');
        return sameList.includes(item)||item!=temp&&!sameList.includes(temp);
    }).filter((item,idx,arr) => arr.indexOf(item) === idx);
};

// 中文获取选择器
export function getSelectors(str){
    str = str.replace(/之/g,'的').replace(/吾之?(.+)/,'$1').replace(/我的?(.+)/,'$1');
    if(str.match(/[^娘婆岳亲]家的?/)){
        str = str.replace(/家的?/,'的');
    }
    var lists = str.split('的');
    var result = [];
    var isMatch = true;
    // 双向替换
    var replaceMap = {
        '晜':'兄',
        '哥':'兄',
        '姐':'姊',
        '侄':'姪',
        '婿':'壻',
        '祖父':'王父',
        '祖母':'王母',
        '弟媳':'弟妇',
        '嫂':'兄妇',
        '孙女婿':'孙婿',
        '甥女婿':'甥婿',
        '侄女婿':'侄婿',
        '孙媳妇':'孙妇',
        '甥媳妇':'甥妇',
        '侄媳妇':'侄妇',
    };
    // 含义扩展
    var replaceFilter = {
        '^从表':['从父姑表','从父舅表','从父姨表','从母姑表','从母舅表','从母叔表'],
        '^表表':['姑表叔表','姑表姑表','姑表舅表','姑表姨表','舅表叔表','舅表姑表','舅表舅表','舅表姨表'],
        '^([夫妻内外]?)表':['$1姑表','$1舅表'],
        '^([姑舅])表(?=[^伯叔])':['$1表伯','$1表叔'],
        '^姻':['姑姻','姨姻','姊妹姻','女姻'],
        '^眷':['叔眷','舅眷','兄弟眷','男眷'],
        '^亲家':['姊妹姻','兄弟眷'],
        '^([堂表姨]?)([曾高天烈太远鼻]?)(祖?)([伯叔姑舅姨])':['$1$4$2$3'],
        '^([曾高天烈太远鼻]?)祖?王姑':['姑$1祖母'],
        '^([曾玄来晜仍云耳])([侄甥])':['$2$1'],
        '^外表([伯叔姑舅姨])':['姑表$1外','舅表$1外'],
        '^([堂表姨]?)外甥':['$1甥'],
        '^([舅叔])([曾玄外]*)孙':['$1侄$2孙'],
        '^([姨姑])([曾玄外]*)孙':['$1甥$2孙'],
        '([孙甥侄])$':['$1男','$1女'],
        '([姑舅姨叔])([孙外]*)([男女])$':['$1表侄$2$3','$1表甥$2$3'],
        '祖$':['祖父'],
        '嫂$':['兄妇'],
        '女儿$':['女'],
    };
    while(lists.length){
        var name = lists.shift();           //当前匹配词
        var items = [];                     //当前匹配词可能性
        var x_items = [];
        var r_items = [];
        var keywords = [name];
        var getList = function(name){
            for(var filter in replaceFilter){
                var word_list = replaceFilter[filter];
                word_list.forEach(function(word){
                    var name1 = name.replace(new RegExp(filter),word);
                    if(name1!=name){
                        keywords.push(name1);
                        getList(name1);
                    }
                });
            }
            for(var word in replaceMap){
                var name1 = name.replace(word,replaceMap[word]);
                var name2 = name.replace(replaceMap[word],word);
                if(name1!=name){
                    keywords.push(name1);
                }
                if(name2!=name){
                    keywords.push(name2);
                }
            }
        };
        getList(name);
        // 通过关键词找关系
        keywords.forEach(function(name){
            var x_name = name.replace(/^[大|小]|^[一|二|三|四|五|六|七|八|九|十]+/,'几');
            var r_name = name.replace(/^[大|小]|^[一|二|三|四|五|六|七|八|九|十]+/,'');
            var match = name.match(/^[大|小]|^[一|二|三|四|五|六|七|八|九|十]+/);
            if(match){
                var num = zh2number(match[0]);
                for(var i in _data){
                    var r_i = i.replace(/(,[hw])$/,'&'+num+'$1').replace(/([^hw]+)$/,'$1&'+num);
                    if(_data[i].includes(x_name)){
                        x_items.push(r_i);
                    }else if(_data[i].includes(r_name)){
                        if(!i.match(/^[mf,]+$/)&&!r_name.match(/^[从世]/)){  // 直系祖辈不参与排序
                            r_items.push(r_i);
                        }
                    }
                    if(_data[i].includes(name)){
                        items.push(r_i);
                    }
                }
            }else{
                for(var i in _data){
                    if(_data[i].includes(name)){
                        items.push(i);
                    }
                }
            }
        });
        // console.log('[keywords]',keywords);
        // 如找不到结果，再是否存在称呼的排行问题(不直接判断，因存在"大舅""三从父兄""三世祖"这样特俗含义的情况)
        if(!items.length){
            items = x_items;
        }
        if(!items.length){
            items = r_items;
        }
        // 完全匹配不到结果
        if(!items.length){
            isMatch = false;
        }
        var res = [];
        if(!result.length){
            result = [''];
        }
        result.forEach(function(a){
            items.forEach(function(b){
                res.push(a+(b?','+b:''));
            });
        });
        result = res;
    }
    return isMatch?result:[];
};

// 合并选择器，查找两个对象之间的关系
export function mergeSelector(param){
    var from_selector = param['from'];
    var to_selector = param['to'];
    var my_sex = param['sex'];
    if(my_sex<0){
        var to_sex = -1;
        var from_sex = -1;
        if(from_selector.match(/^,[w1]/)){
            from_sex = 1;
        }else if(from_selector.match(/^,[h0]/)){
            from_sex = 0;
        }
        if(to_selector.match(/^,[w1]/)){
            to_sex = 1;
        }else if(to_selector.match(/^,[h0]/)){
            to_sex = 0;
        }
        if(from_sex==-1&&to_sex>-1){
            my_sex = to_sex;
        }else if(from_sex>-1&&to_sex==-1){
            my_sex = from_sex;
        }else if(from_sex==to_sex){
            my_sex = from_sex;
        }else{
            return [];
        }
    }
    var from_ids = selector2id(param['from'],my_sex);
    var to_ids = selector2id(param['to'],my_sex);
    if(!from_ids.length||!to_ids.length){
        return [];
    }
    var result = [];
    from_ids.forEach(function(from){
        to_ids.forEach(function(to){
            var sex = my_sex;
            var selector = ','+to;
            if(selector.match(/,([fhs1](&[ol\d]+)?|[olx]b)(&[ol\d]+)?$/)){
                sex = 1;
            }
            if(selector.match(/,([mwd0](&[ol\d]+)?|[olx]s)(&[ol\d]+)?$/)){
                sex = 0;
            }
            if(from&&to){
                var isOptimal = param.optimal;
                if(from.match(/&\d+/)||to.match(/&\d+/)){
                    isOptimal = true;
                }
                if(isOptimal){
                    var ops = getOptimal({
                        'from':from,
                        'to':to,
                        'sex':my_sex,
                        'optimal':param.optimal
                    });
                    from = ops['from'];
                    to = ops['to'];
                    my_sex = ops['sex'];
                }
            }
            var to_rids = to?reverseId(to,my_sex):[''];
            to_rids.forEach(function(to_r){
                var selector = (to_r?','+to_r:'')+(from?','+from:'');
                result.push({
                    'selector':selector,
                    'sex':sex
                });
            });
        });
    });
    return result;
};

// 选择器转ID
export function selector2id(selector,sex){
    var result = [];
    var hash = {};
    if(!selector.match(/^,/)){
        selector = ','+selector;
    }
    //性别判断
    if(sex<0){
        if(selector.match(/^,[w1]/)){
            sex = 1;
        }else if(selector.match(/^,[h0]/)){
            sex = 0;
        }
    }else if(sex==1&&selector.match(/^,[h0]/)){
        return [];
    }else if(sex==0&&selector.match(/^,[w1]/)){
        return [];
    }
    // console.log('[selector]',selector);
    var getId = function(selector,sex){
        if(!selector.match(/^,/)){
            selector = ','+selector;
        }
        if(sex>-1&&!selector.includes(',1')&&!selector.includes(',0')){
            selector = ','+sex+selector;
        }
        if(selector.match(/,[mwd0](&[ol\d]+)?,w|,[hfs1](&[ol\d]+)?,h/)){  //同志关系去除
            return [];
        }
        var s='';
        if(!hash[selector]){
            hash[selector] = true;
            do{
                s = selector;
                for(var i in _filter){
                    var item = _filter[i];
                    // console.log('[filter]',item['exp'],selector);
                    selector = selector.replace(item['exp'],item['str']);
                    if(selector.includes('#')){
                        selector.split('#').forEach(getId);
                        return false;
                    }
                }
            }while(s!=selector);
            if(selector.match(/,[mwd0](&[ol\d+])?,w|,[hfs1](&[ol\d]+)?,h/)){  //同志关系去除
                return false;
            }
            selector = selector.replace(/,[01]/,'').substr(1);  //去前面逗号和性别信息
            result.push(selector);
        }
    }
    getId(selector,sex);
    return unique(result);
};

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
            var gen = getGen(r_id);
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

// 通过ID获取关系称呼
export function getItemsById(id){
    var items = [];
    var getData = function(d){
        var res = [];
        if(_data[d]){
            res.push(_data[d][0]);
        }else{
            for(var i in _data){
                if(i.replace(/&[ol]/g,'')==d){
                    res.push(_data[i][0]);
                }else{
                    var expr = d;
                    while (expr.match(/[ol](b|s)/)){
                        expr = expr.replace(/[ol](b|s)/,'x$1');
                        if(expr==i){
                            res.push(_data[i][0]);
                            break;
                        }
                    }
                }
            }
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
            var gen = getGen(id);
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
export function getChainById(id){
    var arr = id.split(',');
    return arr.map(function(sign){
        var key = sign.replace(/&[ol\d]+/,'');
        var data = Object.assign({},_data,{
            'xb':['兄弟'],
            'xs':['姐妹']
        });
        return data[key][0];
    }).join('的');
};

// 通过ID获取关系合称
export function getPairsByIds(id1,id2){
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

// 设置模式数据
export function setMode(sign,data){
    _mode[sign] = Object.assign(_mode[sign]||{},data);
};

// 获取模式数据
export function getDataByMode(sign){
    var data = Object.assign({},_map);
    if(sign&&_mode[sign]){
        for(var key in _mode[sign]){
            data[key] = [].concat(_mode[sign][key],_map[key]||[]);
        }
    }
    return data;
};
