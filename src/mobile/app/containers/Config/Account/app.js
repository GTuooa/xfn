import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'
import 'app/containers/Config/common/style/listStyle.less'
import './index.less'

import { Button, ButtonGroup, Icon, Container, ScrollView, Checkbox } from 'app/components'
import { Popover } from 'antd-mobile'
const Item = Popover.Item

import * as thirdParty from 'app/thirdParty'

import { accountConfigActions } from 'app/redux/Config/Account/index.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class AccountConfig extends React.Component {

    static displayName = 'AccountConfig'
    scrollerHeight = 0//滚动容器的高度
    listHeight = 50//一条卡片的高度
    listHtml = ''//一条卡片的html

    static propTypes = {
		allState: PropTypes.instanceOf(Map),
        homeState: PropTypes.instanceOf(Map),
		accountConfigState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func,
		history: PropTypes.object,
	}

    constructor(props) {
		super(props)
		this.state = {
            isDelete: false,
            deleteList: [],
            isChangePoistion: false,//调整顺序
            showIdx: -1,//向上 下移按钮
            currentPage: 1,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '账户设置'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })

        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
            this.props.dispatch(allRunningActions.getRunningAccount())
        }

        const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
        const listHtml = document.getElementsByClassName('list-html')[0]
        this.scrollViewHtml = scrollViewHtml
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
        if (listHtml) {
            this.listHtml = listHtml
            this.listHeight = listHtml ? Number(window.getComputedStyle(listHtml).height.replace('px','')) : 50
        }
    }
    closeMask () {
		const ScrollView = document.getElementsByClassName('scroll-view')
		ScrollView[0].style.overflowY = 'auto'
		this.setState({showIdx: -1})
    }

    render() {
        const { dispatch, accountConfigState, homeState, allState, history } = this.props
        const { isDelete, deleteList, isChangePoistion, showIdx, currentPage } = this.state

        console.log('AccountConfig');

        //权限校验
        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const flags = accountConfigState.getIn(['views', 'flags'])
        const accountList = allState.get('accountList')
        let allAccountList = []
        let accountListSize = 0
        if (accountList.size) {
            accountListSize = accountList.getIn([0, 'childList']).size
            allAccountList = fromJS([...accountList.getIn([0, 'childList']), ...accountList.getIn([0, 'disableList'])])
        }

        const pageSize = 50//滑动一次加载50个
        const pageCount = Math.ceil(allAccountList.size/pageSize)//总共多少页


        return(
            <Container className="account-config">
                <ScrollView flex='1' className="border-top" 
                    onScroll={(e) => {
                        const scrollY = e.target.scrollTop
                        if (scrollY + 100 + this.scrollerHeight >= currentPage*this.listHeight*pageSize && currentPage < pageCount) {
                            this.setState({currentPage: currentPage+1})
                        }
                    }}
                >
                    {allAccountList.slice(0,currentPage*pageSize).map((v, i) => {
                        let overlay = []
                        let lastItemUuid = i > 0 ? accountList.getIn([0, 'childList', i-1, 'uuid']) : ''
                        let nextItemUuid = i < accountListSize-1 ? accountList.getIn([0, 'childList', i+1, 'uuid']) : ''
                        if(lastItemUuid) {
                            overlay.push(<Item key="3" value="up"  >上移</Item>)
                        }
                        if (nextItemUuid) {
                            overlay.push(<Item key="4" value="down"  >下移</Item>)
                        }
                        return <div
                            className={i==0 ? 'config-list-item-wrap-style list-html' : 'config-list-item-wrap-style'}
                            key={v.get('uuid')}
                            onClick={() => {
                                if (isChangePoistion) {
                                    return
                                }
                                if (isDelete) {
                                    const index = deleteList.findIndex(w => w === v.get('uuid'))
                                    if (index > -1) {
                                        deleteList.splice(index, 1)
                                        this.setState({deleteList: deleteList})
                                    } else {
                                        deleteList.push(v.get('uuid'))
                                        this.setState({deleteList: deleteList})
                                    }
                                } else {
                                    dispatch(accountConfigActions.accountSettingMidify(v))
                                    history.push("/config/account/card/edit")
                                }
                            }}
                        >
                            <div className="config-list-item-style">
                                <span className='config-list-item-checkbox-style' style={{display: isDelete ? '' : 'none'}}>
                                    <Checkbox
                                        className="checkbox"
                                        checked={deleteList.indexOf(v.get('uuid')) > -1 ? true : false}
                                    />
                                </span>
                                <span style={{display: (isChangePoistion && v.get('canUse') && (lastItemUuid || nextItemUuid)) ? '' : 'none'}}>
                                    <Popover
                                        visible={showIdx==i}
                                        overlay={overlay}
                                        align={{
                                            overflow: { adjustY: 0, adjustX: 0 },
                                            offset: [1, 0],
                                        }}
                                        placement='bottomLeft'
                                        onSelect={(e) => {
                                            switch (e.props.value) {
                                                case 'up':
                                                    dispatch(allRunningActions.swapItem(v.get('uuid'),lastItemUuid))
                                                    break
                                                case 'down':
                                                    dispatch(allRunningActions.swapItem(v.get('uuid'),nextItemUuid))
                                                    break
                                                default:
                                            }
                                            this.closeMask()
                                        }}
                                    >
                                        <span style={{marginRight: '.04rem'}}>
                                            <Icon
                                                onClick={() => {
                                                    this.setState({showIdx: i})
                                                    const ScrollView = document.getElementsByClassName('scroll-view')
                                                    ScrollView[0].style.overflowY = 'hidden'
                                                }}
                                                type="swap-position"
                                                color={'#5d81d1'}
                                                size="18"
                                            />
                                        </span>
                                    </Popover>
                                </span>
                                <span className='config-list-item-info-style'>
                                    {v.get('name')}
                                </span>
                                <span className='config-list-item-arrow-style'>
                                    <Icon type='arrow-right' />
                                </span>
                            </div>
                        </div>
                    })}
                    <div className="choose-type" style={{display:showIdx==-1 ? 'none' : 'block'}}
                        onClick={(e) => {
                            e.stopPropagation()
                            this.closeMask()
                        }}
                    ></div>
                </ScrollView>
                <ButtonGroup>
                    <Button
                        disabled={!editPermission}
                        style={{display: isDelete || isChangePoistion ? 'none' : ''}}
                        onClick={() => {
                            dispatch(accountConfigActions.changeAccountSettingData(['views', 'flags'], 'insert'))
                            history.push("/config/account/card/edit")
                        }}
                    >
                        <Icon type='add-plus' size='15' />
                        <span>新增</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        style={{display: isDelete || isChangePoistion ? 'none' : ''}}
                        onClick={() => {
                            this.setState({isDelete: true})
                        }}
                    >
                        <Icon type='select' size='15' />
                        <span>选择</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        style={{display: isDelete || isChangePoistion ? 'none' : ''}}
                        onClick={() => {
                            this.setState({isChangePoistion: true})
                        }}
                    >
                        <Icon type='swap' size='12' />
                        <span>调整顺序</span>
                    </Button>
                    <Button disabled={!editPermission} style={{display: isDelete || isChangePoistion ? 'none' : ''}}
                        onClick={() => {
                            thirdParty.actionSheet({
                                title: "更多",
                                cancelButton: "取消",
                                otherButtons: ['手续费设置','反悔模式'],
                                onSuccess: (result) => {
                                    if (result.buttonIndex == -1 || result.buttonIndex >= 2) {
                                        return
                                    }
                                    if (result.buttonIndex === 0) {
                                        history.push("/config/account/poundage")
                                    } else if (result.buttonIndex === 1) {
                                        history.push('/config/account/regret')
                                    }
                                }
                            })
                        }}>
                        <Icon type="more" size='15'/><span>更多</span>
                    </Button>
                    {/* <Button
                        disabled={!editPermission}
                        style={{display: isDelete || isChangePoistion ? 'none' : ''}}
                        onClick={() => {
                            history.push("/config/account/poundage")
                        }}
                    >
                        <Icon type='poundage' size='13' />
                        <span>手续费</span>
                    </Button> */}
                    <Button
                        disabled={!editPermission}
                        style={{display: isDelete || isChangePoistion ? '' : 'none'}}
                        onClick={() => {
                            this.setState({
                                isDelete: false,
                                isChangePoistion: false,
                                showIdx: -1,
                            })
                        }}
                    >
                        <Icon type='cancel' size='15' />
                        <span>取消</span>
                    </Button>
                    <Button
                        disabled={!deleteList.length || !editPermission}
                        style={{display: isDelete ? '' : 'none'}}
                        onClick={() => {
                            dispatch(allRunningActions.deleteAccountSetting(deleteList, () => this.setState({deleteList: []})))
                        }}
                    >
                        <Icon type='delete' size='15' />
                        <span>删除</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
