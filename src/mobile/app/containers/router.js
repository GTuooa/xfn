import React from 'react'
// import { Router, Route, Link } from 'react-router-dom'
import { Router, Route, Switch } from 'react-router-dom'
import { browserNavigator } from 'app/utils'
// import asyncComponent from './AsyncComponent'
import { ConnectedRouter } from 'connected-react-router';

// import createHistory from 'history/createHashHistory'
// const history = createHistory()
// export { history }
import { history } from 'app/utils'
global.routerHistory = history

sessionStorage.setItem("firstload", "first")

import Home from './Home'
import PleasureMask from 'app/components/PleasureMask'
// 录入
import Lrpz from './Edit/Lrpz/index/index'
import Lrls from './Edit/Lrls/index/index'
import EditApproval from './Edit/EditApproval/index/index'
import EditRunning from './Edit/EditRunning/index/index'
import Draft from './Edit/Draft/index/index'
import RunningPreview from './Edit/RunningPreview/index/index'
// 查看
import Cxpz from './Search/Cxpz/index/index'
import Fjgl from './Search/Fjgl/index/index'
import Cxls from './Search/Cxls/index/index'
import SearchRunning from './Search/SearchRunning/index/index'
import searchApproval from './Search/SearchApproval/index/index'
import Ylls from './Search/Ylls/index/index'
// 一般报表
import Lrb from './Report/Lrb/index/index'
import Zcfzb from './Report/Zcfzb/index/index'
import Xjllb from './Report/Xjllb/index/index'
import Yjsfb from './Report/Yjsfb/index/index'
import Boss from './Report/Boss/index/index'
import JrBoss from './Report/JrBoss/index/index'
import Ambsyb from './Report/Ambsyb/index/index'
import ExtraInformation from './Report/ExtraInformation/index/index'
import ExtraInformationSetting from './Report/ExtraInformation/index/ExtraInformationSettingIndex'
import Measure from './Report/Measure/index/index'
import Syxmb from './Report/Syxmb/index/index'
// 余额表
import AmountYeb from './Yeb/AmountYeb/index/index'
import AssYeb from './Yeb/AssYeb/index/index'
import CurrencyYeb from './Yeb/CurrencyYeb/index/index'
import Kmyeb from './Yeb/Kmyeb/index/index'
import AssetsYeb from './Yeb/AssetsYeb/index/index'
import LsYeb from './Yeb/Lsyeb/index/index'
import ZhYeb from './Yeb/Zhyeb/index/index'
import WlYeb from './Yeb/Wlyeb/index/index'
import XmYeb from './Yeb/Xmyeb/index/index'
import RelativeYeb from './Yeb/RelativeYeb/index/index'
import IncomeExpendYeb from './Yeb/IncomeExpendYeb/index/index'
import RunningTypeYeb from './Yeb/RunningTypeYeb/index/index'
import AccountYeb from './Yeb/AccountYeb/index/index'
import ProjectYeb from './Yeb/ProjectYeb/index/index'
// 明细表
import AmountMxb from './Mxb/AmountMxb/index/index'
import AssetsMxb from './Mxb/AssetsMxb/index/index'
import AssMxb from './Mxb/AssMxb/index/index'
import CurrencyMxb from './Mxb/CurrencyMxb/index/index'
import Kmmxb from './Mxb/Kmmxb/index/index'
import Lsmxb from './Mxb/Lsmxb/index/index'
import Zhmxb from './Mxb/Zhmxb/index/index'
import Wlmxb from './Mxb/Wlmxb/index/index'
import Xmmxb from './Mxb/Xmmxb/index/index'
import RelativeMxb from './Mxb/RelativeMxb/index/index'
import IncomeExpendMxb from './Mxb/IncomeExpendMxb/index/index'
import AccountMxb from './Mxb/AccountMxb/index/index'
import ProjectMxb from './Mxb/ProjectMxb/index/index'
import RunningTypeMxb from './Mxb/RunningTypeMxb/index/index'
import InventoryMxb from './Mxb/InventoryMxb/index/index'
// 设置
import Fee from './Fee/index/index'
import BillMessage from './Fee/index/BillMessageIndex'
import FeeContract from './Fee/index/FeeContractIndex'

