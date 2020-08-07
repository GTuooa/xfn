import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import { ROOT } from 'app/constants/fetch.constant.js'
import { Button, Icon, Tooltip, message, Checkbox } from 'antd'
import thirdParty from 'app/thirdParty'

import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

@immutableRenderDecorator
export default
class FunModal extends React.Component {

	render() {

		const {
			running,
			runningGl,
			gl,
			assets,
			enclosureRun,
			currency,
			ass,
			amb,
			enclosureGl,
            number,
            process,
            inventory,
            quantity,
            warehouse,
            project,
            projectSCXM,
            projectSGXM,
            assist,
            batch,
            serial,
            templateTypeZN,
            templateTypeKJ,
            template,
            dispatch,
            isPlay,
            sobid,
            isNewJr,
            moduleMap,
            oldScxmBeOpen,
            oldSgxmBeOpen,
            oldQuantityBeOpen,
            oldWarehouseBeOpen,
            oldProcessBeOpen,
            oldAmbBeOpen,
            oldSerialBeOpen,
            oldAssistBeOpen,
            oldBatchBeOpen,
        } = this.props

        let processDisabled = false
        let inventoryDisabled = false
        let quantityDisabled = false
        let serialDisabled = false
        let assistDisabled = false
        let batchDisabled = false
        let warehouseDisabled = false
        let projectDisabled = false
        let projectSCXMDisabled = false
        let projectSGXMDisabled = false
        
        if (isNewJr) { // 是新权益账套的场景
            processDisabled = moduleMap && moduleMap.get('PROCESS') ? moduleMap.get('PROCESS').get('beOpen') : false
            inventoryDisabled = moduleMap && moduleMap.get('INVENTORY') ? moduleMap.get('INVENTORY').get('beOpen') : false
            quantityDisabled = moduleMap && moduleMap.get('QUANTITY') ? moduleMap.get('QUANTITY').get('beOpen') : false
            serialDisabled = moduleMap && moduleMap.get('SERIAL') ? moduleMap.get('SERIAL').get('beOpen') : false
            assistDisabled = moduleMap && moduleMap.get('ASSIST') ? moduleMap.get('ASSIST').get('beOpen') : false
            batchDisabled = moduleMap && moduleMap.get('BATCH') ? moduleMap.get('BATCH').get('beOpen') : false
            warehouseDisabled = moduleMap && moduleMap.get('WAREHOUSE') ? moduleMap.get('WAREHOUSE').get('beOpen') : false
            projectDisabled = moduleMap && moduleMap.get('PROJECT') ? moduleMap.get('PROJECT').get('beOpen') : false
            projectSCXMDisabled = moduleMap && moduleMap.get('SCXM') ? moduleMap.get('SCXM').get('beOpen') : false
            projectSGXMDisabled = moduleMap && moduleMap.get('SGXM') ? moduleMap.get('SGXM').get('beOpen') : false
        } else {
            inventoryDisabled = moduleMap && moduleMap.get('INVENTORY') ? moduleMap.get('INVENTORY').get('beOpen') : false
            projectDisabled = moduleMap && moduleMap.get('PROJECT') ? moduleMap.get('PROJECT').get('beOpen') : false
        }

		return (
            <div className="sob-option-row">
                <label>
                    功能模块：
                </label>
                <div className="fun-modal-checkbox">
					<div style={{display: templateTypeZN.indexOf(template) > -1 ? '' : 'none'}}>
						{
							running && templateTypeZN.indexOf(template) > -1 ?
                            <span>
                                <Checkbox
                                    onChange={(e) =>{
                                        if ((gl && gl.get('beOpen')) || !running.get('beOpen')) {
                                            dispatch(sobConfigActions.sobOptionChangeFunModuel(running,e.target.checked))
                                        }
                                    }}
                                    checked={running.get('beOpen')}
                                    style={{display:running?'':'none'}}
                                    // disabled={templateTypeKJ.indexOf(template) > -1}
                                >
                                    {running.get('moduleName')}
                                </Checkbox>
                            </span>
							: ''
						}
						{
                            running && templateTypeZN.indexOf(template) > -1 && runningGl ?
                            <span className={running.get('beOpen') ? '' : 'not-limit-check'}>
                                <Checkbox
                                    onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(runningGl, e.target.checked))}
                                    checked={runningGl.get('beOpen')}
                                    style={{display: runningGl ? '' : 'none'}}
                                    disabled={!running.get('beOpen')}
                                >
                                    {runningGl.get('moduleName')}
                                </Checkbox>
                            </span>
                            : ''
                        }
                        {
                            running && templateTypeZN.indexOf(template) > -1 && process ?
                            <span className={running.get('beOpen') && !process.get('beOverdue') ? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={process.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(process, e.target.checked))}
                                        checked={process.get('beOpen')}
                                        style={{display: process ? '' : 'none'}}
                                        disabled={!running.get('beOpen') || (sobid ? (process.get('beOverdue') ? !oldProcessBeOpen : false) : (process.get('beOverdue') ? true : processDisabled))}
                                    >
                                        {process.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
                        }
						{/* {
                            gl ?
                            <span className={gl.get('beOpen') ? '' : 'not-limit-check'}>
                                {
                                    enclosureGl ?
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(enclosureGl,e.target.checked))}
                                        checked={enclosureGl.get('beOpen')}
                                        style={{display: enclosureGl && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
                                        disabled={!gl.get('beOpen')}
                                    >
                                        {enclosureGl.get('moduleName')}
                                    </Checkbox>
                                    : ''
                                }
                            </span>
                            : ''
                        } */}
					</div>
                    <div style={{display: templateTypeZN.indexOf(template) > -1 ? '' : 'none'}}>
                        {running && templateTypeZN.indexOf(template) > -1 ? <span></span> : ''}
						{
                            running && templateTypeZN.indexOf(template) > -1 && project ?
                            <span className={running.get('beOpen') ? '' : 'not-limit-check'}>
                                <Checkbox
                                    onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(project, e.target.checked))}
                                    checked={project.get('beOpen')}
                                    style={{display: project ? '' : 'none'}}
                                    disabled={!running.get('beOpen') || projectDisabled}
                                >
                                    {project.get('moduleName')}
                                </Checkbox>
                            </span>
                            : ''
                        }
                        {
                            running && templateTypeZN.indexOf(template) > -1 && projectSCXM ?
                            <span className={project && project.get('beOpen') && !projectSCXM.get('beOverdue') ? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={projectSCXM.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(projectSCXM, e.target.checked))}
                                        checked={projectSCXM.get('beOpen')}
                                        style={{display: projectSCXM ? '' : 'none'}}
                                        // disabled={(project && !project.get('beOpen')) || projectSCXMDisabled || projectSCXM.get('beOverdue')}
                                        disabled={(project && !project.get('beOpen')) || (sobid ? (projectSCXM.get('beOverdue') ? !oldScxmBeOpen : false) : (projectSCXM.get('beOverdue') ? true : projectSCXMDisabled))}
                                    >
                                        {projectSCXM.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
                        }
                        {
                            running && templateTypeZN.indexOf(template) > -1 && projectSGXM ?
                            <span className={project && project.get('beOpen') && !projectSGXM.get('beOverdue') ? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={projectSGXM.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(projectSGXM, e.target.checked))}
                                        checked={projectSGXM.get('beOpen')}
                                        style={{display: projectSGXM ? '' : 'none'}}
                                        // disabled={(project && !project.get('beOpen')) || projectSCXMDisabled || projectSCXM.get('beOverdue')}
                                        disabled={(project && !project.get('beOpen')) || (sobid ? (projectSGXM.get('beOverdue') ? !oldSgxmBeOpen : false) : (projectSGXM.get('beOverdue') ? true : projectSGXMDisabled))}
                                    >
                                        {projectSGXM.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
                        }
					</div>
                    <div style={{display: templateTypeZN.indexOf(template) > -1 ? '' : 'none'}}>
                        {running && templateTypeZN.indexOf(template) > -1 ? <span></span> : ''}
						{
							running && templateTypeZN.indexOf(template) > -1 && inventory ?
                            <span className={running.get('beOpen') ? '' : 'not-limit-check'}>
                                <Checkbox
                                    onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(inventory, e.target.checked))}
                                    checked={inventory.get('beOpen')}
                                    style={{display: inventory ? '' : 'none'}}
                                    disabled={!running.get('beOpen') || inventoryDisabled}
                                >
                                    {inventory.get('moduleName')}
                                </Checkbox>
                            </span>
                            : ''
                        }
                        {
                            running && templateTypeZN.indexOf(template) > -1 && warehouse ?
                            <span className={inventory && inventory.get('beOpen') && !warehouse.get('beOverdue') ? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={warehouse.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(warehouse, e.target.checked))}
                                        checked={warehouse.get('beOpen')}
                                        style={{display: warehouse ? '' : 'none'}}
                                        disabled={(inventory && !inventory.get('beOpen')) || (sobid ? (warehouse.get('beOverdue') ? !oldWarehouseBeOpen : false) : (warehouse.get('beOverdue') ? true : warehouseDisabled))}
                                        // disabled={(inventory && !inventory.get('beOpen')) || warehouseDisabled || warehouse.get('beOverdue')}
                                    >
                                        {warehouse.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
                        }
						{
                            running && templateTypeZN.indexOf(template) > -1 && quantity ?
                            <span className={inventory && inventory.get('beOpen') && !quantity.get('beOverdue')  ? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={quantity.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(quantity, e.target.checked))}
                                        checked={quantity.get('beOpen')}
                                        disabled={(inventory && !inventory.get('beOpen')) || (sobid ? (quantity.get('beOverdue') ? !oldQuantityBeOpen : false) : (quantity.get('beOverdue') ? true : quantityDisabled))}
                                        // disabled={(inventory && !inventory.get('beOpen')) || quantityDisabled || quantity.get('beOverdue')}
                                    >
                                        {quantity.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
                        }
                        {
							running && templateTypeZN.indexOf(template) > -1 && assist && quantity ?
                            <span className={running.get('beOpen') && quantity.get('beOpen') && !assist.get('beOverdue') ? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={assist.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(assist, e.target.checked))}
                                        checked={assist.get('beOpen')}
                                        style={{display: assist ? '' : 'none'}}
                                        // disabled={!running.get('beOpen') || !quantity.get('beOpen') || assist.get('beOverdue')}
                                        disabled={(quantity && !quantity.get('beOpen')) || (sobid ? (assist.get('beOverdue') ? !oldAssistBeOpen : false) : (assist.get('beOverdue') ? true : assistDisabled))}
                                    >
                                        {assist.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
                        }
                        {
							running && templateTypeZN.indexOf(template) > -1 && serial && quantity ?
                            <span className={running.get('beOpen') && quantity.get('beOpen') && !serial.get('beOverdue') ? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={serial.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(serial, e.target.checked))}
                                        checked={serial.get('beOpen')}
                                        style={{display: serial ? '' : 'none'}}
                                        // disabled={!running.get('beOpen') || !quantity.get('beOpen') || serial.get('beOverdue')}
                                        disabled={(quantity && !quantity.get('beOpen')) || (sobid ? (serial.get('beOverdue') ? !oldSerialBeOpen : false) : (serial.get('beOverdue') ? true : serialDisabled))}
                                    >
                                        {serial.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
                        }
                        {
							running && templateTypeZN.indexOf(template) > -1 && batch && quantity ?
                            <span className={running.get('beOpen') && quantity.get('beOpen') && !batch.get('beOverdue') ? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={batch.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(batch, e.target.checked))}
                                        checked={batch.get('beOpen')}
                                        style={{display: batch ? '' : 'none'}}
                                        // disabled={!running.get('beOpen') || !quantity.get('beOpen') || batch.get('beOverdue')}
                                        disabled={(quantity && !quantity.get('beOpen')) || (sobid ? (batch.get('beOverdue') ? !oldBatchBeOpen : false) : (batch.get('beOverdue') ? true : batchDisabled))}
                                    >
                                        {batch.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
						}
						{/* {
                            gl ?
                            <span className={gl.get('beOpen') ? '' : 'not-limit-check'}>
                                {
                                    enclosureGl ?
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(enclosureGl,e.target.checked))}
                                        checked={enclosureGl.get('beOpen')}
                                        style={{display: enclosureGl && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
                                        disabled={!gl.get('beOpen')}
                                    >
                                        {enclosureGl.get('moduleName')}
                                    </Checkbox>
                                    : ''
                                }
                            </span>
                            : ''
                        } */}
					</div>
                    <div style={{display: templateTypeZN.indexOf(template) > -1 ? 'none' : ''}}>
						{
							gl ?
							<span>
								<Checkbox
									onChange={(e) =>{
										if((running && running.get('beOpen')) || !gl.get('beOpen')){
											dispatch(sobConfigActions.sobOptionChangeFunModuel(gl,e.target.checked))
										}
									}}
									checked={gl.get('beOpen')}
									style={{display: gl && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
								>
									{gl.get('moduleName')}
								</Checkbox>
							</span> : ''
						}
						{
                            gl ?
                            <span className={gl.get('beOpen') ? '' : 'not-limit-check'}>
                                {
                                    currency ?
                                    <Checkbox
                                        onChange={(e) =>dispatch(sobConfigActions.sobOptionChangeFunModuel(currency,e.target.checked))}
                                        checked={currency.get('beOpen')}
                                        style={{display: currency && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
                                        disabled={!gl.get('beOpen')}
                                    >
                                        {currency.get('moduleName')}
                                    </Checkbox>
                                    : ''
                                }
                            </span>
                            : ''
                        }
						{
                            gl ?
                            <span className={gl.get('beOpen') ? 'not-limit-check' : ''}>
                                {
                                    ass ?
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(ass,e.target.checked))}
                                        checked={ass.get('beOpen')}
                                        style={{display: ass && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
                                        disabled={(running && running.get('beOpen')) || !gl.get('beOpen')}
                                    >
                                        {ass.get('moduleName')}
                                    </Checkbox>
                                    : ''
                                }
                            </span>
                            : ''
                        }
						{
                            gl ?
                            <span className={gl.get('beOpen') ? '' : 'not-limit-check' }>
                                {
                                    assets ?
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(assets,e.target.checked))}
                                        checked={assets.get('beOpen')}
                                        style={{display: assets && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
                                        disabled={!gl.get('beOpen')}
                                    >
                                        {assets.get('moduleName')}
                                    </Checkbox>
                                    : ''
                                }
                            </span>
                            : ''
                        }
					</div>
					<div style={{display: templateTypeZN.indexOf(template) > -1 ? 'none' : ''}}>
						<span></span>
						{
                            gl ?
                            <span className={gl.get('beOpen') ? '' : 'not-limit-check'}>
                                {
                                    number ?
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(number,e.target.checked))}
                                        checked={number.get('beOpen')}
                                        style={{display: number && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
                                        disabled={!gl.get('beOpen')}
                                    >
                                        {number.get('moduleName')}
                                    </Checkbox>
                                    : ''
                                }
                            </span>
                            : ''
                        }
						{
                            gl && amb ?
                            <span className={ass && ass.get('beOpen') || !amb.get('beOverdue')? '' : 'not-limit-check'}>
                                <Tooltip placement="top" title={amb.get('beOverdue') ? '未购买或权益到期' : ''}>
                                    <Checkbox
                                        onChange={(e) => dispatch(sobConfigActions.sobOptionChangeFunModuel(amb,e.target.checked))}
                                        checked={amb.get('beOpen')}
                                        style={{display: amb && templateTypeKJ.indexOf(template) > -1 ? '' : 'none'}}
                                        disabled={(ass && !ass.get('beOpen')) || (sobid ? (amb.get('beOverdue') ? !oldAmbBeOpen : false) : (amb.get('beOverdue') ? true : false))}
                                    >
                                        {amb.get('moduleName')}
                                    </Checkbox>
                                </Tooltip>
                            </span>
                            : ''
                        }

						{/* {
							running ?
							<span className={running.get('beOpen') ? '' : 'not-limit-check'}>
								{
									enclosureRun ?
									<Checkbox
										onChange={(e) =>dispatch(sobConfigActions.sobOptionChangeFunModuel(enclosureRun,e.target.checked))}
										checked={enclosureRun.get('beOpen')}
										style={{display:enclosureRun?'':'none'}}
										disabled={!running.get('beOpen')}
									>
										{enclosureRun.get('moduleName')}
									</Checkbox>
									: ''
								}
							</span>
							: <span></span>
						} */}
					</div>
                    {/* <div>
                        {running && templateTypeZN.indexOf(template) > -1 ? <span></span> : ''}
                        <span></span>
                        <span
                            className="more-fun-buy"
                            onClick={() => {
                                if (isPlay) {
                                    return message.info('体验模式下不能进行套餐购买')
                                }
                                dispatch(homeActions.addPageTabPane('ConfigPanes', 'Fee', 'Fee', '套餐购买'))
                                dispatch(homeActions.addHomeTabpane('Config', 'Fee', '套餐购买'))
                            }}
                        >更多功能购买></span>
                    </div> */}
                </div>
            </div>
		)
	}
}
