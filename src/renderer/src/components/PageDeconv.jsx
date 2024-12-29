import React from 'react'
import { renderContent } from './log_handler'
const PageDeconv = (props) => {
    return <div>{renderContent(props.deconvMessages)}</div>
}

export default PageDeconv
