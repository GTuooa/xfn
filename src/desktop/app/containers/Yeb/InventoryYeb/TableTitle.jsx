import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon } from 'antd'
import { TableScrollWrap, TableScroll, TableBody, TableAll, TablePagination,TableWrap,TableItem ,Amount, XfnIcon} from 'app/components'
import { Button, Modal, Select } from 'antd'
import * as inventoryActions from "app/redux/Yeb/InventoryYeb/inventory.action.js"
@immutableRenderDecorator
export default
class TableTitle extends React.Component {
	constructor() {
		super()
		this.state = {
			decimalModal: false
		}
	}
    render(){

        const {dispatch,isShow,inventoryType,quantityScale,priceScale} =this.props
        const { decimalModal } = this.state
        const ulName = isShow ? 'spread' : 'noSpread'

        return(
            <div className="inventoryyeb-table-title-wrap table-title-wrap">
                <ul className={inventoryType==='Other'?`inventoryyeb-table-title-${ulName}-other`:`inventoryyeb-table-title-${ulName}`}>
                    <li className="inventoryyeb-table-one">存货</li>
                    <li
                        className="inventoryyeb-table-two inventoryyeb-table-config"
                        onClick={()=>{
                            dispatch(inventoryActions.getDecimalScale())
                            this.setState({decimalModal:true})
                        }}
                    >
                        <div>基本单位</div>
                        <XfnIcon type='Config' />
                    </li>
                    <li className="inventoryyeb-table-three">
                        <div className="inventoryyeb-table-title-text">期初余额</div>
                        <div className={inventoryType==='Other'?"inventoryyeb-table-title-item-other":"inventoryyeb-table-title-item"}>
                            {inventoryType==="Other"&&<div>方向</div>}
                            <span>数量</span>
                            <span>单价</span>
                            <span>金额</span>
                        </div>
                    </li>
                    <li className="inventoryyeb-table-four">
                        <div className="inventoryyeb-table-title-text">{inventoryType==="Other"?"本期借方":'本期入库'}</div>
                        <div className="inventoryyeb-table-title-item">
                            <span>数量</span>
                            <span>金额</span>
                        </div>
                    </li>
                    <li className="inventoryyeb-table-four">
                        <div className="inventoryyeb-table-title-text">{inventoryType==="Other"?'本期贷方':'本期出库'}</div>
                        <div className="inventoryyeb-table-title-item">
                            <span>数量</span>
                            <span>金额</span>
                        </div>
                    </li>
                    <li className="inventoryyeb-table-six">
                        <div className="inventoryyeb-table-title-text">期末余额</div>
                        <div className={inventoryType==='Other'?"inventoryyeb-table-title-item-other":"inventoryyeb-table-title-item"}>
                            {inventoryType==="Other"&&<div>方向</div>}
                            <span>数量</span>
                            <span>单价</span>
                            <span>金额</span>
                        </div>
                    </li>
                </ul>
                <Modal
                    visible={decimalModal}
                    title={'小数位数设置'}
                    onCancel={() => {
                        this.setState({decimalModal:false})
                        dispatch(inventoryActions.getDecimalScale())
                    }}
                    onOk={() => {
                        dispatch(inventoryActions.modifyDecimalScale())
                        this.setState({decimalModal:false})
                    }}
                >
                    <div>
                        <div className='inventory-yeb-config-decimal'>
                            <label>数量的小数位数：</label>
                            <Select
                                value={quantityScale}
                                onChange={(value)=>{
                                    dispatch(inventoryActions.changeInventoryYebQuantityScale(value))
                                }}
                            >
                                <Option value='0'>0</Option>
                                <Option value='1'>1</Option>
                                <Option value='2'>2</Option>
                                <Option value='3'>3</Option>
                                <Option value='4'>4</Option>
                            </Select>
                        </div>
                        <div className='inventory-yeb-config-decimal'>
                            <label>单价的小数位数：</label>
                            <Select
                                value={priceScale}
                                onChange={(value)=>{
                                    dispatch(inventoryActions.changeInventoryYebPriceScale(value))
                                }}
                            >
                                <Option value='0'>0</Option>
                                <Option value='1'>1</Option>
                                <Option value='2'>2</Option>
                                <Option value='3'>3</Option>
                                <Option value='4'>4</Option>
                            </Select>
                        </div>
                        <div className="inventory-yeb-config-tips">
                            <span>*</span> <span>存货余额表、明细表将统一调整</span>
                        </div>


                    </div>
                </Modal>
            </div>

        )
    }
}
