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
			this.setState({segs:segs,segnow:segnow});
		}
	}
	,goSeg:function(segnow) {
		this.setState({segnow:segnow});
		this.props.onGoSegment&&this.props.onGoSegment(this.state.segs[segnow]);
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
	,onChange:function(e) {
		var seg=e.target.value;
		var idx=this.state.segs.indexOf(seg);
		if (idx>-1) this.goSeg(idx);
	}
	,render : function() {
		var segname=this.state.segs[this.state.segnow];
		return E("div",null,
			E(this.btn,{onClick:this.prev,disabled:this.state.segnow==0},"←"),
			E("input",{value:segname,onChange:this.onChange}),
			E(this.btn,{onClick:this.next,disabled:this.state.segnow==this.state.segs.length-1},"→")
		);
	}
})
module.exports=SegNav;