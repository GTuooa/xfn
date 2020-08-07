// import React, { PropTypes } from 'react'
// import { Map, toJS } from 'immutable'
// import { connect }	from 'react-redux'

// import * as allActions from 'app/redux/Home/All/soblist.action'
// import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action'
// import { Checkbox, Icon, Container, ScrollView, Switch } from 'app/components'

// @connect(state => state)
// export default
// class FunSelect extends React.Component {

// 	render() {
// 		const {
// 			sobConfigState,
// 			dispatch
// 		} = this.props

// 		const sobConfigMode = sobConfigState.get('sobConfigMode')
// 		const sobSelectedIndex = sobConfigState.get('sobSelectedIndex')

// 		const selectedSob = sobConfigState.get('tempSob')
// 		const template = selectedSob.get('template') || '0'

// 		const moduleInfo = selectedSob.get('moduleInfo')
// 		const running = moduleInfo.get('RUNNING')
// 		const gl = moduleInfo.get('GL')
// 		const runningGl = moduleInfo.get('RUNNING_GL')
// 		const assets = moduleInfo.get('ASSETS')
// 		const enclosureRun = moduleInfo.get('ENCLOSURE_RUN')
// 		const currency = moduleInfo.get('CURRENCY')
// 		const ass = moduleInfo.get('ASS')
// 		const amb = moduleInfo.get('AMB')
// 		const enclosureGl = moduleInfo.get('ENCLOSURE_GL')
// 		const number = moduleInfo.get('NUMBER')

// 		const templateTypeZN = ['3']
// 		const templateTypeKJ = ['4', '5']

