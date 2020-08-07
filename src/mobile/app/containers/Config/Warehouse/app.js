import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import './index.less'
import 'app/containers/Config/common/style/listStyle.less'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Checkbox } from 'app/components'
import Item from './Item.jsx'

import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as warehouseConfActions from 'app/redux/Config/Warehouse/WarehouseConf.action.js'

@connect(state => state)
export default
class WarehouseConfApp extends React.Component {

	static propTypes = {
		dispatch: PropTypes.func
	}

    state = {
        isDelete: false,//是否是编辑状态
    }

    componentDidMount() {

        thirdParty.setTitle({title: '仓库设置'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })

        const dispatch = this.props.dispatch

        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
            //dispatch(warehouseConfActions.warehouseEnable())
            dispatch(warehouseConfActions.getWarehouseTree())
        }
    }

    render() {
        const { dispatch, warehouseState, history, homeState } = this.props
        const { isDelete } = this.state

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const treeList = warehouseState.get('treeList')
        const showChildList = warehouseState.get('showChildList')
        const deleteList = warehouseState.get('deleteList').toJS()
		const isAdd =  warehouseState.getIn(['views', 'isAdd'])

        const loop = (data, leve) => {
            let elementList = []
            data && data.forEach((item, i) => {
				const checked = deleteList.includes(item.get('uuid'))
				const showChild = showChildList.includes(item.get('uuid'))
				const childListSize = item.get('childList').size
				const disableListSize = item.get('disableList').size
				const isAll = item.get('code') == 'ALLCRD' ? true : false//是否是全部 全部只显示子集

                if (childListSize || disableListSize) {
                    elementList.push(
                        <div key={item.get('uuid')}>
							{
								isAll ? null :
								<Item
									leve={leve}
									hasSub={true}
									isExpanded={showChild}
									item={item}
									isAdd={isAdd}
									isDelete={isDelete}
									dispatch={dispatch}
									checked={checked}
									history={history}
								/>
							}
                            {(showChild || isAll) && childListSize ? loop(item.get('childList'), leve+1) : ''}
							{(showChild || isAll) && disableListSize ? loop(item.get('disableList'), leve+1) : ''}
                        </div>
                    )
                } else {
					if (!isAll) {
						elementList.push(
							<Item
								leve={leve}
								hasSub={false}
								key={item.get('uuid')}
								item={item}
								isAdd={isAdd}
								isDelete={isDelete}
								dispatch={dispatch}
								checked={checked}
								history={history}
							/>
						)
					}

                }
            })
            return elementList
        }

        return(
            <Container className="warehouse-config border-top">

                <div style={{display: isAdd ? '' : false}}
                    className='warehouse-add'
                    onClick={() => {
                        dispatch(warehouseConfActions.addWarehouseCard({uuid: '', code: 'ALLCRD', name: '无'}))
                        history.push('/config/warehouse/card')
                    }}
                >
                    <Icon type="add" color="#7E6B5B" size="14"/>
                    添加一级仓库
                </div>

                <ScrollView flex='1'>
                    {loop(treeList, 0)}
                </ScrollView>

                <ButtonGroup
                    disabled={!editPermission}
                    style={{display: isDelete || isAdd ? 'none' : ''}}
                >
                    <Button
                        disabled={!editPermission}
                        onClick={() => dispatch(warehouseConfActions.changeWarehouseData(['views','isAdd'], true))}
                    >
                        <Icon type="add-plus"/>
                        <span>新增</span>
                    </Button>
                    <Button
						disabled={treeList.size == 0 || !editPermission}
						onClick={() => this.setState({ isDelete: true })}
					>
						<Icon type="select" size='15'/><span>选择</span>
					</Button>
                </ButtonGroup>

                <ButtonGroup style={{display: isDelete || isAdd ? '' : 'none'}}>
					<Button onClick={() => {
                        if (isDelete) {
                            this.setState({ isDelete: false })
							dispatch(warehouseConfActions.clearWarehouseChecked())
                        }
                        if (isAdd) {
                            dispatch(warehouseConfActions.changeWarehouseData(['views','isAdd'], false))
                        }
					}}>
						<Icon type="cancel"/><span>取消</span>
					</Button>
					<Button
                        style={{display: isDelete ? '' : 'none'}}
                        disabled={(deleteList.length==0) || !editPermission}
						onClick={() => {
                            dispatch(warehouseConfActions.deleteWarehouseCard(deleteList, () => this.setState({ isDelete: false })))
                        }}
					>
						<Icon type="delete"/><span>删除</span>
					</Button>
				</ButtonGroup>
            </Container>
        )
    }
}
