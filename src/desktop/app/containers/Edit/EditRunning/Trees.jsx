import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS, is } from 'immutable'

import { XfnIcon } from 'app/components'
import { Tree, Tooltip, Input } from 'antd'
import { Icon } from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import { editRunningAllActions } from 'app/redux/Edit/EditRunning/runningAll.js'
// import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import { changeCategoryAllowed } from './common/common'
const TreeNode = Tree.TreeNode

const Search = Input.Search
@immutableRenderDecorator
export default
class Trees extends React.Component {
    constructor() {
        super()
        this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
        }
    }

    componentDidMount() {
        if(this.props.pageTab === 'business'){
            this.setState({
                expandedKeys:this.props.category.getIn([0, 'childList']).toJS().filter(v => v.categoryType === 'LB_YYSR' || v.categoryType === 'LB_YYZC' || v.categoryType === 'LB_FYZC').map(v => v.uuid)
            })
        }else{
            const newCategoryList = this.props.newJr === true ? this.props.hideCategoryList && this.props.hideCategoryList.size && this.props.hideCategoryList.filter((item)=> item.get('childList') ? item.get('childList').filter(v => v.get('categoryType') !== 'LB_ZCWJZZS') : item.get('categoryType') !== 'LB_ZCWJZZS') : this.props.hideCategoryList
            this.setState({
                expandedKeys:newCategoryList.toJS().map(v => v.uuid)
            })
        }
    }
    componentWillReceiveProps(nextprops) {
        if(nextprops.pageTab === 'business'){
            if(!is(nextprops.pageTab,this.props.pageTab) || !is(nextprops.category.getIn([0, 'childList']),this.props.category.getIn([0, 'childList'])) && nextprops.category.getIn([0, 'childList']) && nextprops.category.getIn([0, 'childList']).size) {
                  this.setState({
                    expandedKeys:nextprops.category.getIn([0, 'childList']).toJS().filter(v => v.categoryType === 'LB_YYSR' || v.categoryType === 'LB_YYZC' || v.categoryType === 'LB_FYZC').map(v => v.uuid)
                })
            }
        }else{
            const nextCategoryList = nextprops.newJr === true ? nextprops.hideCategoryList && nextprops.hideCategoryList.size && nextprops.hideCategoryList.filter((item)=> item.get('childList') ? item.get('childList').filter(v => v.get('categoryType') !== 'LB_ZCWJZZS') : item.get('categoryType') !== 'LB_ZCWJZZS') : nextprops.hideCategoryList
            const thisCategoryList = this.props.newJr === true ? this.props.hideCategoryList && this.props.hideCategoryList.size && this.props.hideCategoryList.filter((item)=> item.get('childList') ? item.get('childList').filter(v => v.get('categoryType') !== 'LB_ZCWJZZS') : item.get('categoryType') !== 'LB_ZCWJZZS') : this.props.hideCategoryList
            if(!is(nextprops.pageTab,this.props.pageTab) || !is(nextCategoryList,thisCategoryList) && nextCategoryList && nextCategoryList.size) {
                  this.setState({
                    expandedKeys:nextCategoryList.toJS().map(v => v.uuid)
                })
            }
        }


    }

    onExpand = (expandedKeys) => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    }

    onChange = (value,dataList,category,pageTab) => {
        let chooseList = []
        dataList.map((item) => {
            if (item.key.indexOf(value) > -1) {
              chooseList.push(item.value)
            }
        })
        const expandedKeys = chooseList
        if(pageTab === 'business'){
            this.setState({
              expandedKeys,
              searchValue: value,
              autoExpandParent: true,
            });
        }


    }

	render() {

		const {
            pageTab,
            paymentType,
            paymentTypeStr,
            insertOrModify,
            category,
            onSelect,
            selectedKeys,
            flags,
            dispatch,
            hideCategoryList,
            disabledChangeCategory,
            oriTemp,
            className,
            curCategory,
            configPermission,
            newJr
        } = this.props
        const { searchValue, expandedKeys, autoExpandParent } = this.state
        // const configPermission = homeState.getIn(['permissionInfo','Config','edit','permission'])

        const loop = (data, defaultExpandedKeys, insertOrModify, specialStateforAssets, level, dataList) => data.map((item, i) => {

            let dataKey = `${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.oriAbstract}`
            let title = dataKey.indexOf(searchValue) > -1 && searchValue!='' ? <span style={{color: '#f50'}}>{item.name}</span> : <span>{item.name}</span>
            if (item.childList.length && item.canValid) {
                dataList.push({
                    key:`${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.oriAbstract}`,
                    value:`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}hasChild${Limit.TREE_JOIN_STR}'cantClick'`
                })
                return (
                    <TreeNode
                        key={item.uuid}
                        title={
                            <div className="tree-icon-title">
                                <span >
                                    <Tooltip placement="left" title={item.remark || ' '}>
                                        <XfnIcon type='editTip' style={{marginRight:'3px'}} />
                                    </Tooltip>
                                </span>
                                {title}
                            </div>
                        }
                        disabled={level === 1 && !item.childList.length && !item.beSpecial}

                    >
                        {loop(item.childList, defaultExpandedKeys, insertOrModify, specialStateforAssets, level+1, dataList)}

                    </TreeNode>
                )
            }
            dataList.push({
                key:`${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.oriAbstract}`,
                value:`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}hasnoChild${Limit.TREE_JOIN_STR}${level > 1 || item.beSpecial ? 'canClick' : 'cantClick'}`
            })
            return  item.canValid && (item.level !== 1 || item.beSpecial) ? <TreeNode
                        key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}hasnoChild${Limit.TREE_JOIN_STR}${level > 1  || item.beSpecial ? 'canClick' : 'cantClick'}`}
                        title={
                            <div className="tree-icon-title">
                                <span >
                                    <Tooltip placement="left" title={item.remark || ' '}>
                                        <XfnIcon type='editTip' style={{marginRight:'3px'}} />
                                    </Tooltip>
                                </span>
                                {title}
                            </div>
                        }
                        checkable
                        disabled={insertOrModify === 'modify' && curCategory.indexOf(item.uuid) === -1 && !changeCategoryAllowed(item.categoryType,this.props.oriTemp.get('canBeModifyCategory'))
                                || item.level === 1 && !item.childList.length && !item.beSpecial
                        }
                        className={!item.childList.length && item.disableList.length ? 'block-hidden':''}
                      >
                      </TreeNode>:''
          })
        const calculateLoop = (data, level, dataList) => data.map((item, i) => {
            if (item.childList.length) {
                return (
                    <TreeNode
                        key={`${item.uuid}`}
                        title={item.name}
                        disabled={ (paymentType !== item.categoryType && disabledChangeCategory)}
                    >
                        {calculateLoop(item.childList, level+1, dataList)}
                    </TreeNode>
                )
            }
            return item.level !== 1 ? <TreeNode key={`${item.categoryType}${Limit.TREE_JOIN_STR}${'true'}${Limit.TREE_JOIN_STR}${item.fullCategoryName}`} title={item.name} disabled={ (paymentType !== item.categoryType && disabledChangeCategory)}></TreeNode>:''

        })
        // const PageTab = flags.get('PageTab')
        // const accountType = flags.get('accountType')
        // const paymentType = flags.get('paymentType')
        // const modify = flags.get('modify')
        // const disabledManagement  = (modify || accountType === 'single') && (paymentType === 'LB_SFGL' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_JZSY')
        let defaultExpandedKeys = ['全部']
        const specialStateforAssets = flags.get('specialStateforAssets')
        // const handleAmount = oriTemp.get('handleAmount')
        let dataList = []
        const treeList = loop(category.getIn([0, 'childList']).toJS(), defaultExpandedKeys, insertOrModify, specialStateforAssets,1,dataList)
        // 新版屏蔽转出未交增值税
        const newCategoryList = newJr === true ? hideCategoryList && hideCategoryList.size && hideCategoryList.filter((item)=> item.get('childList') ? item.get('childList').filter(v => v.get('categoryType') !== 'LB_ZCWJZZS') : item.get('categoryType') !== 'LB_ZCWJZZS') : hideCategoryList
        return (
            <div className={pageTab === 'business' ? 'editRunning-inner-running' : 'editCalculate-inner-running'}>
                <div style={{display: pageTab === 'business' ? '' : 'none',height: '100%'}} className='editRunning-inner-running-box'>
                    <div className="tree-title-handle">
                        <Search className='lrls-search-tree' placeholder="搜索"  onSearch={(value) =>this.onChange(value,dataList,category.getIn([0, 'childList']).toJS(),pageTab)}/>
                        <Icon type="setting" className='lrls-setting-icon' title='流水设置' style={{color: configPermission ? '' : '#eee' }} onClick={()=>{
                            if(configPermission){
                                dispatch(homeActions.addPageTabPane('ConfigPanes', 'Running', 'Running', '流水设置'))
                                dispatch(homeActions.addHomeTabpane('Config', 'Running', '流水设置'))
                            }

                        }}/>
                    </div>
                    <div className="editRunning-inner-running-tree">
                        <Tree
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}

                            // defaultExpandAll={true}
                            defaultExpandParent={true}
                            // defaultExpandedKeys={defaultExpandedKeys}
                            onSelect={value => onSelect(value,this,expandedKeys)}
                            selectedKeys={selectedKeys}
                            >
                                {treeList}
                        </Tree>
                    </div>

                </div>
                <div style={{display: pageTab === 'business' ? 'none' : '',height: '100%'}}  className='editCalculate-inner-running-box'>
                    <div className="editCalculate-inner-running-tree">
                        <Tree
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            defaultExpandAll={true}
                            defaultExpandParent={true}
                            onSelect={value => {
                                if (value[0]) {
                                    const valueList = value[0].split(Limit.TREE_JOIN_STR)
                                    if(valueList[1] === 'true'){
                                        dispatch(editCalculateActions.justNewCalculatebusiness(valueList[0])) //切换清空
                                        dispatch(editRunningAllActions.changeEditCalculatePaymentType(valueList[0]))
                                        dispatch(innerCalculateActions.changeEditCalculateCommonString('',['views','paymentTypeStr'],valueList[2]))
                                    }else{
                                        if (expandedKeys.indexOf(valueList[0]) > -1) {
                                            expandedKeys.splice(expandedKeys.indexOf(valueList[0]),1)
                                            this.setState({expandedKeys,autoExpandParent: false})
                                        } else {
                                            expandedKeys.push(valueList[0])
                                            this.setState({expandedKeys,autoExpandParent: false})
                                        }
                                    }

                                }
                            }}
                            selectedKeys={[`${paymentType}${Limit.TREE_JOIN_STR}true${Limit.TREE_JOIN_STR}${paymentTypeStr}`]}
                            >
                                {
                                    newCategoryList && newCategoryList.size && calculateLoop(newCategoryList.toJS() || [],1,[])
                                    // newCategoryList && newCategoryList.size ? newCategoryList.map(item => {
                                    //     return <TreeNode key={`${item.get('categoryType')}`} title={item.get('name')} disabled={ (paymentType !== item.get('categoryType') && disabledChangeCategory)}></TreeNode>
                                    // })
                                    // :
                                    // null
                                }
                        </Tree>
                    </div>

                </div>
            </div>
		)
	}
}
