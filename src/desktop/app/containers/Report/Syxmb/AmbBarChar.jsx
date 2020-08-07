import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import ReactEcharts from 'echarts-for-react'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class AmbBarChar extends React.Component {

	render() {
		const {
			barData,
			style,
			status,
			className,
			incomeBigger,
			unit,
			sliceSix
		} = this.props

		let color = ''
		let lightColor = ''
		let lineColor = ''
		let backgroundColor = ''
		let zeroLineColor = ''

		;({
			'收入': () => {
				return color = '#ffa364',
				lightColor = '#fff3ed',
				lineColor = '#ffc8a3',
				backgroundColor = '#fff7f1',
				zeroLineColor = '#ff9f5e'
			},
			'支出': () => {
				return color = '#71a4e1',
				lightColor = '#f4f9ff',
				lineColor = '#b8d3ff',
				backgroundColor = '#eff7ff',
				zeroLineColor = '#75a9ff'
			},
			'损益': () => {
				if (incomeBigger) {
					return color = '#ffd092',
					lightColor = '#fff6e9',
					lineColor = '#ffe0b6',
					backgroundColor = '#fffaf3',
					zeroLineColor = '#FFBC63'
				} else {
					return color = '#A1CFFF',
					lightColor = '#F8FBFF',
					lineColor = '#D3E5FF',
					backgroundColor = '#F6FAFF',
					zeroLineColor = '#A1CFFF'
				}

			}
		}[status])()

		var labelRight = {
			normal: {
				position: 'right'
			}
		};

		const xData = barData.filter((v,i) => sliceSix?i<6:true).map(v => v.get('name')).toJS().reverse()
		// const xData = ['sdfsdf', 'sdf', 'sdfsdf']
		const total = barData.reduce((pre,cur) => pre+Number(cur.get('amount')),0).toFixed(2)
		let amountData = []
		barData.filter((v,i) => sliceSix?i<6:true).map(v => {
			if (v.get('amount') < 0) {
				amountData.push({
					value: (v.get('amount')/unit).toFixed(2),
					label: labelRight,
					itemStyle: {
						normal: {
							color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 1,
							y2: 0,
							colorStops: [{
								offset: 0, color: color // 0% 处的颜色
							}, {
								offset: 1, color: lightColor // 100% 处的颜色
							}],
							globalCoord: false // 缺省为 false
						}
						}
					}
				})
			} else {
				amountData.push((v.get('amount')/unit).toFixed(2))
			}

		})

		amountData.reverse()
		// amountData = [2342, 345, 35]



		const data = {
			color: ['#ff7b43'],
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				},
				formatter: function (params) {
					const size = barData.filter((v,i) => sliceSix?i<6:true).size
					const amount = barData.getIn([size-1-params[0].dataIndex,'amount'])
					let percent = (percent = amount/total*100) && total != 0  ? percent.toFixed(2) : '-'
					return `<span>
						${params[0].name}
						<br/>
						● 金额：${(amount/unit).toFixed(2)}
						<br/>
						● 占比：${percent}%
					</span>`
				}
			},
			grid: {
				show: true,
				top: 29,
				bottom: 30,
				left: '40px',
				right: '40px',
				backgroundColor: backgroundColor,
				borderWidth: 0
			},
			xAxis : {
				type : 'value',
				position: 'botton',
				axisLabel: {
					textStyle: {
						fontSize: '14'
					}
				},
				splitLine: {
					lineStyle:{
						type:'dashed',
						color: lineColor
					}
				}
			},
			yAxis : {
				type : 'category',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				data : xData,
				axisLabel: {
					inside: true,
					textStyle: {
						color: '#000',
						position: 'insideLeft',
						fontSize: '14'
					}
				},
				z: 10
			},
			series : [
				{
					name:'金额',
					type:'bar',
					itemStyle: {
						normal: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 1,
								y2: 0,
								colorStops: [{
									offset: 0, color: lightColor // 0% 处的颜色
								}, {
									offset: 1, color: color // 100% 处的颜色
								}],
								globalCoord: false // 缺省为 false
							}
						}
					},
					barWidth: '40%',
					data: amountData,
					markLine: {
						symbol: '',
						lineStyle: {
							normal: {
								color: zeroLineColor,
								width: 2
							}
						},
						label: {
							normal: {
								show: false
							}
						},
						data: [
							{
								xAxis: 0
							}
						]
					}
				},
			]
		}

		return (
			<div style={style}>
				<ReactEcharts
					option={data}
					className={className}
				/>
			</div>
		)
	}
}
