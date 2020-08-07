import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import ReactEcharts from 'echarts-for-react'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class AmbLineChar extends React.Component {

	render() {
		const {
            lineData,
			status,
			incomeBigger,
			isCutLineData,
			unit
		} = this.props

		// const showLineData = isCutLineData ? lineData.slice(6) : lineData

		// const xData = showLineData.map(v => `${Number(v.get('name').substr(4,2))}月`).toJS()
		// const amountData = showLineData.map(v => (v.get('amount')/unit).toFixed(2)).toJS()
		const xData = lineData.map(v => `${Number(v.get('name').substr(4,2))}月`).toJS()
		const amountData = lineData.map(v => (v.get('amount')/unit).toFixed(2)).toJS()

		let color = ''
		let lightColor = ''
		let lineColor = ''
		let backgroundColor = ''

		;({
			'收入': () => {
				return color = '#ffa364',
				lightColor = '#fff3ed',
				lineColor = '#ffc8a3',
				backgroundColor = '#fff7f1'
			},
			'支出': () => {
				return color = '#71a4e1',
				lightColor = '#f4f9ff',
				lineColor = '#b8d3ff',
				backgroundColor = '#eff7ff'
			},
			'损益': () => {
				if (incomeBigger) {
					return color = '#ffd092',
					lightColor = '#fff6e9',
					lineColor = '#ffe0b6',
					backgroundColor = '#fffaf3'
				} else {
					return color = '#A1CFFF',
					lightColor = '#F8FBFF',
					lineColor = '#D3E5FF',
					backgroundColor = '#F6FAFF'
				}
			}
		}[status])()

		const data = {
			color: [color],
			tooltip: {
				trigger: 'axis'
			},
			grid: {
				show: true,
				bottom: '30px',
				top: '30px',
				left: '40px',
				right: '40px',
				backgroundColor: backgroundColor,
				borderWidth: 0
			},
			xAxis:  {
				type: 'category',
				boundaryGap: false,
				data: xData,
				axisLine: {
					lineStyle: {
						color: '#333'
					},
				},
				axisLabel: {
					textStyle: {
						fontSize: '14'
					}
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value}'
				},
				axisLine: {
					lineStyle: {
						color: '#fff'
					}
				},
				splitLine: {
					show: true,
					lineStyle:{
						type:'dashed',
						color: lineColor
					}
				}
			},
			series: [
				{
					name:'金额',
					type:'line',
					symbolSize: 8,
					showSymbol: true,
					label: {
						normal: {
							position: 'right'
						}
					},
					areaStyle: {
						normal: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0, color: color // 0% 处的颜色
									}, {
										offset: 1, color: lightColor // 100% 处的颜色
									}
								],
								globalCoord: false // 缺省为 false
							}
						}
					},
					data:amountData,
					markPoint: {
						show: false,
						symbolSize: 15,
						label: {
							normal: {
								textStyle: {
									color: '#2f4554',
									fontSize: 15,
									fontWeight: 'bold'
								},
								position: 'top'
							}
						},
						data: [
							{
								type: 'max',
								name: '最大值'
							}, {
								type: 'min',
								name: '最小值'
							}
						]
					}
				}
			]
		}

		return (
			<ReactEcharts
				option={data}
				className="ambsyb-char"
			/>
		)
	}
}
