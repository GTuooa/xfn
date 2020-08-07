import React, { PropTypes, Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import copy from 'copy-to-clipboard';
import { Drawer, Button, message} from 'antd';
import { Icon } from 'app/components'
import { Amount } from 'app/components'

import XfIcon from 'app/components/Icon'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class SerialDrawer extends React.Component {
    render(){
        const {
            dispatch,
            onClose,
            serialFollow,
            serialList,
            chooseSerialUuid,
            stockCardMessage,
            refreshInventoryMxbList,
            enableWarehouse,
        } =this.props



        return(
            <div
                onClick={(e)=>{
                    e.stopPropagation()
                }}
            >
            <Drawer
                  placement="right"
                  closable={false}
                  onClose={()=>{
                      dispatch(allRunningActions.changeMxbSerialDrawerVisibility(false))
                  }}
                  visible={serialFollow}
                  className="inventory-mxb-serial-wrap"
                  width={479}
                  closable={false}
                  maskClosable={false}
                  mask={false}
                >
                <div>
                    <div className="inventory-mxb-serial-title">
                        <span className='serial-title-text'>序列号跟踪</span>
                        <span
                            onClick={() => dispatch(allRunningActions.changeMxbSerialDrawerVisibility(false))}
                            className="serial-title-icon"
                        >
                            <Icon type="close" />
                        </span>
                    </div>
                    <div className='inventory-mxb-serial-follow'>
                        <div className="serial-title">{`${serialFollow.get('cardCode')?serialFollow.get('cardCode'):''} ${serialFollow.get('cardName')?serialFollow.get('cardName'):''}`}</div>
                        <div className="serial-content">
                            <ul>
                                {
                                    stockCardMessage.get('openAssist') ?
                                    <li><span>属性：</span><span>{serialFollow.get('assist')}</span></li>  : ''
                                }
                                {
                                    stockCardMessage.get('openBatch') ?
                                    <li><span>批次：</span><span>{`${serialFollow.get('batch')} ${serialFollow.get('productionDate') ? `(${serialFollow.get('productionDate')})` : ''}`}</span></li> : ''
                                }
                                <li>
                                    <span>序列号：</span>
                                    <span id='copyNumber'>{serialFollow.get('serialNumber')}</span>
                                    <span
                                        className='serial-copy'
                                        onClick={()=>{
                                            const activeCodeSpan = document.getElementById('copyNumber').innerHTML
                                            const tag = copy(activeCodeSpan)
                                            if(tag){
                                                message.info('复制成功')
                                            }
                                        }}
                                    ><Icon type="copy" /> 复制</span>
                                </li>
                                <li><span>状态：</span><span>{serialFollow.get('status')}</span></li>
                                {
                                    enableWarehouse ? <li><span>仓库：</span><span>{serialFollow.get('storeFullName')}</span></li> : null
                                }


                            </ul>
                        </div>
                        <div className="serial-follow-list">
                            <ul className="serial-follow-list-content">
                                <li className='serial-follow-list-title'><span>流水号</span><span>金额</span><span>出入情况</span></li>
                                {
                                    serialFollow && serialFollow.get('followList') && serialFollow.get('followList').map(item =>{
                                        return <li className='serial-follow-list-items'>
                                            <div className='list-items-abstract'>{item.get('oriAbstract')}</div>
                                            <div className='list-items-content'>
                                                <span>
                                                    <span>{item.get('oriDate')}</span>
                                                    <span
                                                        className='list-items-jrindex'
                                                        onClick={()=>{
                                                            dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'serialFollow',serialFollow.get('followList'),refreshInventoryMxbList ))
                                                        }}
                                                    >{item.get('jrIndex') ? `${item.get('jrIndex')}号` : ''}</span>
                                                </span>
                                                <span className='list-items-amount'><Amount >{item.get('amount')}</Amount></span>
                                                <span>{item.get('status')}</span>
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>

                    </div>
                    <div className="inventory-mxb-opration-wrap">
                        {
                            serialList && serialList.size?
                                <div className='inventory-mxb-title-btn'>
                                    <Button
                                        type='ghost'
                                        className='inventory-mxb-btn'
                                        disabled={serialList.some((v, i)=> v.get('serialUuid') === chooseSerialUuid && i === 0)}
                                        onClick={() => {
                                            const index = serialList.findIndex(v => v.get('serialUuid') === chooseSerialUuid) -1
                                            const nextItem = serialList.get(index)
                                            dispatch(inventoryMxbActions.getSerialListRunningFollow(stockCardMessage.get('stockCardUuid'),nextItem.get('serialUuid')))
                                        }}
                                    >
                                            <Icon type="caret-left" />
                                    </Button>
                                </div>
                                :''
                        }

                        {
                            serialList && serialList.size?
                                <div className='inventory-mxb-title-btn'>
                                    <Button
                                        type='ghost'
                                        className='inventory-mxb-btn'
                                        disabled={serialList.some((v, i) => v.get('serialUuid') === chooseSerialUuid && i === serialList.size-1)}
                                        onClick={() => {
                                            const index = serialList.findIndex(v => v.get('serialUuid') === chooseSerialUuid) +1
                                            const nextItem = serialList.get(index)
                                            dispatch(inventoryMxbActions.getSerialListRunningFollow(stockCardMessage.get('stockCardUuid'),nextItem.get('serialUuid')))

                                        }}
                                    >
                                        <Icon type="caret-right" />
                                    </Button>
                                </div>:''
                        }
                    </div>
                </div>

            </Drawer>
            </div>


        )
    }
}