import AcConfig from './Config/AcConfig/index/index'
import SobConfig from './Config/SobConfig/index/index'
import AssConfig from './Config/AssConfig/index/index'
import Qcye from './Config/Qcye/index/index'
import Jz from './Config/Jz/index/index'
import AmbConfig from './Config/AssConfig/index/AmbConfigIndex'
import Security from './Config/Security/index/index'
import ModifyAcUnit from './Config/AcConfig/index/ModifyAcUnitIndex'
import AcRelation from './Config/AcConfig/index/AcRelationIndex'
import AcAssets from './Config/AcConfig/index/AcAssetsIndex'
import AcOption from './Config/AcConfig/index/AcOptionIndex'
import ReversAcEdit from './Config/AcReverse/index/ReversAcEditIndex'
import AcReverse from './Config/AcReverse/index/index'
import ReverseSelect from './Config/AcReverse/index/ReverseSelectIndex'
import AssOption from './Config/AssConfig/index/AssOptionIndex'
import Currency from './Config/Currency/index/index'
import CurrencyAcRelation from './Config/Currency/index/CurrencyAcRelationIndex'
import CurrencyOption from './Config/Currency/index/CurrencyOptionIndex'
import Assets from './Config/Assets/index/index'
import AssetsCategory from './Config/Assets/index/AssetsCategoryIndex'
import AssetsCard from './Config/Assets/index/AssetsCardIndex'
import ReversAss from './Config/ReversAss/index/index'
// 旧流水设置
// import AccountConfig from './Config/AccountConfig/index/index'
// import AccountACMenu from './Config/AccountConfig/index/AccountACMenuIndex'
// import AccountInsert from './Config/AccountConfig/index/AccountInsertIndex'
// import RepentPattern from './Config/AccountConfig/index/RepentPatternIndex'
// 新流水设置
import RunningConfig from './Config/Running/index/index'

import Lsqc from './Config/Lsqc/index/index'
import LsqcEdit from './Config/Lsqc/Edit'

import InventoryConf from './Config/Inventory/index/index.js'
import ProjectConf from './Config/Project/index/index.js'
import RelativeConf from './Config/Relative/index/index.js'
// import AccountSetting from './Config/AccountSetting/index/index'
import AccountConfig from './Config/Account/index/index'
// import AccountCard from './Config/AccountSetting/index/card'
import WarehouseConf from './Config/Warehouse/index/index.js'
import Approval from './Config/Approval/index/index.js'

import Page10006 from './Other/Page10006/index/index'
import SobWelcome from './Other/SobWelcome/index/index'
import Help from './Other/Help/index/index'
import Contract from './Other/Contract/index/index'
import PayGuide from './Other/PayGuide/index/index'
import JrGuide from './Other/JrGuide/index/index'
import GlGuide from './Other/GlGuide/index/index'
import Mask from './Other/Mask/app.js'
import TryPage from './Other/TryPage/index.js'

//录入流水页面新增卡片路由
import IUManage from './Edit/Lrls/index/IUManageIndex'//新增往来页面首页
import IUManageRelation from './Edit/Lrls/index/IUManageRelationIndex'//往来所属分类页面
import IUManageCategory from './Edit/Lrls/index/IUManageCategoryIndex'//往来所属分类类别页面
import Account from './Edit/Lrls/index/AccountIndex'//新增账户页面
import Inventory from './Edit/Lrls/index/InventoryIndex'//新增存货页面首页
import InventoryRelation from './Edit/Lrls/index/InventoryRelationIndex'//存货所属分类页面
import InventoryCategory from './Edit/Lrls/index/InventoryCategoryIndex'//存货所属分类类别页面
import InventoryYeb from './Yeb/InventoryYeb/index/index'

import PreviewPdf from './components/PreviewPdf/index/index.js'

