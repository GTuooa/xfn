// //
// // 收费
// import feeState from 'app/redux/Fee'
// import tcgmState from 'app/redux/Fee/Tcgm'
// import tcxqState from 'app/redux/Fee/Tcxq'
//
// // 录入
// import lrpzState from 'app/redux/Edit/Lrpz'
// import draftState from 'app/redux/Edit/Draft'
// import pzBombState from 'app/redux/Edit/PzBomb'
// import lrAccountState from 'app/redux/Edit/LrAccount'
// import lrCalculateState from 'app/redux/Edit/LrAccount/lrCalculate'
//
// // 查询
// import cxpzState from 'app/redux/Search/Cxpz'
// import cxlsState from 'app/redux/Search/Cxls'
// import fjglState from 'app/redux/Search/Fjgl'
// import calculationState from 'app/redux/Search/Calculation'
//
// // 报表
// import lrbState from 'app/redux/Report/Lrb'
// import zcfzbState from 'app/redux/Report/Zcfzb'
// import xjllbState from 'app/redux/Report/Xjllb'
// import yjsfbState from 'app/redux/Report/Yjsfb'
// import ambsybState from 'app/redux/Report/Ambsyb'
//
// // 余额表
// import kmyebState from 'app/redux/Yeb/Kmyeb'
// import assYebState from 'app/redux/Yeb/AssYeb'
// import AmyebState from 'app/redux/Yeb/AmountYeb'
// import currencyYebState from 'app/redux/Yeb/CurrencyYeb'
// import assetsYebState from 'app/redux/Yeb/AssetsYeb'
// import lsyeState from 'app/redux/Yeb/LsYeb'
//
// // 明细表
// import kmmxbState from 'app/redux/Mxb/Kmmxb'
// import assmxbState from 'app/redux/Mxb/AssMxb'
// import ammxbState from 'app/redux/Mxb/AmountMxb'
// import currencyMxbState from 'app/redux/Mxb/CurrencyMxb'
// import assetsMxbState from 'app/redux/Mxb/AssetsMxb'
// import lsmxState from 'app/redux/Mxb/LsMxb'
//
// // 设置
// import configState from 'app/redux/Config/Ac'
// import fzhsState from 'app/redux/Config/Ass'
// import qcyeState from 'app/redux/Config/Qcye'
// import currencyState from 'app/redux/Config/Currency'
// import assetsState from 'app/redux/Config/Assets'
// import sobConfigState from 'app/redux/Config/Sob'
// import jzState from 'app/redux/Config/Jz'
// import accountConfState from 'app/redux/Config/Account'
// import securityState from 'app/redux/Config/Security'
// import lsqcState from 'app/redux/Config/Lsqc'
// import iuConfigState from 'app/redux/Config/baseConf/intercourseUnitConfig'
// import inventorySettingState from 'app/redux/Config/baseConf/inventorySetting'
//
// export {
//     feeState,
//     tcgmState,
//     tcxqState,
//     lrpzState,
//     draftState,
//     pzBombState,
//     lrAccountState,
//     lrCalculateState,
//     cxpzState,
//     cxlsState,
//     fjglState,
//     calculationState,
//     lrbState,
//     zcfzbState,
//     xjllbState,
//     yjsfbState,
//     ambsybState,
//     kmyebState,
//     assYebState,
//     AmyebState,
//     currencyYebState,
//     assetsYebState,
//     lsyeState,
//     kmmxbState,
//     assmxbState,
//     ammxbState,
//     currencyMxbState,
//     assetsMxbState,
//     lsmxState,
//     configState,
//     fzhsState,
//     qcyeState,
//     currencyState,
//     assetsState,
//     sobConfigState,
//     jzState,
//     accountConfState,
//     securityState,
//     lsqcState,
//     iuConfigState,
//     inventorySettingState
// }
//
// // export const ReducerNames = {
// //     feeState: {
// //         name: 'feeState',
// //         // state: feeState
// //     },
// //     tcgmState: {
// //         name: 'tcgmState',
// //         // state: tcgmState
// //     },
// //     tcxqState: {
// //         name: 'tcxqState',
// //         // state: tcxqState
// //     },
// //     lrpzState: {
// //         name: 'lrpzState',
// //         // state: lrpzState
// //     },
// //     draftState: {
// //         name: 'draftState',
// //         // state: draftState
// //     },
// //     pzBombState: {
// //         name: 'pzBombState',
// //         // state: pzBombState
// //     },
// //     lrAccountState: {
// //         name: 'lrAccountState',
// //         // state: lrAccountState
// //     },
// //     lrCalculateState: {
// //         name: 'lrCalculateState',
// //         // state: lrCalculateState
// //     },
// //     cxpzState: {
// //         name: 'cxpzState',
// //         // state: cxpzState
// //     },
// //     cxlsState: {
// //         name: 'cxlsState',
// //         // state: cxlsState
// //     },
// //     fjglState: {
// //         name: 'fjglState',
// //         // state: fjglState
// //     },
// //     calculationState: {
// //         name: 'calculationState',
// //         // state: calculationState
// //     },
// //     lrbState: {
// //         name: 'lrbState',
// //         // state: lrbState
// //     },
// //     zcfzbState: {
// //         name: 'zcfzbState',
// //         // state: zcfzbState
// //     },
// //     xjllbState: {
// //         name: 'xjllbState',
// //         // state: xjllbState
// //     },
// //     yjsfbState: {
// //         name: 'yjsfbState',
// //         // state: yjsfbState
// //     },
// //     ambsybState: {
// //         name: 'ambsybState',
// //         // state: ambsybState
// //     },
// //     kmyebState: {
// //         name: 'kmyebState',
// //         // state: kmyebState
// //     },
// //     assYebState: {
// //         name: 'assYebState',
// //         // state: assYebState
// //     },
// //     AmyebState: {
// //         name: 'AmyebState',
// //         // state: AmyebState
// //     },
// //     currencyYebState: {
// //         name: 'currencyYebState',
// //         // state: currencyYebState
// //     },
// //     assetsYebState: {
// //         name: 'assetsYebState',
// //         // state: assetsYebState
// //     },
// //     lsyeState: {
// //         name: 'lsyeState',
// //         // state: lsyeState
// //     },
// //     kmmxbState: {
// //         name: 'kmmxbState',
// //         // state: kmmxbState
// //     },
// //     assmxbState: {
// //         name: 'assmxbState',
// //         // state: assmxbState
// //     },
// //     ammxbState: {
// //         name: 'ammxbState',
// //         // state: ammxbState
// //     },
// //     currencyMxbState: {
// //         name: 'currencyMxbState',
// //         // state: currencyMxbState
// //     },
// //     assetsMxbState: {
// //         name: 'assetsMxbState',
// //         // state: assetsMxbState
// //     },
// //     lsmxState: {
// //         name: 'lsmxState',
// //         // state: lsmxState
// //     },
// //     configState: {
// //         name: 'configState',
// //         // state: configState
// //     },
// //     fzhsState: {
// //         name: 'fzhsState',
// //         // state: fzhsState
// //     },
// //     qcyeState: {
// //         name: 'qcyeState',
// //         // state: qcyeState
// //     },
// //     currencyState: {
// //         name: 'currencyState',
// //         // state: currencyState
// //     },
// //     assetsState: {
// //         name: 'assetsState',
// //         // state: assetsState
// //     },
// //     sobConfigState: {
// //         name: 'sobConfigState',
// //         // state: sobConfigState
// //     },
// //     jzState: {
// //         name: 'jzState',
// //         // state: jzState
// //     },
// //     accountConfState: {
// //         name: 'accountConfState',
// //         // state: accountConfState
// //     },
// //     securityState: {
// //         name: 'securityState',
// //         // state: securityState
// //     },
// //     lsqcState: {
// //         name: 'lsqcState',
// //         // state: lsqcState
// //     },
// //     iuConfigState: {
// //         name: 'iuConfigState',
// //         // state: iuConfigState
// //     },
// //     inventorySettingState: {
// //         name: 'inventorySettingState',
// //         // state: inventorySettingState
// //     },
// // };
