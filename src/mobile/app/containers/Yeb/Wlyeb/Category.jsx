import React from 'react'
import { Container, Row, ScrollView, Icon } from 'app/components'
import thirdParty from 'app/thirdParty'
import { fromJS, toJS, is }	from 'immutable'
import * as Limit from 'app/constants/Limit.js'

export default
class Category extends React.Component {
	constructor(props) {
		super(props)
		let showList = []
		this.props.data.getIn([this.props.leftIdx, 'children']).map((item,i) => {
			showList.push(item.get('value'))
		})
		this.state = {
			showList: showList//需要展示下级的uuid 列表
        }
    }
	componentWillReceiveProps(nextprops) {
		if(!is(nextprops.leftIdx,this.props.leftIdx)) {
			let showList = []
			nextprops.data.getIn([nextprops.leftIdx, 'children']).map((item,i) => {
				showList.push(item.get('value'))
			})
			this.setState({showList: showList})
        }
	}

	render() {
		const { data, onChange, leftIdx, leftClick } = this.props
		const { showList } = this.state

		const leftValue = data.getIn([leftIdx, 'value'])
		const children = data.getIn([leftIdx, 'children'])

		const loop = (data, paddingLeft) => data && data.map((item, i) => {
			if (item.get('children') && item.get('children').size) {
				const showChild = showList.some(v => v === item.get('value'))
				return (
					<div key={item.get('value')}>
						<Row className='menu-right-item'
							style={{paddingLeft: `${paddingLeft}rem`}}
							onClick={() => onChange([leftValue, item.get('value')])}
						>
							<div className='overElli'>{item.get('label')}</div>
							<Icon
								style={showChild ? {transform: 'rotate(180deg)'} : ''}
								type="arrow-down"
								onClick={(e) => {
									e.stopPropagation()
									let arr = showList
									if (showChild) {
										let idx = arr.findIndex(v => v === item.get('value')) - 1
										if (idx > -1) {
											arr = arr.splice(idx, 1)
										} else {
											arr.shift()
										}
									} else {
										arr.push(item.get('value'))
									}
									this.setState({showList: arr})
								}}
							/>
						</Row>

						{showChild ? loop(item.get('children'), paddingLeft + 0.05) : ''}
					</div>
				)
			} else {
				return <Row key={item.get('value')}
					className='menu-right-item overElli'
					style={{paddingLeft: `${paddingLeft}rem`}}
					onClick={() => onChange([leftValue, item.get('value')])}
				>
					{item.get('label')}
				</Row>
			}

		})


		return(
			<Container className="zhmx-category">
				<ScrollView flex="1" className='wlye-category-menu-scroll'>
					<div className='wlye-category-menu'>
						<div className='menu-left'>
							{
								data.map((v, i) => {
									return (
										<Row
											key={v.get('value')}
											className={`menu-left-item overElli ${leftValue == v.get('value') ? 'menu-left-item-selected' : ''}`}
											onClick={() => leftClick(i)}
										>
											{v.get('label')}
										</Row>
									)
								})
							}
						</div>

						<div className='menu-right'>
							{loop(children, 0.1)}
						</div>
					</div>
				</ScrollView>
			</Container>
		)
	}
}
