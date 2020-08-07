import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import './Assets.less'
// import * as acconfigActions from 'app/actions/acconfig.action.js'
import { Icon } from 'app/components'
import * as thirdParty from 'app/thirdParty'
// import { Select }	from 'app/components'

@immutableRenderDecorator
export default
class Searchbar extends React.Component {

    render() {

        const { assetslist, dispatch } = this.props

        const option = assetslist.map(v => v.get('serialNumber').length === 7 )

        return (
            <div className="searchbar">
                <span className="searchbar-placeholder"><Icon type='search' style={{position: 'relative', top: '1px'}} size="14"/>&nbsp;搜索卡片</span>
                {/* <Select
                    className="searchbar-input"
                    combobox
                    type="tel"
                    searchPlaceholder={''}
                    value={''}
                    onClick={(e) => {
                        this.setState({assselectDisplay: true})
                    }}
                    onChange={value => {
                        // this.setState({assselectDisplay: false})
                        // value || dispatch(lrpzActions.changeJvAssIdAndAssName(idx, '', '', v.get('asscategory')))

                    }}
                    onSelect={value => {
                        // const result = valueToIdAndName(value)
                        // console.log(value)
                        const cardNumber = value.substr(3, 4)
                        const classificationNumber = value.substr(0, 3)
                        dispatch(assetsActions.getAssetsCardFetch(cardNumber, classificationNumber))
                        // dispatch(lrpzActions.changeJvAssIdAndAssName(idx, result.id, result.name, v.get('asscategory')))
                    }}
                    >
                    {
                        assetslist && assetslist
                        .filter(w => w.get('serialNumber').length === 7)
                        .map((u, j) =>
                            <Option key={j} value={[u.get('serialNumber'), '_', u.get('serialName')].join('')}>{[u.get('serialNumber'), '_', u.get('serialName')].join('')}</Option>
                        )
                    }
                </Select> */}
            </div>
        )
    }


}
