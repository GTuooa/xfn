import React, { PropTypes } from 'react'
import { Map, List, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
// import * as fzhsActions from 'app/actions/fzhs.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import * as Limit from 'app/constants/Limit.js'
import { Select, message, Tooltip } from 'antd'
const Option = Select.Option
const OptionGroup = Select.OptGroup
import * as thirdParty from 'app/thirdParty'

@immutableRenderDecorator
export default
class CombSelect extends React.Component{

	constructor() {
		super()
		this.state = {
			assFocus: false,
			oneClick: true
		}
	}

	componentDidUpdate() {
		if (this.props.focus) {
			const assFocus = this.state.assFocus
			const assLength = this.props.finnalAssList.size

			if (this.props.finnalAssList.size) {
				assFocus || assFocus === 0 ? this.refs['ass' + assFocus % assLength].getElementsByTagName('input')[0].focus() : this.refs[this.props.id + '-1'].focus()
			} else {
				this.refs[this.props.id].getElementsByTagName('input')[0].focus()
			}
		}
	}

	// 修改在录凭证时同时修改辅助时的特殊处理
	componentWillReceiveProps(nextprops) {
		if (this.props.acValue === nextprops.acValue && nextprops.finnalAssList.size !== nextprops.jvAssList.size) {
			this.setState({assFocus: false})
			const assIsDrop = this.props.focus
			this.props.dispatch(lrpzActions.refreshAcItemAsslist(this.props.id, nextprops.finnalAssList, assIsDrop))
		}
	}

	render() {

		const {
			className,
			onChange,
			id,
			focus,
			onClick,
			acValue,
			allAssValue,
			allAssValueOne,
			allAssValueTwo,
			dispatch,
			selectAcList,
			finnalAssList,
			assDropListFull,
			jvAssList,
			onAssChange,
			cancleAssInput,
			showAssDisableInfo
		} = this.props
		const { oneClick } = this.state
		const assFocus = this.state.assFocus === 0 ? this.state.assFocus : -1

		const acList = selectAcList.map((v, i) => {   //过滤出没有下级的科目
			const curentacid = v.get('acid')
			const nextacid = selectAcList.getIn([i + 1, 'acid'])
			return v.set('hasSub', !!nextacid && nextacid.indexOf(curentacid) === 0)
		}).filter(v => !v.get('hasSub'))

		const showText = allAssValue ? (
				<div className="text-show">
					<span>
						{acValue}
					</span>
					{/* <span className="text-show-fzhs">
						{'辅助核算:' + allAssValue}
					</span> */}
					<span className="text-show-fzhs">
						{'辅助核算:' + allAssValueOne}
					</span>
					{
						allAssValueTwo ?
						<span className="text-show-fzhs">
							{'辅助核算:' + allAssValueTwo}
						</span> : ''
					}
				</div>
			) : (
				<div className="text-show">
					<span>
						{acValue}
					</span>
				</div>
			)
			
		return (
			<div
				className={`combselect${className ? ' ' + className : ''} combselect-select-focus`}
				ref={id}
				onClick={() => {
					if (!allAssValue && acValue && oneClick) {
						this.setState({oneClick: false})
						onChange(acValue)
					}
					onClick()

				}}
				onKeyUp={e => e.keyCode == 13 && this.setState({assFocus: assDropListFull && (assFocus + 1)})}
				>
				{/*<div className="combselect-ass-mask" onClick={() => message.warn('辅助核算不能为空')} style={{display: assDropListFull ? 'block' : 'none'}}></div>*/}
				<div className="text-show-wrap">
					{showText}
				</div>
				<Select
					showSearch
					className={focus ? "combselect-select combselect-select-focus" : "combselect-select"}
					optionFilterProp={"children"}
					notFoundContent="无法找到相应科目"
					value={acValue}
					onChange={value => value || onChange(value)}
					onSelect={onChange}
					style={{opacity: focus ? 1 : 0, display: !finnalAssList.size && focus ? 'block' : 'none'}}
					>
						{acList.map((v,i) =>
							(<Option key={i} value={`${v.get('acid')} ${v.get('acfullname')}`}>
								{`${v.get('acid')}${Limit.AC_ID_AND_NAME_CONNECT}${v.get('acfullname')}`}
							</Option>)
						)}
				</Select>
				<div
					className="asslist-input"
					style={{opacity: focus ? 1 : 0, display: finnalAssList.size && focus ? 'block' : 'none'}}
					>
					<input
						ref={id + '-1'}
						value={acValue}
						className="asslist-input-focus"
						onChange={e => cancleAssInput(e.target.value)}
					/>
					<div className="asslist-select-wrap" >
						{finnalAssList && finnalAssList.size === jvAssList.size && finnalAssList.map((v, i) => (
							<div key={v.get('asscategory')} ref={"ass" + i}>
								{/* <span className="asslist-label">{v.get('asscategory') + ':'}</span> */}
								<Tooltip placement="bottom" title={v.get('asscategory').length > 4 ? v.get('asscategory') : ''}>
									<span className="asslist-label">
										<span className="asslist-label-ass">{v.get('asscategory').length > 4 ? v.get('asscategory').slice(0,4)+'...' : v.get('asscategory')}</span>
										<span>:</span>
									</span>
								</Tooltip>
								<Select
									showSearch
									dropdownMatchSelectWidth={false}
									className={assFocus === i || focus ? 'asslist-select asslist-select-focus' : 'asslist-select'}
									optionFilterProp={"children"}
									value={jvAssList.size ? jvAssList.find(w => w.get('asscategory') == v.get('asscategory') ).get('assname') : ''}
									// onChange={value => value || onAssChange(v.get('asscategory'), value)}
									// onSelect={value => onAssChange(v.get('asscategory'), value)}
									onChange={value => {
										if (value === '') {
											onAssChange(v.get('asscategory'), value, i)
										} else {
											return value
										}
										this.setState({assFocus: i})
									}}
									onSelect={value => {
										this.setState({assFocus: i})
										onAssChange(v.get('asscategory'), value, i)
									}}
									onFocus={() => {
										// if (showAssDisableInfo.get(i)) {
										// 	const selectAssList = v.get('asslist').filter(v => !v.get('disableTime'))
										// 	if (!selectAssList.size) {
										// 		dispatch(lrpzActions.showAssDisableModal(v.get('asscategory')))
										// 		// thirdParty.Alert(`${v.get('asscategory')}中所有的核算项目为禁用状态，您可以：1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；2、在当前页面，“新增”新的核算项目`)
										// 	}
										// 	dispatch(lrpzActions.changeShowAssDisableInfo(i))
										// }

										const selectAssList = v.get('asslist').filter(v => !v.get('disableTime'))
										if (!selectAssList.size) {
											dispatch(lrpzActions.showAssDisableModal(v.get('asscategory')))
										}
									}}
									>
										{/* {v.get('asslist').map(w => ( */}
										{v.get('asslist').filter(v => !v.get('disableTime')).map(w => (
											<Option key={w.get('assid')} value={w.get('assid') + Limit.ASS_ID_AND_NAME_CONNECT + w.get('assname')}>{w.get('assid') + ' ' + w.get('assname')}</Option>
										))}
								</Select>
								<span className="asslist-new"
									onClick={() => {
										const asscategory = v.get('asscategory')
										sessionStorage.setItem('enterLrModal', 'lrpz')
										sessionStorage.removeItem('handleAssCustom')
										// dispatch(allActions.usersUseLog('lrpz_newAss'))
										dispatch(lrpzActions.changeLrFzhsModalDisplay())
										dispatch(lrpzActions.changeLrAssCategory(asscategory))
										dispatch(lrpzActions.getAssNextCode(asscategory))
									}}
									>
									新增
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}
}
