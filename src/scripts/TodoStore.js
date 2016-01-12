
var TodoStore = Reflux.createStore({
    listenables: [TodoAction],
    updateStatus:function(list){
        //这里执行本地或远程数据更新
        if(!list) list = this.list;
        this.trigger(list);
    },
    
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
            item:'say hello!'
        }];
        return this.list;
    }
});

module.exports = TodoStore;