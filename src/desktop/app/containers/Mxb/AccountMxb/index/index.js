import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=AccountMxb!./lazy'

const AccountMxb = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default AccountMxb
