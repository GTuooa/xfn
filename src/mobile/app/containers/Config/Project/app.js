import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import './index.less'
import 'app/containers/Config/common/style/listStyle.less'
import 'app/containers/Config/common/style/configStyle.less'

import { Button, ButtonGroup, Icon, Container, ScrollView, Checkbox } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import findValue from 'app/containers/Config/common/func/findValue.js'
import { throttle } from 'app/utils'

import * as projectConfActions from 'app/redux/Config/Project/projectConf.action.js'

@connect(state => state)
export default
class ProjectConfApp extends React.Component {

    static displayName = 'ProjectConfApp'

    scrollView = ''
    scrollerHeight = 0
    listHeight = 0//一条卡片的高度
    pageSize = 50//滑动一次加载50个
    throttleFn = throttle((e, currentPage,  pageCount) => {
		const scrollY = e.target.scrollTop
        if (scrollY + 100 + this.scrollerHeight >= currentPage*this.listHeight*this.pageSize && currentPage < pageCount) {
            this.setState({currentPage: currentPage+1})
        }
	})

    state = {
        isEdit: false,//是否是编辑状态
        showTree: false,//显示类别选择列表
        currentPage: 1,
    }

    componentDidMount() {
        thirdParty.setTitle({title: '项目设置'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })

        const dispatch = this.props.dispatch

        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
            dispatch(projectConfActions.projectHighType())
            dispatch(projectConfActions.getProjectListAndTree())
        }