const CreateRouter = () => (
    <ConnectedRouter history={history}>
        <div className={browserNavigator.versions.DingTalk && global.showOrgTrialEntry ? "body-wrap" : ''}>
            <PleasureMask/>
            <Mask/>
            {
                browserNavigator.versions.DingTalk && global.showOrgTrialEntry ?
                <TryPage />
                : null
            }
            <Route path="/" exact component={Home} />
            <Route path="/lrls" component={Lrls} />
            <Route path="/editApproval" component={EditApproval} />
            <Route path="/editrunning" component={EditRunning} />
            <Route path="/lrpz" component={Lrpz} />
            <Route path="/draft" component={Draft} />
            <Route path="/fjgl" component={Fjgl} />
            <Route path="/runningpreview" component={RunningPreview} />

            <Route path="/cxpz" component={Cxpz} />

            <Route path="/cxls" component={Cxls} />
            <Route path="/searchrunning" component={SearchRunning} />
            <Route path="/searchapproval" component={searchApproval} />
            <Route path="/ylls" component={Ylls} />
            <Route path="/previewpdf" component={PreviewPdf}/>

            <Route path="/lrb" component={Lrb} />
            <Route path="/zcfzb" component={Zcfzb} />
            <Route path="/xjllb" component={Xjllb} />
            <Route path="/yjsfb" component={Yjsfb} />
            <Route path="/boss" component={Boss} />
            <Route path="/jr/boss" component={JrBoss} />
            <Route path="/ambsyb" component={Ambsyb} />
            <Route path="/extraInformation" component={ExtraInformation} />
            <Route path="/extraInformationSetting" component={ExtraInformationSetting} />
            <Route path="/measure" component={Measure} />
            <Route path="/syxmb" component={Syxmb} />

            <Route path="/amountyeb" component={AmountYeb} />
            <Route path="/assyeb" component={AssYeb} />
            <Route path="/currencyyeb" component={CurrencyYeb} />
            <Route path="/kmyeb" component={Kmyeb} />
            <Route path="/assetsyeb" component={AssetsYeb} />
            <Route path="/lsyeb" component={LsYeb} />
            <Route path="/zhyeb" component={ZhYeb} />
            <Route path="/wlyeb" component={WlYeb} />
            <Route path="/xmyeb" component={XmYeb} />
            <Route path="/RelativeYeb" component={RelativeYeb} />
            <Route path="/AccountYeb" component={AccountYeb} />
            <Route path="/ProjectYeb" component={ProjectYeb} />
            <Route path="/IncomeExpendYeb" component={IncomeExpendYeb} />
            <Route path="/RunningTypeYeb" component={RunningTypeYeb} />

            <Route path="/amountmxb" component={AmountMxb} />
            <Route path="/assetsmxb" component={AssetsMxb} />
            <Route path="/assmxb" component={AssMxb} />
            <Route path="/currencymxb" component={CurrencyMxb} />
            <Route path="/kmmxb" component={Kmmxb} />
            <Route path="/lsmxb" component={Lsmxb} />
            <Route path="/zhmxb" component={Zhmxb} />
            <Route path="/wlmxb" component={Wlmxb} />
            <Route path="/xmmxb" component={Xmmxb} />
            <Route path="/relativemxb" component={RelativeMxb} />
            <Route path="/accountmxb" component={AccountMxb} />
            <Route path="/projectmxb" component={ProjectMxb} />
            <Route path="/runningTypemxb" component={RunningTypeMxb} />
            <Route path="/IncomeExpendmxb" component={IncomeExpendMxb} />
            <Route path="/inventoryMxb" component={InventoryMxb} />

            <Route path="/config/inventory" component={InventoryConf} />
            <Route path="/config/project" component={ProjectConf} />
            <Route path="/config/relative" component={RelativeConf} />
            <Route path="/config/approval" component={Approval} />
            <Route path="/inventoryyeb" component={InventoryYeb} />
            <Route path="/config/warehouse" component={WarehouseConf} />
            <Route path="/config/sob" component={SobConfig} />
            <Route path="/config/security" component={Security} />

            {/* 科目设置 */}
            <Switch>
                <Route path="/config/ac" component={AcConfig} />
                <Route path="/config/ass" component={AssConfig} />
                <Route path="/config/qcye" component={Qcye} />
                <Route path="/config/Jz" component={Jz} />
                <Route path="/config/amb" component={AmbConfig}/>
                <Route path="/config/modifyunit" component={ModifyAcUnit} />
                {/* <Route path="/config/acmenu" component={AccountACMenu} /> */}
                {/* <Route path="/config/accountconfig" component={AccountConfig} /> */}
                <Route path="/config/running" component={RunningConfig} />
                <Route path="/config/relation/ac" component={AcRelation} />
                {/* <Route path="/config/accountinsert" component={AccountInsert} /> */}
                {/* <Route path="/config/runninginsert" component={RunningInsert} /> */}
                {/* <Route path="/regretCategory" component={RepentPattern} /> */}
                {/* <Route path="/config/regretCategory" component={RegretPattern} /> */}

                <Route path="/config/lsqc" component={Lsqc} />
                <Route path="/config/lsqcedit" component={LsqcEdit} />


                <Route path="/config/account" component={AccountConfig} />
                {/* <Route path="/config/accountsettingCard" component={AccountCard} /> */}

                <Route path="/fee" component={Fee}/>
                {/* <Route path="/ordermessage" component={OrderMessage}/> */}
                <Route path="/billmessage" component={BillMessage}/>
                <Route path="/feecontract" component={FeeContract}/>

				<Route path="/config/option/ac" component={AcOption}/>
				<Route path="/config/option/ass" component={AssOption}/>
            </Switch>

            {/* 科目反悔 */}
            <Switch>
                <Route path="/reverse/reverseac" component={ReversAcEdit}/>
                <Route path="/reverse/reversselect" component={ReverseSelect}/>
                <Route path="/reverse/ac" component={AcReverse}/>
                <Route path="/reverse/reverseass" component={ReversAss}/>
            </Switch>

            {/* 外币设置 */}
            <Switch>
                <Route path="/currency/currencyconfig" component={Currency} />
                <Route path="/currency/relation/currencyac" component={CurrencyAcRelation} />
                <Route path="/currency/relation/currencyoption" component={CurrencyOption} />
            </Switch>

            {/* 资产设置 */}
            <Switch>
                <Route path="/assets/assets" component={Assets} />
                <Route path="/assets/assetsoption/category" component={AssetsCategory} />
                <Route path="/assets/assetsoption/card" component={AssetsCard} />
                <Route path="/assets/assetsoption/ac" component={AcAssets} />
            </Switch>

            {/* 收费 */}
            {/* <Route path="ztxq" component={Ztxq}/>
            <Route path="tcgm" component={Tcgm}/>
            <Route path="tcsj" component={Tcsj}/>
            <Route path="myorder" component={MyOrder}/> */}

            {/* 其余部分 */}
            <Switch>>
                <Route path="/other/page10006" component={Page10006} />
                <Route path="/other/sobwelcome" component={SobWelcome} />
                <Route path="/other/help" component={Help} />
                <Route path="/other/contract" component={Contract} />
                <Route path="/other/payguide" component={PayGuide}/>
                <Route path="/other/jrguide" component={JrGuide}/>
                <Route path="/other/glguide" component={GlGuide}/>
            </Switch>
            {/* <Route path="baseimg" component={BaseImg}/>
            <Route path="contract" component={Contract}/>
            <Route path="help" component={Help}/>
            <Route path="payguide" component={PayGuide}/> */}

            {/* 录入流水新增卡片 */}
            <Switch>
                <Route path="/lrls-iuManage" component={IUManage}/>
                <Route path="/lrls-iuManage-relation" component={IUManageRelation}/>
                <Route path="/lrls-iuManage-category" component={IUManageCategory}/>
                <Route path="/lrls-account" component={Account}/>
                <Route path="/lrls-inventory" component={Inventory}/>
                <Route path="/lrls-inventory-relation" component={InventoryRelation}/>
                <Route path="/lrls-inventory-category" component={InventoryCategory}/>
            </Switch>
        </div>
    </ConnectedRouter>
)

export default CreateRouter
