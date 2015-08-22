var React=require("react/addons");

var E=React.createElement;
var PT=React.PropTypes;
var SegNav=React.createClass({
	mixins:[React.addons.PureRender]
	,propTypes:{
		"segpat":PT.string
		,"value":PT.string
		,"segs":PT.array.isRequired
		,"onGoSegment":PT.func
	}
	,getInitialState:function() {
		return {segs:this.props.segs};
	}
	,componentWillMount:function() {
		this.btn=this.props.button||"button";
		if (this.props.segpat) {
			var regex=new RegExp(this.props.segpat);
			var segnames={};
			this.props.segs.forEach(function(seg){
				var m=seg.match(regex);
				if (m && !segnames[m[1]]) segnames[m[1]]=true;
			});
			var segs=Object.keys(segnames);
			var segnow=segs.indexOf(this.props.value)||0;
			this.setState({segs:segs,segnow:segnow,segname:this.state.segs[segnow]});
		}
	}
	,componentWillReceiveProps:function(nextProps,nextState) {
		var idx=nextProps.segs.indexOf(nextProps.value);
		if (idx>-1) {
			this.setState({segnow:idx,segname:this.state.segs[idx]});
		}
		if (this.state.segs!==nextProps.segs) this.setState({segs:nextProps.segs});
		
	}
	,goSeg:function(idx) {
		this.setState({segnow:idx,segname:this.state.segs[idx]});
		this.props.onGoSegment&&this.props.onGoSegment(this.state.segs[idx]);
	}
	,prev:function() {
		var segnow=this.state.segnow;
		if (segnow>0) segnow--;
		this.goSeg(segnow);
	}
	,next:function(){
		var segnow=this.state.segnow;
		if (segnow<this.state.segs.length-1) segnow++;
		this.goSeg(segnow);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			var idx=this.state.segs.indexOf(e.target.value);
			if (idx>-1) this.goSeg(idx);
		}
	}
	,onChange:function(e) {
		var segname=e.target.value;
		var idx=this.state.segs.indexOf(segname);
		this.setState({segname:segname});
		clearTimeout(this.timer);
		this.timer=setTimeout(function(){
			if (idx>-1) this.goSeg(idx);
			else {
				this.refs.seg.getDOMNode().value=this.state.segs[this.state.segnow];
			}
		}.bind(this),2000);
	}
	,render : function() {
		return E("span",null,
			E(this.btn,{style:this.props.style,onClick:this.prev,disabled:this.state.segnow==0},"←"),
			E("input",{size:this.props.size||8,style:this.props.style,ref:"seg",value:this.state.segname,onKeyPress:this.onKeyPress,onChange:this.onChange}),
			E(this.btn,{style:this.props.style,onClick:this.next,disabled:this.state.segnow==this.state.segs.length-1},"→")
		);
	}
})
module.exports=SegNav;