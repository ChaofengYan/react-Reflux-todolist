var TodoAction = require('./TodoAction');

var TodoStore = Reflux.createStore({
    listenables: [TodoAction],

    //公用方法
    updateStatus:function(list){
        //这里执行本地或远程数据更新
        if(!list) list = this.list;
        this.trigger(list);
    },
    

    //在Action定义的动作
    onAddItem: function(item) {
        this.list.unshift({
            id: new Date(),
            isComplete:false,
            item:item
        })
        this.updateStatus();
    },

    onRemoveItem: function(id) {
        var newList = this.list.filter(function(item){
            return item.id!==id;
        });
        this.list = newList;
        this.updateStatus();
    },
    onToggleItem:function(id){
        this.list.map(function(item){
            if(item.id==id){
                item.isComplete =!item.isComplete;
            }
            return item;
        });
        this.updateStatus();
    },
    onToggleAllItems:function(checked){
        this.list.map(function(item){
            item.isComplete = checked;
            return item;
        });
        this.updateStatus();
    },
    onEditItem: function(id,data) {
        this.list.map(function(item){
            if(item.id==id) item.item=data;
            return item;
        })
        this.updateStatus();
    },
    onClearCompleted:function(){
        var newList = this.list.filter(function(item){
            return item.isComplete!==true;
        });
        this.list = newList;
        this.updateStatus();
    },
    onFilterItem: function(filterText) {
        var newList = this.list.filter(function(item){
            return item.item.indexOf(filterText)>-1;
        });
        this.updateStatus(newList);
    },

    getInitialState: function() {
        this.list = [{
            id:new Date(),
            isComplete:false,
            item:'杏坛小子万岁'
        }];
        return this.list;
    }
});

module.exports = TodoStore;