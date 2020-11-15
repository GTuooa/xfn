import React from 'react'
import { connect } from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Container, Row, ScrollView, Icon, TextareaItem, Amount, TextListInput, PopUp, Radio, XfInput } from 'app/components'
import { RadioCom, CategoryCom, AmountCom, BillCom, CleanCom, HxCom, HandleType, HandleCategory, PropertyCostCom, CarryoverCom, StockCom, SingleProjectCom, CurrentCom, AccountMoreCom, Poundage, CarryoverYyzc } from './components'
import Enclosure from 'app/containers/components/Enclosure'

import JrPage from './jrPage/index.js'
import jrFunc from './jrPage/jrFunc'
import './style.less'

import { DateLib, throttle } from 'app/utils'
import { TopDatePicker } from 'app/containers/components'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as editRunning from 'app/constants/editRunning.js'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action.js'
import { showProject } from 'app/redux/Edit/EditRunning/EditFunc/index.js'
import { homeActions } from 'app/redux/Home/home.js'


@connect(state => state)
export default
  class EditRunning extends React.Component {
  state = {
    codeRepeatModal: false,
    autoEncode: '',
    encodeList: []
  }

  componentDidMount () {
    thirdParty.setTitle({ title: '录入流水' })
    thirdParty.setIcon({ showIcon: false })
    thirdParty.setRight({ show: false })

    this.props.dispatch(homeActions.setDdConfig()) // 鉴权
    sessionStorage.removeItem('routerPage')

    const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
    function scrollFn (e) {
      const scrollHeight = e.target.scrollHeight
      const clientHeight = e.target.clientHeight
      if (scrollHeight <= clientHeight) {//个别机型在滚动条消失时没有回到最顶端导致页面被遮住
        e.target.scrollTop = 0
      }
    }
    const throttleFn = throttle(scrollFn)

    scrollViewHtml.addEventListener('scroll', function (e) {
      throttleFn(e)
    }, false)

    const ylType = sessionStorage.getItem('ylToLr')
    if (['MODIFY', 'COPY'].includes(ylType)) {//从预览页面跳入
      sessionStorage.removeItem('ylToLr')
      sessionStorage.setItem('prevPage', 'editrunning')
      this.props.dispatch(editRunningActions.fromYlToLr(ylType))

      const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
      const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
      const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
      if (enCanUse && checkMoreFj) {
        this.props.dispatch(editRunningActions.getLabelFetch())
      }
      const isOpenedWarehouse = moduleInfo.includes('WAREHOUSE')
      if (isOpenedWarehouse) {//开启了仓库管理
        this.props.dispatch(editRunningActions.getWarehouseCardList())
      }
      return
    }

    const prevPage = sessionStorage.getItem('prevPage')
    if (['home', 'searchrunning', 'runningpreview'].includes(prevPage)) {//从主页 查询流水 预览流水新增流水
      sessionStorage.removeItem('prevPage')
      this.props.dispatch(editRunningActions.accountSaveAndNew())
      this.props.dispatch(allRunningActions.getRunningSettingInfo())
      this.props.dispatch(editRunningActions.changeLrlsEnclosureList())

      const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
      const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
      const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
      if (enCanUse && checkMoreFj) {
        this.props.dispatch(editRunningActions.getLabelFetch())
      }
      const isOpenedWarehouse = moduleInfo.includes('WAREHOUSE')
      if (isOpenedWarehouse) {//开启了仓库管理
        this.props.dispatch(editRunningActions.getWarehouseCardList())
      }
    }
  }

  componentDidUpdate (prevProps) {
    const oriState = this.props.editRunningState.getIn(['oriTemp', 'oriState'])
    const prevOriState = prevProps.editRunningState.getIn(['oriTemp', 'oriState'])
    if (oriState != prevOriState) {//改变样式
      const runningTextarea = document.getElementsByName("running-textarea")[0]
      runningTextarea.focus()
      runningTextarea.blur()
    }
  }

  render () {
    const { dispatch, history, editRunningState, homeState, allState } = this.props
    const { codeRepeatModal, autoEncode, encodeList } = this.state

    const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
    const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

    const lastCategory = allState.get('oriCategory')
    const accountListOri = allState.get('accountList')
    const accountListJson = []
    accountListOri.size && accountListOri.getIn([0, 'childList']).forEach((v, i) => {
      let item = v.toJS()
      item['key'] = item['name']
      item['value'] = `${item['uuid']}${Limit.TREE_JOIN_STR}${item['name']}`
      accountListJson.push(item)
    })
    const accountList = fromJS(accountListJson)

    const insertOrModify = editRunningState.getIn(['views', 'insertOrModify'])
    const isCopy = editRunningState.getIn(['views', 'ylType']) == 'COPY'
    const isModify = insertOrModify === 'modify' ? true : false
    const showJrPage = editRunningState.getIn(['views', 'showJrPage'])
    const commonCardList = editRunningState.get('commonCardList').toJS()
    const commonCurrentList = editRunningState.get('commonCurrentList').toJS()
    const cardAllList = editRunningState.get('cardAllList')

    const oriTemp = editRunningState.get('oriTemp')
    const oriDate = oriTemp.get('oriDate')
    const jrIndex = oriTemp.get('jrIndex')
    const oriState = oriTemp.get('oriState')
    const categoryType = oriTemp.get('categoryType')
    const categoryUuid = oriTemp.get('categoryUuid')
    const categoryName = oriTemp.get('categoryName')
    const oriAbstract = oriTemp.get('oriAbstract')
    const amount = oriTemp.get('amount')
    const accounts = oriTemp.get('accounts')
    const jrAmount = oriTemp.get('jrAmount')
    const propertyCarryover = oriTemp.get('propertyCarryover')
    const isHw = propertyCarryover == 'SX_HW' ? true : false//是否是货物属性
    const handleType = oriTemp.get('handleType')//处理类型
    const usedAccounts = oriTemp.get('usedAccounts')//是否开启多账户

    const beAccrued = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beAccrued'])//是否开启计提
    const beWelfare = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beWelfare'])// 是否过渡福利费
    const propertyTax = oriTemp.get('propertyTax')//税费性质
    const propertyPay = oriTemp.get('propertyPay')//薪酬性质


    //项目
    const beProject = oriTemp.get('beProject')//类别是否开启项目管理
    const usedProject = oriTemp.get('usedProject')//流水是否开启项目
    const projectCategoryList = editRunningState.get('projectCategoryList')
    const commonProjectList = editRunningState.get('commonProjectList')
    const projectRange = oriTemp.get('projectRange') ? oriTemp.get('projectRange') : fromJS([])
    const projectCardList = oriTemp.get('projectCardList') ? oriTemp.get('projectCardList') : fromJS([])//选中的项目卡片列表
    const projectList = editRunningState.get('projectList') ? editRunningState.get('projectList') : fromJS([])//所有的项目卡片列表
    let isShowProject = beProject ? showProject(oriTemp) : false//类别处是否显示项目按钮
    if (isModify && oriTemp.get('oriUsedProject')) {
      isShowProject = true
      if (categoryType == 'LB_JZCB' && ['STATE_YYSR_XS', 'STATE_YYSR_TS'].includes(oriState)) {
        isShowProject = false
      }
      if (['LB_GGFYFT', 'LB_SFGL'].includes(categoryType)) {
        isShowProject = false
      }
    }


    //往来关系列表
    const usedCurrent = oriTemp.get('usedCurrent')//流水是否开启往来单位
    const currentList = editRunningState.get('currentList') ? editRunningState.get('currentList') : fromJS([])
    const beManagemented = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beManagemented'])//收付管理
    const contactsRange = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'contactsRange'])//往来单位范围
    const allContactsRange = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'allContactsRange'])//所有往来单位范围
    const currentCategoryList = editRunningState.get('currentCategoryList')//卡片类别列表
    const currentCardList = oriTemp.get('currentCardList') ? oriTemp.get('currentCardList') : fromJS([])//被选中的往来单位
    let contactsManagement = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'contactsManagement'])//往来管理
    const oriUsedCurrent = oriTemp.get('oriUsedCurrent')
    if (isModify && oriUsedCurrent) {
      contactsManagement = true
    }

    //发票
    const scale = allState.getIn(['taxRate', 'scale'])
    const payableRate = allState.getIn(['taxRate', 'payableRate'])//小规模默税率
    const outputRate = allState.getIn(['taxRate', 'outputRate'])//一般纳税人默税率
    const rateOptionList = allState.getIn(['taxRate', 'rateOptionList'])//税率列表
    const billList = oriTemp.get('billList')
    const billStrongList = oriTemp.get('billStrongList') ? oriTemp.get('billStrongList') : fromJS([])

    //处置损益
    const beCleaning = oriTemp.get('beCleaning')
    const assets = oriTemp.get('assets')
    const carryoverStrongList = oriTemp.get('carryoverStrongList') ? oriTemp.get('carryoverStrongList') : fromJS([])//修改时用

    //费用性质
    const propertyCostList = oriTemp.get('propertyCostList')
    const propertyCost = oriTemp.get('propertyCost')

    //存货
    const stockList = editRunningState.get('stockList')//存货卡片列表
    const stockCardList = oriTemp.get('stockCardList')//选择的存货卡片
    const stockCardOtherList = oriTemp.get('stockCardOtherList')//成品明细存货卡片
    const stockRange = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'stockRange'])
    const allStockRange = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'allStockRange'])//所有存货范围
    const stockCategoryList = editRunningState.get('stockCategoryList')//卡片类别列表
    const showStockCom = (isHw || propertyCarryover == 'SX_HW_FW') && ['STATE_YYSR_XS', 'STATE_YYSR_TS', 'STATE_YYZC_GJ', 'STATE_YYZC_TG'].includes(oriState) ? true : false
    const usedStock = oriTemp.get('usedStock')//服务加存货 是否开启存货
    const isOpenedWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理
    const warehouseList = oriState == 'STATE_CHYE_TYDJ' ? editRunningState.get('warehouseListTydj') : editRunningState.get('warehouseList')//仓库卡片列表
    const openQuantity = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('QUANTITY')//开启数量管理的灰度

    //结转成本
    const beCarryover = oriTemp.get('beCarryover')//货物结转成本
    const carryoverCardList = oriTemp.get('carryoverCardList')
    const stockStrongList = oriTemp.get('stockStrongList') ? oriTemp.get('stockStrongList') : fromJS([])

    //核算管理-结转损益 折旧摊销 收付管理 结转成本处理类别的信息
    const categoryList = editRunningState.get('categoryList')
    let uuid = oriTemp.get('uuid')
    let name = oriTemp.get('name')
    if (categoryType == 'LB_SFGL') {
      uuid = oriTemp.getIn(['pendingManageDto', 'categoryUuid'])
      name = oriTemp.getIn(['pendingManageDto', 'categoryName'])
    }
    if (['LB_JZCB', 'LB_JXSEZC', 'LB_JZSY', 'LB_ZJTX'].includes(categoryType)) {
      uuid = oriTemp.get('relationCategoryUuid')
      name = oriTemp.get('relationCategoryName')
    }


    //下方单据列表
    const pendingStrongList = oriTemp.get('pendingStrongList') ? oriTemp.get('pendingStrongList') : fromJS([])
    const strongList = oriTemp.get('strongList') ? oriTemp.get('strongList') : fromJS([])//核销流水
    const hasSelect = pendingStrongList.some(v => v.get('beSelect'))
    const jrObj = jrFunc(categoryType, oriState, beAccrued, propertyTax, propertyPay, beWelfare, usedProject, usedCurrent)

    //转出未缴增值税
    let outputCount = 0, inputCount = 0, outputAmount = 0, inputAmount = 0
    if (categoryType == 'LB_ZCWJZZS' && pendingStrongList.size) {
      pendingStrongList.forEach(v => {
        if (v.get('pendingStrongType') === 'JR_STRONG_STAY_ZCXX') {//销项税
          outputCount++
          outputAmount += v.get('taxAmount')
        } else {
          inputCount++
          inputAmount += v.get('taxAmount')
        }
      })
    }

    //附件
    const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
    const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
    const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false

    const label = editRunningState.get('label')
    const enclosureList = editRunningState.get('enclosureList')
    const uploadKeyJson = allState.get('uploadKeyJson')
    let previewImageList = []
    enclosureList.map(v => {
      if (v.get('imageOrFile') === 'TRUE') {
        previewImageList.push(v.get('signedUrl'))
      }
    })

    const showRepeatJrindex = (value, valueList) => {//流水号重复
      this.setState({ 'codeRepeatModal': true, autoEncode: value, encodeList: valueList })
    }
    //手续费
    const accountPoundage = allState.get('accountPoundage')
    const poundageCurrentList = editRunningState.get('poundageCurrentList')
    const poundageProjectList = editRunningState.get('poundageProjectList')
    const poundageCurrentRange = editRunningState.get('poundageCurrentRange').toJS()
    const poundageProjectRange = editRunningState.get('poundageProjectRange').toJS()

    //营业支出零库存直接结转
    const beZeroInventory = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beZeroInventory'])
    const usedCarryoverProject = oriTemp.get('usedCarryoverProject')
    const carryoverProjectCardList = oriTemp.get('carryoverProjectCardList')

    return (
      <Container className="edit-running">
        <TopDatePicker
          value={oriDate}
          onChange={date => {
            dispatch(editRunningActions.changeHomeAccountOriDate(new DateLib(date).valueOf(), isModify))
          }}
          callback={(value) => {
            dispatch(editRunningActions.changeHomeAccountOriDate(value, isModify))
          }}
        />

        <ScrollView flex="1">
          {(isModify && (!isCopy)) ?
            <Row className='lrls-row lrls-more-card'>
              <label>流水号：</label>
              <XfInput.BorderInputItem
                placeholder='填写流水号'
                value={jrIndex}
                onChange={(value) => {
                  if (/^\d*$/g.test(value) || value == '') {
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'jrIndex'], value))
                  }
                }}
              />
              <span className='lrls-margin-left'>号</span>
            </Row> : null
          }
          <div className='lrls-card'>
            <CategoryCom
              scale={scale}
              isModify={isModify}
              disabled={isModify && !oriTemp.get('canBeModifyCategory')}
              dispatch={dispatch}
              lastCategory={lastCategory}
              categoryUuid={categoryUuid}
              categoryName={categoryName}
              categoryType={categoryType}
              isOpenedWarehouse={isOpenedWarehouse}
              openQuantity={openQuantity}
            />
            <HandleType
              disabled={isModify}
              dispatch={dispatch}
              categoryType={categoryType}
              handleType={handleType}
            />
            <HandleCategory
              disabled={isModify}
              dispatch={dispatch}
              categoryType={categoryType}
              categoryList={categoryList}
              beProject={beProject}
              uuid={uuid}
              name={name}
            />
            <PropertyCostCom
              dispatch={dispatch}
              categoryType={categoryType}
              oriState={oriState}
              propertyCostList={propertyCostList}
              propertyCost={propertyCost}
              hasSelect={hasSelect}
            />
            {
              categoryType == 'LB_XMJZ' ? <SingleProjectCom
                usedProject={usedProject}
                projectCardList={projectCardList}
                projectList={projectList}
                dispatch={dispatch}
                categoryType={categoryType}
                oriState={oriState}
                propertyPay={propertyPay}
                history={history}
                projectRange={projectRange}
                projectCategoryList={projectCategoryList}
                commonProjectList={commonProjectList}
                propertyCarryover={propertyCarryover}
                propertyCostList={propertyCostList}
                isModify={isModify}
                handleType={handleType}
                showXmjz={true}
              /> : null
            }
            <RadioCom
              isModify={isModify}
              dispatch={dispatch}
              oriTemp={oriTemp}
              isOpenedWarehouse={isOpenedWarehouse}
              openQuantity={openQuantity}
              projectShareType={cardAllList.get('projectShareType')}
              isCopy={isCopy}
            />
          </div>

          <Row className='lrls-card'>
            {/* 直接结转成本显示 */}
            <div className='lrls-bottom' style={{ display: oriState == 'STATE_YYSR_ZJ' ? '' : 'none' }}>
              <HandleCategory
                disabled={isModify}
                dispatch={dispatch}
                categoryType={categoryType}
                categoryList={categoryList}
                beProject={beProject}
                uuid={uuid}
                name={name}
                showJzcb={true}
                oriState={oriState}
              />
            </div>
            <PropertyCostCom
              dispatch={dispatch}
              categoryType={categoryType}
              oriState={oriState}
              propertyCostList={propertyCostList}
              propertyCost={propertyCost}
              hasSelect={hasSelect}
              isHandleCategory={true}
            />
            <div className='lrls-line'>
              <label>摘要：</label>
              <TextareaItem
                name='running-textarea'
                placeholder='摘要填写'
                value={oriAbstract}
                onChange={(value) => {
                  dispatch(editRunningActions.changeLrlsData(['oriTemp', 'oriAbstract'], value))
                }}
                onFocus={() => {
                  const runningTextarea = document.getElementsByName("running-textarea")[0]
                  if (runningTextarea.setSelectionRange) {
                    runningTextarea.setSelectionRange(oriAbstract.length, oriAbstract.length)
                  }
                }}
              />
            </div>
          </Row>

          {
            contactsManagement ? <CurrentCom
              history={history}
              dispatch={dispatch}
              currentList={currentList}
              currentCardList={currentCardList}
              contactsRange={contactsRange}
              categoryType={categoryType}
              oriState={oriState}
              isModify={isModify}
              strongListSize={strongList.size}
              stockStrongListSize={stockStrongList.size}
              usedCurrent={usedCurrent}
              beAccrued={beAccrued}
              oriUsedCurrent={oriUsedCurrent}
              allContactsRange={currentCategoryList}
              commonCurrentList={commonCurrentList}
              isCopy={isCopy}
            /> : null
          }

          {
            isShowProject ? <SingleProjectCom
              usedProject={usedProject}
              projectCardList={projectCardList}
              projectList={projectList}
              dispatch={dispatch}
              categoryType={categoryType}
              oriState={oriState}
              propertyPay={propertyPay}
              history={history}
              projectRange={projectRange}
              projectCategoryList={projectCategoryList}
              commonProjectList={commonProjectList}
              propertyCarryover={propertyCarryover}
              propertyCostList={propertyCostList}
              isModify={isModify}
              handleType={handleType}
              relationCategoryType={oriTemp.get('relationCategoryType')}
            /> : null
          }

          {
            showStockCom ? <StockCom
              dispatch={dispatch}
              stockList={stockList}
              stockCardList={stockCardList}
              stockRange={stockRange}
              history={history}
              categoryType={categoryType}
              cardDisabled={isModify && beCarryover}
              propertyCarryover={propertyCarryover}
              usedStock={usedStock}
              isOpenedWarehouse={isOpenedWarehouse}
              warehouseList={warehouseList}
              allStockRange={stockCategoryList}
              commonCardList={commonCardList}
            /> : null
          }

          <AmountCom
            history={history}
            isModify={isModify}
            dispatch={dispatch}
            oriTemp={oriTemp}
            accountList={accountList}
            accounts={accounts}
            pendingStrongList={pendingStrongList}
            stockList={stockList}
            stockCardList={stockCardList}
            projectCardList={projectCardList}
            projectList={projectList}
            hasSelect={hasSelect}
            isOpenedWarehouse={isOpenedWarehouse}
            warehouseList={warehouseList}
            stockCategoryList={stockCategoryList}
            commonCardList={commonCardList}
            stockCardOtherList={stockCardOtherList}
            projectCategoryList={projectCategoryList}
            commonProjectList={commonProjectList}
            cardAllList={cardAllList}
          />

          {
            usedAccounts && ['LB_YYSR', 'LB_YYZC', 'LB_FYZC'].includes(categoryType) ?
              <AccountMoreCom
                dispatch={dispatch}
                history={history}
                accountList={accountList}
                accounts={accounts}
                beManagemented={beManagemented}
                oriState={oriState}
              /> : null
          }

          {
            !isModify && accountPoundage.get('uuid') && accountPoundage.get('canUsed') ? <Poundage
              dispatch={dispatch}
              oriTemp={oriTemp}
              accounts={accounts}
              accountPoundage={accountPoundage}
              poundageCurrentList={poundageCurrentList}
              poundageProjectList={poundageProjectList}
              contactsRange={contactsRange ? contactsRange.toJS() : []}
              poundageCurrentRange={poundageCurrentRange}
              poundageProjectRange={poundageProjectRange}
              beManagemented={beManagemented}
              usedProject={usedProject}
              usedCurrent={usedCurrent}
              categoryType={categoryType}
              history={history}
            /> : null
          }

          {
            scale == 'isEnable' && !isModify ? null : <BillCom
              dispatch={dispatch}
              categoryType={categoryType}
              oriState={oriState}
              billList={billList}
              amount={amount}
              scale={scale}
              payableRate={payableRate}
              outputRate={outputRate}
              billStrongList={billStrongList}
              isModify={isModify}
              oriBillType={oriTemp.get('oriBillType')}
              rateOptionList={rateOptionList}
            />
          }

          {
            !isModify && handleType == 'JR_HANDLE_CZ' ? <CleanCom
              dispatch={dispatch}
              amount={amount}
              beCleaning={beCleaning}
              assets={assets}
              beProject={beProject}
              usedProject={usedProject}
              projectCardList={projectCardList}
              projectList={projectList}
            /> : null
          }

          {
            isModify && carryoverStrongList.size ? <Row className='lrls-row'>结转流水：{`${carryoverStrongList.getIn([0, 'oriDate'])} ${carryoverStrongList.getIn([0, 'jrIndex'])}`}号</Row> : null
          }
          {
            isModify && stockStrongList.size ? <Row className='lrls-row'>结转成本流水：{`${stockStrongList.getIn([0, 'oriDate'])} ${stockStrongList.getIn([0, 'jrIndex'])}`}号</Row> : null
          }

          {
            (isHw || usedStock) && (oriState == 'STATE_YYSR_XS' || oriState == 'STATE_YYSR_TS') && !isModify ? <CarryoverCom
              dispatch={dispatch}
              stockCardList={stockCardList}
              carryoverCardList={carryoverCardList}
              beCarryover={beCarryover}
              isOpenedWarehouse={isOpenedWarehouse}
              isCopy={isCopy}
            /> : null
          }
          {
            beZeroInventory && isHw && oriState == 'STATE_YYZC_GJ' && !isModify ? <CarryoverYyzc
              dispatch={dispatch}
              beCarryover={beCarryover}
              categoryList={categoryList}
              usedCarryoverProject={usedCarryoverProject}
              carryoverProjectCardList={carryoverProjectCardList}
              relationCategoryUuid={oriTemp.get('relationCategoryUuid')}
              relationCategoryName={oriTemp.get('relationCategoryName')}
              relationObj={oriTemp.get('relationObj').toJS()}
              carryoverProject={editRunningState.get('carryoverProject')}
              propertyCost={propertyCost}
              usedProject={usedProject}
              projectCardList={projectCardList}
              projectRange={projectRange}
            /> : null
          }


          {/* 单据列表 */}
          <HxCom
            categoryType={categoryType}
            oriState={oriState}
            pendingStrongList={pendingStrongList}
            jrAmount={jrAmount}
            beAccrued={beAccrued || beWelfare}
            propertyTax={propertyTax}
            propertyPay={propertyPay}
            strongList={strongList}
            dispatch={dispatch}
            projectProperty={projectCardList.getIn([0, 'projectProperty'])}
            isCopy={isCopy}
          />

          <Row className='lrls-card lrls-type'
            style={{ display: !hasSelect && (pendingStrongList.size || oriState === 'STATE_GGFYFT') && jrObj['showJr'] ? '' : 'none' }}
          >
            <span>关联核销</span>
            <span
              className='lrls-placeholder'
              onClick={() => {
                dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
              }}>
              选择核销流水 <Icon type="arrow-right" />
            </span>
          </Row>
          <Row className='ylls-card yysr-carryover lrls-button-wrap'
            style={{ display: categoryType == 'LB_ZCWJZZS' && pendingStrongList.size ? '' : 'none' }}
          >
            <div>
              <div>销项税-流水数：{outputCount}条；合计税额：<Amount showZero>{outputAmount}</Amount></div>
              <div>进项税-流水数：{inputCount}条；合计税额：<Amount showZero>{inputAmount}</Amount></div>
            </div>
            <Row>
              <span
                className='lrls-button'
                onClick={() => {
                  dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
                }}>
                查看
							</span>
            </Row>
          </Row>

          {/* 附件 */}
          <Enclosure
            formPage={'EditRunning'}
            className={''}
            dispatch={dispatch}
            enCanUse={enCanUse}
            editPermission={editPermission}
            enclosureList={enclosureList}
            showPzfj={false}
            checkMoreFj={checkMoreFj}
            label={label.toJS()}
            previewImageList={previewImageList}
            showckpz={false}
            uploadFiles={(value) => {
              dispatch(editRunningActions.uploadFiles(...value))
            }}
            getUploadGetTokenFetch={() => {
              dispatch(editRunningActions.getUploadGetTokenFetch())
            }}
            getLabelFetch={() => dispatch(editRunningActions.getLabelFetch())}
            deleteUploadImgUrl={(index) => dispatch(editRunningActions.deleteUploadFJUrl(index))}
            changeTagName={(index, tagValue) => dispatch(editRunningActions.changeTagName(index, tagValue))}
            uploadKeyJson={uploadKeyJson}
            history={history}
          />
        </ScrollView>

        { showJrPage ? <JrPage categoryType={categoryType} isModify={isModify} /> : null}

        <PopUp
          title={`流水号：${jrIndex}号已存在，您可以：`}
          onCancel={() => this.setState({ autoEncode: 'true', codeRepeatModal: false })}
          visible={codeRepeatModal}
          footerVisible={false}
          footer={[
            <span key='cancel' onClick={() => this.setState({ autoEncode: 'true', codeRepeatModal: false })}>取消</span>,
            <span key='sure'
              onClick={() => {
                this.setState({ 'codeRepeatModal': false })
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'encodeType'], autoEncode))
                dispatch(editRunningActions.saveEditRunning(false))
              }}>
              确定
						</span>
          ]}
        >
          <div className="code-repeat-select">
            <Radio
              list={encodeList}
              value={autoEncode}
              onChange={(value) => {
                this.setState({ 'autoEncode': value })
              }}
            />
          </div>
        </PopUp>

        <ButtonGroup style={{ borderTop: '1px solid #D8D8D8' }}>
          <Button
            disabled={!editPermission}
            onClick={() => {
              if (categoryType == 'LB_HOME') {
                thirdParty.Alert('请选择类别')
                return
              }
              dispatch(editRunningActions.saveEditRunning(false, showRepeatJrindex))
            }}
          >
            <Icon type="save" />
            <span>保存</span>
          </Button>
          <Button
            disabled={!editPermission}
            onClick={() => {
              if (categoryType == 'LB_HOME') {
                thirdParty.Alert('请选择类别')
                return
              }
              dispatch(editRunningActions.saveEditRunning(true, showRepeatJrindex))
            }}
          >
            <Icon type="new" />
            <span>保存并新增</span>
          </Button>
        </ButtonGroup>
      </Container>
    )
  }
}