        this.scrollViewHtml = document.getElementsByClassName('right-content')[0]
        this.scrollerHeight = Number(window.getComputedStyle(this.scrollViewHtml).height.replace('px',''))
        this.listHtml = document.getElementsByClassName('list-html')[0]
        this.listHeight = this.listHtml ? Number(window.getComputedStyle(this.listHtml).height.replace('px','')) : 50
    }

    render() {
        const { dispatch, projectConfState, history, homeState } = this.props
        const { isEdit, showTree, currentPage } = this.state
        
        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const highTypeList = projectConfState.get('highTypeList')
        const cardList = projectConfState.get('cardList')
        const treeList = projectConfState.get('treeList')
        const pageCount = Math.ceil(cardList.size/this.pageSize)
        
        const views = projectConfState.get('views')
        const currentType = views.get('currentType')
        const currentTypeName = views.get('currentTypeName')
        const ctgyUuid = views.get('ctgyUuid')
        const treeUuid = views.get('treeUuid')

        const treeSelect = views.get('treeSelect')//通过类别筛选卡片的信息
        let treeOneList = []
        if (treeList.size) {
            const cardNumber = treeList.getIn([0, 'cardNumber'])
            treeOneList.push({uuid: treeList.getIn([0, 'uuid']), name: treeList.getIn([0, 'name']), childList: [], cardNumber})
            treeOneList = treeOneList.concat(treeList.getIn([0, 'childList']).toJS())
        }
        const treeTwoList = treeSelect.get('treeTwoList')
        const treeThreeList = treeSelect.get('treeThreeList')
        const selectUuid = treeSelect.get('selectUuid').toJS()
        const selectName = treeSelect.get('selectName')
        const selectEndUuid = treeSelect.get('selectEndUuid')
        

        return(
            <Container className="project-config">
                <ScrollView flex='1' className="border-top">{/*style={{marginTop: '.1rem'}}*/}
                    <div className='setting-wrap'>
                        {/* <div className='setting-wrap-serach'>
                            <Icon type='search'/>
                            <XfInput
                                className='setting-wrap-serach-input'
                                placeholder='搜索卡片'
                                value={searchValue}
                                onChange={(value) => this.setState({searchValue: value})}
                            />
                        </div> */}
                        <div className='setting-wrap-content'>
                            <div className='setting-wrap-content-left'>
                                {
                                    highTypeList.map((v,i) => {
                                        return (
                                            <div
                                                className={currentType == v.get('uuid') ? 'left-item active' : 'left-item'}
                                                key={v.get('uuid')}
                                                onClick = {() => {
                                                    dispatch(projectConfActions.changeProjectData(['views', 'currentType'], v.get('uuid')))
                                                    dispatch(projectConfActions.changeProjectData(['views', 'currentTypeName'], v.get('name')))
                                                    dispatch(projectConfActions.getProjectListAndTree())
                                                    this.setState({ currentPage: 1, showTree: false })
                                                    this.scrollViewHtml.scrollTop = 0
                                                }}
                                            >
                                                <span className='text' style={{"WebkitBoxOrient": "vertical"}}>{v.get('name')}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='setting-wrap-content-right'>
                                <div className="right-item list-html" style={{display: currentType ? '' : 'none'}} 
                                    onClick={() => {
                                        this.setState({showTree: !showTree})
                                        if (!showTree && selectEndUuid) {//变为展示时
                                            const valueList = findValue(selectEndUuid, treeOneList)
                                            let twoItem = valueList[0]
                                            let treeTwoList = twoItem['childList']
                                            if (treeTwoList.length) {
                                                treeTwoList.unshift({uuid: twoItem['uuid'], name: '全部', oriName: twoItem['name'], childList:[]})
                                            }

                                            let threeItem = valueList[1] ? valueList[1] : {uuid: '', childList: []}
                                            let treeThreeList = threeItem['childList']
                                            if (treeThreeList.length) {
                                                treeThreeList.unshift({uuid: threeItem['uuid'], name: '全部', oriName: threeItem['name'], childList:[]})
                                            }

                                            dispatch(projectConfActions.changeProjectData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                treeTwoList: treeTwoList,
                                                treeThreeList: treeThreeList,
                                                selectUuid: [twoItem['uuid'], threeItem['uuid'], selectEndUuid],
                                            }))))

                                        } 
                                    }}
                                >
                                    <span>{selectName ? selectName : currentTypeName}</span>
                                    <Icon type="triangle" style={showTree ? {transform: 'rotate(180deg)'} : ''}/>
                                </div>
                                <div className={`tree-content-hidden ${showTree ? 'tree-content' : ''}`} onClick={() => this.setState({showTree: false})}>
                                    {fromJS([treeOneList, treeTwoList, treeThreeList]).map((list, i) => {
                                        return (
                                            <div className={`tree-list ${list.size ? `bg-f${i}`: ''}`} key={`level_${i}`}>
                                                {list.map(v => {
                                                    const uuid = v.get('uuid')
                                                    const name = v.get('name')
                                                    const oriName = v.get('oriName')
                                                    const hasChild = v.get('childList').size
                                                    const cardNumber = v.get('cardNumber')
                                                    return (
                                                        <div
                                                            className={uuid == selectUuid[i] ? 'tree-item active' : 'tree-item'}
                                                            key={uuid}
                                                            onClick = {(e) => {
                                                                let newList = []
                                                                if (hasChild) {
                                                                    newList = v.get('childList')
                                                                    newList = newList.unshift(fromJS({uuid, name: '全部', oriName: name, childList:[], cardNumber}))
                                                                } else {
                                                                    dispatch(projectConfActions.changeProjectData(['views', 'treeUuid'], uuid))
                                                                    dispatch(projectConfActions.changeProjectData(['views', 'treeName'], name))
                                                                    dispatch(projectConfActions.getProjectCardByType(currentType, uuid))
                                                                    this.setState({currentPage: 1, showTree: false})
                                                                    this.scrollViewHtml.scrollTop = 0
                                                                }
                                                                if (i==0) {//第一级
                                                                    dispatch(projectConfActions.changeProjectData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        treeTwoList: newList,
                                                                        treeThreeList: [],
                                                                        selectUuid: [uuid, selectUuid[1], selectUuid[2]],
                                                                    }))))
                                                                }
                                                                if (i==1) {//第二级
                                                                    dispatch(projectConfActions.changeProjectData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        treeThreeList: newList,
                                                                        selectUuid: [selectUuid[0], uuid, selectUuid[2]],
                                                                    }))))
                                                                }
                                                                if (i==2) {//第三级
                                                                    dispatch(projectConfActions.changeProjectData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        selectUuid: [selectUuid[0], selectUuid[1], uuid],

                                                                    }))))
                                                                }
                                                                if (!hasChild) {
                                                                    dispatch(projectConfActions.changeProjectData(['views', 'treeSelect', 'selectName'], oriName ? oriName : name))
                                                                    dispatch(projectConfActions.changeProjectData(['views', 'treeSelect', 'selectEndUuid'], uuid))
                                                                }
                                                                e.stopPropagation()
                                                                
                                                            }}
                                                        >
                                                            <div className='overElli'>{name}{cardNumber ? `(${cardNumber})` : null}</div>
                                                            { hasChild ? <Icon type="arrow-right"/> : null }
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="right-content" onScroll={(e) => { this.throttleFn(e, currentPage, pageCount) }}>
                                    {
                                        cardList.slice(0,currentPage*this.pageSize).map((item, i) =>{
                                            const checked = item.get('checked') ? item.get('checked') : false
                                            return (
                                                <div
                                                    key={item.get('uuid')} className='right-item'
                                                    onClick={() => {
                                                        if (isEdit) {
                                                            dispatch(projectConfActions.changeProjectData(['cardList', i, 'checked'], !checked))
                                                        } else {
                                                            dispatch(projectConfActions.getProjectCardOne(item.get('uuid'), history))
                                                        }
                                                    }}
                                                >
                                                    <span className='item-checkbox' style={{display: isEdit ? '' : 'none'}}>
                                                        <Checkbox checked={item.get('checked')}/>
                                                    </span>
                                                    <span className="right-item-left text" style={{"WebkitBoxOrient": "vertical"}}>
                                                        {item.get('code')}_{item.get('name')}
                                                    </span>
                                                    <Icon type="arrow-right"/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollView>

                <ButtonGroup
                    className="border-top"
                    disabled={!editPermission}
                    style={{display: isEdit ? 'none' : ''}}>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {//默认新增损益类项目
                        dispatch(projectConfActions.changeProjectData(['views', 'insertOrModify'], 'insert'))
                        dispatch(projectConfActions.initProjectData('data'))
                        dispatch(projectConfActions.getProjectTree(ctgyUuid))
                        dispatch(projectConfActions.getProjectCardCode())
                        history.push('/config/project/projectCard')
                    }}>
                        <Icon type="add-plus"/>
                        <span>新增</span>
                    </Button>
                    <Button
						disabled={cardList.size == 0 || !editPermission}
						onClick={() => this.setState({ isEdit: true })}
					>
						<Icon type="select" size='15'/><span>选择</span>
					</Button>
                    <Button onClick={() => { history.push('/config/project/projectHighType')}}>
                        <Icon type="home" />
                        <span>类别管理</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup className="border-top" style={{display: isEdit ? '' : 'none'}}>
					<Button onClick={() => {
						this.setState({ isEdit: false })
                        dispatch(projectConfActions.uncheckedProject('card'))
					}}>
						<Icon type="cancel"/><span>取消</span>
					</Button>
					<Button disabled={!(cardList.some(v => v.get('checked'))) || !editPermission}
						onClick={() => dispatch(projectConfActions.deleteProjectCard(cardList, currentType, treeUuid, () => this.setState({ isEdit: false })))}
					>
						<Icon type="delete"/><span>删除</span>
					</Button>
				</ButtonGroup>
            </Container>
        )
    }
}
