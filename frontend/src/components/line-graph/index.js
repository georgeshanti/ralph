import React from 'react';

class LineGraph extends React.Component {
	constructor(props){
		super(props);
		this.state = this.props.config;
	}

	componentDidMount(){
	}

	render(){
		var points = "";
		var viewBox = this.props.xMin+" "+this.props.yMin+" "+this.props.xMax+" "+this.props.yMax;
		for(var point of this.props.points){
			points += point.x+","+point.y+" "
		}
		return (
			<svg viewBox={viewBox} width={"100%"} height="100%" style={{background: (this.props.backgroundColor || "white")}}>
				<defs>
					<pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
						<path d="M 20 0 L 0 0 0 20" fill="none" stroke={this.props.gridColor || "gray"} strokeWidth="0.5"/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#smallGrid)" />
				<polyline
					fill="none"
					stroke={this.props.lineColor || "#0074d9"}
					strokeWidth="2"
					points={points}/>
			</svg>
		);
	}
}

export default LineGraph;
