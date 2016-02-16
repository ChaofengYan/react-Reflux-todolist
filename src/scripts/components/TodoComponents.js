var TodoAction = require('./TodoAction');
var TodoStore = require('./TodoStore');
/**
 * @顶部--增加条目
 */
var Header = React.createClass({
  _onKeyUp: function(e) {
    var item = e.target.value;
    if (e.which == 13 && item) {
      //Enter键
      TodoAction.addItem(item);
      e.target.value = '';
    }
  },
  filter: function(e) {
    TodoAction.filterItem(e.target.value);
  },
  render: function() {
    return ( 
      < div id = "header" >
      < h1 > Todo List < /h1> 
      < input id = "new-todo"
        autoFocus 
        placeholder = "你将要做……"
        onKeyUp = {
          this._onKeyUp
        }
      /> 
      <input id="filter" onChange={this.filter} placeholder='筛选' />
      < /div>
    )
  }

});
/**
 * @一行列表
 */
var SingleItem = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  Destroy: function() {
      TodoAction.removeItem(this.props.id);
  },
  Toggle: function(evt) {
    TodoAction.toggleItem(this.props.id);
  },
  Edit: function(){
    this.setState({
      isEditing:true,
      editValue:this.props.item
    },function(){
      this.refs.editInput.getDOMNode().focus();
    });

  },
  Blur:function(){
    TodoAction.editItem(this.props.id,this.state.editValue);
    this.setState({
       isEditing:false
    })
  },
  getInitialState: function() {
     return {};
  },
  render:function(){
    var classes = React.addons.classSet({
      'completed':this.props.isComplete,
      'editing': this.state.isEditing
    }); 
    return(
      <li className={classes}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={!!this.props.isComplete} onChange={this.Toggle} />
          <label onDoubleClick={this.Edit}>{this.props.item}</label>
          <button className="destroy" onClick={this.Destroy}></button>
        </div>
        <input ref="editInput" className="edit" valueLink={this.linkState('editValue')} onKeyUp={this.ValueChange} onBlur={this.Blur} />   
      </li>
      )
  }
});
/**
 * @主体部分--显示列表 
 */
var Main = React.createClass({
  toggleAll:function(e){
    TodoAction.toggleAllItems(e.target.checked);
  },
  render: function() {
    return ( 
      <div id = "main" >
        <input id = "toggle-all" type = "checkbox" onChange={this.toggleAll}/>
        <label htmlFor = "toggle-all" > Mark all as complete < /label> 
        <ul id = "todo-list" >
          { this.props.list.map(function(item){
              return <SingleItem item={item.item} isComplete={item.isComplete} id={item.id} />
            })}
        </ul> 
      </div>
    )
  }
});

/**
 * @底部--显示条目、筛选、清除等 
 */
var Footer = React.createClass({

  render: function() {
    var nocompletedItemNum = this.props.list.filter(function(item){
      return item.isComplete === false;
    }).length;
    var completedItemNum = this.props.list.length-nocompletedItemNum;

    return ( 
      <div id = "footer" >
        <span id = "todo-count" >
          <strong >{nocompletedItemNum}< /strong>条未完成 
        </span>        
        <button id = "clear-completed" className={completedItemNum>0?'':'hidden'} onClick={TodoAction.clearCompleted}>清除已完成条目({completedItemNum}) < /button> 
      </div>
    )
  }
});

/**
 * @整体渲染 
 */
var TodoAPP = React.createClass({
  mixins: [Reflux.connect(TodoStore,'list')],
  render: function() {

    return ( 
      <div >
        <Header/>
        <Main list={this.state.list} />
        <Footer list={this.state.list} />
      </div>
    )
  }
});

module.exports = TodoAPP;