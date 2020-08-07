import React, { PropTypes }	from 'react'
import { Map, List, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, Icon } from 'app/components'
import { Popover } from 'antd-mobile'
const Item = Popover.Item

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@immutableRenderDecorator
export default
class RunningItem extends React.Component {

	static displayName = 'RunningItem'

	state = {
		visible:false
	}
	closeMask () {
		const ScrollView = document.getElementsByClassName('scroll-view')
		ScrollView[0].style.overflowY = 'auto'
		this.setState({visible:false})
	}
	render() {
		const {
			style,
			hasSub,
			isExpanded,
			item,
			uuid,
			selectable,
			allItemCheckBoxDisplay,
			allItemModifyButtonDisplay,
			dispatch,
			leve,
			runningSelect,
			isChangePoistion,
			history,
			listType,
			lastItemUuid,
			nextItemUuid
		} = this.props

		const categoryType = item.get('categoryType')
		const beSpecial = item.get('beSpecial')
		let overlay = []
		if(lastItemUuid) {
			overlay.push(<Item key="3" value="up"  >上移</Item>)
		}
		if (nextItemUuid) {
			overlay.push(<Item key="4" value="down"  >下移</Item>)
		}
		const leveHolder = ({
			1: () => '',
			2: () => <span className='ac-flag' style={{width:'.1rem',backgroundColor:'#D1C0A5'}}></span>,
			3: () => <span className='ac-flag' style={{width:'.2rem',backgroundColor:'#7E6B5A'}}></span>,
			4: () => <span className='ac-flag' style={{width:'.3rem',backgroundColor:'#59493f'}}></span>
		}[leve])()

		let uuidList = [item.get('uuid')]
		const loop = (childList) => {
			childList && childList.size && childList.map(v => {
				uuidList.push(v.get('uuid'))
				v.get('childList').size && loop(v.get('childList'))
				v.get('disableList') && v.get('disableList').size && loop(v.get('disableList'))
			})
		}
		loop(item.get('childList'))
		loop(item.get('disableList'))

		return (
			<div className="running-config-category-item-wrap" style={style}>
				<div className="running-config-category-item">
					<Checkbox
						className="running-config-category-item-checkbox"
						style={{display: allItemCheckBoxDisplay ? '' : 'none'}}
						checked={runningSelect.indexOf(item.get('uuid')) > -1}
						disabled={selectable? false : true}
						onClick={(e) => {
							if (selectable) {
								dispatch(runningConfActions.selectItem(item.get('uuid'),uuidList))
							}
						}}
					/>
					<Icon
						style={{
							display: allItemModifyButtonDisplay ? '' : 'none',
							color:'#5d81d1',
							marginRight: '.05rem',
							visibility:(item.get('categoryType') == 'LB_ZB'
							|| item.get('name') == '增值税' && item.get('parentName') === '税费支出')
							|| leve >= 4
							|| (categoryType === 'LB_JK' || categoryType === 'LB_ZFKX' || categoryType === 'LB_XCZC') && leve>=3? 'hidden' : ''
						}}
						type="add-plus-fill"
						// color={item.get('acid').length === 10 ? '#ccc' : '#38ADFF'}
						size="18"
						onClick={(e) => {
							dispatch(runningConfActions.beforeInsertRunningConf(item, history))
						}}
					/>
					{
						isChangePoistion && leve > 1 && (lastItemUuid || nextItemUuid)?
						<Popover
							visible={this.state.visible}
							overlay={overlay}
							align={{
								overflow: { adjustY: 0, adjustX: 0 },
								offset: [1, 0],
							}}
							// mask={true}
							placement='bottomLeft'
							onSelect={(e) => {
								switch (e.props.value) {
									case 'up':
										dispatch(allRunningActions.swapRunningItem(item.get('uuid'),lastItemUuid))
										break
									case 'down':
										dispatch(allRunningActions.swapRunningItem(item.get('uuid'),nextItemUuid))
										break
									default:
								}
								this.closeMask()
							}}
						>
							<span style={{
								height: '100%',
								width:'.2rem',
								display: 'flex',
								alignItems: 'center',
								marginRight: '.04rem'
								}}
							>
								<Icon
									onClick={() => {
										this.setState({visible:true})
										const ScrollView = document.getElementsByClassName('scroll-view')
										ScrollView[0].style.overflowY = 'hidden'
									}}
									type="swap-position"
									color={'#5d81d1'}
									size="18"
								/>
							</span>
						</Popover>:''
					}
					{leveHolder}
					<div className="running-config-category-item-name-wrap" >
						<span
							className={(leve !== 1 || leve === 1 && beSpecial) ? "running-config-category-item-name running-config-category-item-name-underline" : "running-config-category-item-name"}
							style={item.get('remark') ? {} : {lineHeight:'.35rem'} }
							onClick={(e) => {
								if (allItemCheckBoxDisplay && selectable) {
									dispatch(runningConfActions.selectItem(item.get('uuid'),uuidList))
								} else {
									(leve !== 1 || leve === 1 && beSpecial) && dispatch(runningConfActions.beforeModifyRunningConfRunning(item, history))
								}
							}}
						>
							{` ${item.get('name')}`}
						</span>
						{ item.get('remark') ? <span className="running-config-category-item-name-remark"> {item.get('remark')} </span> : '' }
					</div>
					<div className="running-config-category-item-icon" onClick={(e) => {e.stopPropagation();hasSub && dispatch(runningConfActions.toggleLowerItem(item.get('uuid')))}}>
						<Icon type="arrow-down"
							style={{
								display : hasSub && isExpanded !== 'displaynone' ? '' : 'none',
								transform: isExpanded ? 'rotate(180deg)' : ''
							}}
						/>
					</div>
				</div>
				<div className="choose-type" style={{display:this.state.visible?'block':'none'}}
					onClick={(e) => {
						e.stopPropagation()
						this.closeMask()
					}}
				></div>
			</div>
		)
	}
}