// 		return (
// 			<Container>
// 				<ScrollView flex="1">
// 					<ul className="sob-fun-select-list">
// 						{
// 							runningGl && templateTypeZN.indexOf(template) > -1 ?
// 							<li
// 								className="sob-fun-select-item"
// 								onClick={() => {
// 									if (running.get('beOpen')) {
// 										dispatch(sobConfigActions.sobOptionChangeFunModuel(runningGl, !runningGl.get('beOpen')))
// 									}
// 								}}
// 							>
// 								<span className="sob-fun-select-label">{runningGl.get('moduleName')}</span>
// 								<Switch
// 									checked={runningGl.get('beOpen')}
// 									onClick={() => {}}
// 								/>
// 							</li>
// 							: ''
// 						}
// 						{/* {
// 							enclosureRun && templateTypeZN.indexOf(template) > -1 ?
// 							<li
// 								className="sob-fun-select-item"
// 								onClick={() => {
// 									if (running.get('beOpen')) {
// 										dispatch(sobConfigActions.sobOptionChangeFunModuel(enclosureRun, !enclosureRun.get('beOpen')))
// 									}
// 								}}
// 							>
// 								<span className="sob-fun-select-label">{enclosureRun.get('moduleName')}</span>
// 								<Switch
// 									checked={enclosureRun.get('beOpen')}
// 									onClick={() => {}}
// 								/>
// 							</li>
// 							: ''
// 						} */}
// 						{
// 							currency && templateTypeKJ.indexOf(template) > -1 ?
// 							<li
// 								className="sob-fun-select-item"
// 								onClick={() => {
// 									if (gl.get('beOpen')) {
// 										dispatch(sobConfigActions.sobOptionChangeFunModuel(currency, !currency.get('beOpen')))
// 									}
// 								}}
// 							>
// 								<span className="sob-fun-select-label">{currency.get('moduleName')}</span>
// 								<Switch
// 									checked={currency.get('beOpen')}
// 									onClick={() => {}}
// 								/>
// 							</li>
// 							: ''
// 						}
// 						{
// 							ass && templateTypeKJ.indexOf(template) > -1 ?
// 							<li
// 								className="sob-fun-select-item"
// 								onClick={() => {
// 									if (gl.get('beOpen')) {
// 										dispatch(sobConfigActions.sobOptionChangeFunModuel(ass, !ass.get('beOpen')))
// 									}
// 								}}
// 							>
// 								<span className="sob-fun-select-label">{ass.get('moduleName')}</span>
// 								<Switch
// 									checked={ass.get('beOpen')}
// 									onClick={() => {}}
// 								/>
// 							</li>
// 							: ''
// 						}
// 						{
// 							assets && templateTypeKJ.indexOf(template) > -1 ?
// 							<li
// 								className="sob-fun-select-item"
// 								onClick={() => {
// 									if (gl.get('beOpen')) {
// 										dispatch(sobConfigActions.sobOptionChangeFunModuel(assets, !assets.get('beOpen')))
// 									}
// 								}}
// 							>
// 								<span className="sob-fun-select-label">{assets.get('moduleName')}</span>
// 								<Switch
// 									checked={assets.get('beOpen')}
// 									onClick={() => {}}
// 								/>
// 							</li>
// 							: ''
// 						}
// 						{
// 							number && templateTypeKJ.indexOf(template) > -1 ?
// 							<li
// 								className="sob-fun-select-item"
// 								onClick={() => {
// 									if (gl.get('beOpen')) {
// 										dispatch(sobConfigActions.sobOptionChangeFunModuel(number, !number.get('beOpen')))
// 									}
// 								}}
// 							>
// 								<span className="sob-fun-select-label">{number.get('moduleName')}</span>
// 								<Switch
// 									checked={number.get('beOpen')}
// 									onClick={() => {}}
// 								/>
// 							</li>
// 							: ''
// 						}
// 						{
// 							amb && templateTypeKJ.indexOf(template) > -1 && !(ass && !ass.get('beOpen')) ?
// 							<li
// 								className="sob-fun-select-item"
// 								onClick={() => {
// 									if (gl.get('beOpen')) {
// 										dispatch(sobConfigActions.sobOptionChangeFunModuel(amb, !amb.get('beOpen')))
// 									}
// 								}}
// 							>
// 								<span className="sob-fun-select-label">{amb.get('moduleName')}</span>
// 								<Switch
// 									checked={amb.get('beOpen')}
// 									onClick={() => {}}
// 								/>
// 							</li>
// 							: ''
// 						}
// 						{/* {
// 							enclosureGl && templateTypeKJ.indexOf(template) > -1 ?
// 							<li
// 								className="sob-fun-select-item"
// 								onClick={() => {
// 									if (enclosureGl.get('beOpen')) {
// 										dispatch(sobConfigActions.sobOptionChangeFunModuel(enclosureGl, !enclosureGl.get('beOpen')))
// 									}
// 								}}
// 							>
// 								<span className="sob-fun-select-label">{enclosureGl.get('moduleName')}</span>
// 								<Switch
// 									checked={enclosureGl.get('beOpen')}
// 									onClick={() => {}}
// 								/>
// 							</li>
// 							: ''
// 						} */}
// 					</ul>
// 				</ScrollView>
// 			</Container>
// 			// <div className="sob-option-fun-row">
// 			// 	<div className="sob-option-fun-modal">
// 			// 		{
// 			// 			running && templateTypeZN.indexOf(template) > -1 ?
// 			// 			<div className="sob-option-fun-modal-wrap">
// 			// 				<span>
// 			// 					<span
// 			// 						onClick={() => {
// 			// 							if (templateTypeZN.indexOf(template) > -1) {
// 			// 								if ((gl && gl.get('beOpen')) || !running.get('beOpen')) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(running, !running.get('beOpen')))
// 			// 								}
// 			// 							}
// 			// 						}}
// 			// 						className={running.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 						style={{display: running ? '' : 'none'}}
// 			// 					>
// 			// 						{running.get('moduleName')}
// 			// 					</span>
// 			// 				</span>
// 			// 				<span className={running.get('beOpen') ? '' : 'not-limit-check'}>
// 			// 					{
// 			// 						runningGl ?
// 			// 						<span
// 			// 							onClick={() => {
// 			// 								if (running.get('beOpen')) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(runningGl, !runningGl.get('beOpen')))
// 			// 								}
// 			// 							}}
// 			// 							className={runningGl.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 							style={{display: runningGl ? '' : 'none'}}
// 			// 						>
// 			// 							{runningGl.get('moduleName')}
// 			// 						</span>
// 			// 						: ''
// 			// 					}
// 			// 				</span>
// 			// 				{/* <span className={running.get('beOpen') ? '' : 'not-limit-check'}>
// 			// 					{
// 			// 						enclosureRun ?
// 			// 						<span
// 			// 							onClick={() => {
// 			// 								if (running.get('beOpen')) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(enclosureRun, !enclosureRun.get('beOpen')))
// 			// 								}
// 			// 							}}
// 			// 							className={enclosureRun.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 							style={{display: enclosureRun ? '' : 'none'}}
// 			// 						>
// 			// 							{enclosureRun.get('moduleName')}
// 			// 						</span>
// 			// 						: ''
// 			// 					}
// 			// 				</span> */}
// 			// 				<span></span>
// 			// 				<span></span>
// 			// 			</div>
// 			// 			: ''
// 			// 		}
// 			// 		{/* 总账 */}
// 			// 		{
// 			// 			gl && templateTypeKJ.indexOf(template) > -1 ?
// 			// 			<div className="sob-option-fun-modal-wrap">
// 			// 				<span>
// 			// 					<span
// 			// 						onClick={() => {
// 			// 							if((running && running.get('beOpen')) || !gl.get('beOpen')){
// 			// 								dispatch(sobConfigActions.sobOptionChangeFunModuel(gl, !gl.get('beOpen')))
// 			// 							}
// 			// 						}}
// 			// 						className={gl.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 					>
// 			// 						{gl.get('moduleName')}
// 			// 					</span>
// 			// 				</span>
// 			// 				<span className={gl.get('beOpen') ? '' : 'not-limit-check'}>
// 			// 					{
// 			// 						currency ?
// 			// 						<span
// 			// 							onClick={(e) => {
// 			// 								if (gl.get('beOpen')) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(currency, !currency.get('beOpen')))
// 			// 								}
// 			// 							}}
// 			// 							className={currency.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 							style={{display: currency && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
// 			// 						>
// 			// 							{currency.get('moduleName')}
// 			// 						</span>
// 			// 						: <span></span>
// 			// 					}
// 			// 				</span>
// 			// 				<span className={running && running.get('beOpen') ? 'not-limit-check' : ''}>
// 			// 					{
// 			// 						ass ?
// 			// 						<span
// 			// 							onClick={() => {
// 			// 								if (!(running && running.get('beOpen')) && gl.get('beOpen')) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(ass, !ass.get('beOpen')))
// 			// 								}
// 			// 							}}
// 			// 							className={ass.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 							style={{display: ass && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
// 			// 						>
// 			// 							{ass.get('moduleName')}
// 			// 						</span>
// 			// 						: <span></span>
// 			// 					}
// 			// 				</span>
// 			// 				<span className={gl.get('beOpen') ? '' : 'not-limit-check' }>
// 			// 					{
// 			// 						assets ?
// 			// 						<span
// 			// 							onClick={() => {
// 			// 								if (gl.get('beOpen')) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(assets, !assets.get('beOpen')))
// 			// 								}
// 			// 							}}
// 			// 							className={assets.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 							style={{display: assets && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
// 			// 						>
// 			// 							{assets.get('moduleName')}
// 			// 						</span>
// 			// 						: ''
// 			// 					}
// 			// 				</span>
// 			// 				<span></span>
// 			// 				<span className={gl.get('beOpen') ? '' : 'not-limit-check'}>
// 			// 					{
// 			// 						number ?
// 			// 						<span
// 			// 							onClick={() => {
// 			// 								if (gl.get('beOpen')) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(number, !number.get('beOpen')))
// 			// 								}
// 			// 							}}
// 			// 							className={number.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 							style={{display: number && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
// 			// 						>
// 			// 							{number.get('moduleName')}
// 			// 						</span>
// 			// 						: ''
// 			// 					}
// 			// 				</span>
// 			// 				<span className={ass && ass.get('beOpen') ? '' : 'not-limit-check'}>
// 			// 					{
// 			// 						amb ?
// 			// 						<span
// 			// 							onClick={() => {
// 			// 								if (!(ass && !ass.get('beOpen'))) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(amb, !amb.get('beOpen')))
// 			// 								}
// 			// 							}}
// 			// 							className={amb.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 							style={{display: amb && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
// 			// 						>
// 			// 							{amb.get('moduleName')}
// 			// 						</span>
// 			// 						: ''
// 			// 					}
// 			// 				</span>
// 			// 				{/* <span className={gl.get('beOpen') ? '' : 'not-limit-check'}>
// 			// 					{
// 			// 						enclosureGl ?
// 			// 						<span
// 			// 							onClick={() => {
// 			// 								if (gl.get('beOpen')) {
// 			// 									dispatch(sobConfigActions.sobOptionChangeFunModuel(enclosureGl, !enclosureGl.get('beOpen')))
// 			// 								}
// 			// 							}}
// 			// 							className={enclosureGl.get('beOpen') ? 'sob-option-fun-modal-open' : ''}
// 			// 							style={{display: enclosureGl && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
// 			// 						>
// 			// 							{enclosureGl.get('moduleName')}
// 			// 						</span>
// 			// 						: ''
// 			// 					}
// 			// 				</span> */}
// 			// 				<span></span>
// 			// 			</div>
// 			// 			: ''
// 			// 		}
// 			// 	</div>
// 			// </div>

// 		)
// 	}
// }
