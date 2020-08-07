import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import ReactEcharts from 'echarts-for-react'
import { formatMoney } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class AmbPieChar extends React.Component {
	static propTypes = {

	}
	render() {
		const {
			gainAndLoss
		} = this.props

		const income = gainAndLoss.get('income') > 0 ? (gainAndLoss.get('income')/10000).toFixed(2) - 0 : 0
		const pay = gainAndLoss.get('pay') > 0 ? (gainAndLoss.get('pay')/10000).toFixed(2) - 0 : 0
		const ginAndLoss = (gainAndLoss.get('ginAndLoss')/10000).toFixed(2) - 0

		const incomeFormat = formatMoney(income, 2, '')
		const payFormat = formatMoney(pay, 2, '')
		const ginAndLossFormat = formatMoney(ginAndLoss, 2, '')

		// const incomeName = '收入' + Limit.ENTER_TRANSFERRED + incomeFormat
		// const payName = '支出' + Limit.ENTER_TRANSFERRED + payFormat
		// const ginAndLossName = '损益' + Limit.ENTER_TRANSFERRED + ginAndLossFormat
		const incomeName = '收入' + ' ' + incomeFormat
		const payName = '支出' + ' ' + payFormat
		const ginAndLossName = ginAndLossFormat + Limit.ENTER_TRANSFERRED + '损益'

		const incomeColor = '#ffa364'
		const lightIncomeColor = '#ffbe92'
		const payColor = '#5ca7f2'
		const lightPayColor = '#8dc1f6'

		let innerData = []
		let ourterData = []

		const transparentItemStyle = {
			normal: {
				color: 'transparent'
			}
		}


		if (income > pay) {
			const incomeBigger = ginAndLoss <= pay
			innerData = [
				{
					value: pay,
					name: ``,
					itemStyle: transparentItemStyle
				},
				{
					value: ginAndLoss,
					name: ginAndLossName,
					label: {
						normal: {
							position: 'center',
							textStyle: {
								fontSize: 17,
								fontWeight: 'bold'
							}
						}
					},
					itemStyle: {
						normal: {
							color: lightIncomeColor,
							borderWidth: 1,
							borderColor: lightIncomeColor
						}
					}
				},
				{
					value: pay,
					name: ``,
					itemStyle: transparentItemStyle
				}
			]
			ourterData = [
				{
					value: pay,
					name: payName,
					itemStyle: {
						normal: {
							color: payColor
						}
					}
				},
				{
					value: ginAndLoss,
					name: `${incomeBigger ? '' : incomeName}`,
					itemStyle: {
						normal: {
							color: incomeColor,
							borderWidth: 1,
							borderColor: lightIncomeColor
						}
					},
					label: {
						normal: {
							show: false
						}
					}
				}, {
					value: pay,
					name: `${incomeBigger ? incomeName : ''}`,
					itemStyle: {
						normal: {
							color: incomeColor
						}
					},
					label: {
						normal: {
							show: false
						}
					}
				}
			]
		} else if (income < pay) {
			const gainAndLossBigger = -ginAndLoss > income
			innerData = [
				{
					value: income,
					name: ``,
					itemStyle: transparentItemStyle
				},
				{
					value: -ginAndLoss,
					name: ginAndLossName,
					label: {
						normal: {
							position: 'center',
							textStyle: {
								fontSize: 17
							},
						}
					},
					itemStyle: {
						normal: {
							color: lightPayColor,
							borderWidth: 1,
							borderColor: lightPayColor
						}
					}
				},
				{
					value: income,
					name: ``,
					itemStyle: transparentItemStyle
				}
			]
			ourterData = [
				{
					value: income,
					name: `${gainAndLossBigger ? '' : payName}`,
					itemStyle: {
						normal: {
							color: payColor
						}
					},
					label: {
						normal: {
							show: false
						}
					}
				}, {
					value: -ginAndLoss,
					name: `${gainAndLossBigger ? payName : ''}`,
					itemStyle: {
						normal: {
							color: payColor,
							borderColor: lightPayColor
						}
					},
					label: {
						normal: {
							show: false
						}
					}
				}, {
					value: income, name: incomeName,
					itemStyle: {
						normal: {
							color: incomeColor
						}
					}
				}
			]
		} else if (income == pay) {
			innerData = [
				{
					value: ginAndLoss,
					name: `损益${ginAndLossFormat}`,
					label: {
						normal: {
							position: 'center',
							textStyle: {
								fontSize: 17
							}
						}
					},
					itemStyle: transparentItemStyle
				}
			]
			ourterData = [
				{
					value: pay,
					name: payName,
					itemStyle: {
						normal: {
							color: payColor
						}
					}
				},
				{
					value: income,
					name: incomeName,
					itemStyle: {
						normal: {
							color: incomeColor
						}
					}
				}
			]
		}


		const data = {
			series: [
				{
					name:'收入',
					type:'pie',
					silent: true,
					minAngle: 1,
					radius: ['10%', '55%'],
					center:['50%','60%'],
					label: {
						normal: {
							textStyle: {
								color: '#666'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: innerData
				}, {
					minAngle: 1,
					label: {
						normal: {
							show: false
						}
					},
					silent: true,
					name:'比例',
					type:'pie',
					radius: ['55%', '70%'],
					center:['50%','60%'],
					data: ourterData
				}
			]
		}

		return (
			<ReactEcharts
				className="amb-piechar"
				option={data}
			/>
		)
	}
}
