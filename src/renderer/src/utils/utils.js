export const processMessage = (msg) => {
    const progressPercentage = msg.output.match(/(\d+)%/)
    if (progressPercentage) {
        return {
            type: 'bar',
            cmd: msg.cmd,
            description: msg.output.match(/^[^:]+/)[0],
            percentage: parseInt(progressPercentage?.[1] || 0, 10),
            details: msg.output.match(/^[^|]*\|[^|]*\|(.*)/)[1].trim()
        }
    } else {
        return {
            type: 'text',
            cmd: msg.cmd,
            output: msg.output
        }
    }
}

export const mergeMsg = (prevMessages, newMsg) => {
    if (!prevMessages) prevMessages = [newMsg]
    if (newMsg.type === 'bar' && prevMessages[prevMessages.length - 1].type === 'bar') {
        prevMessages[prevMessages.length - 1] = newMsg
        prevMessages = [...prevMessages]
    } else {
        prevMessages = [...prevMessages, newMsg]
    }
    return prevMessages
}

// export const processJson = (msg) => {
//     return {
//         type: 'json',
//         cmd: msg.cmd,
//         output: msg.output
//     }
// }
