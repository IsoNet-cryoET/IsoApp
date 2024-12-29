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
    console.log('inside', prevMessages, newMsg)
    if (!prevMessages || prevMessages.length == 0) {
        console.log('first')
        prevMessages = [newMsg]
        return prevMessages
    } else if (newMsg.type === 'bar' && prevMessages[prevMessages.length - 1]?.type === 'bar') {
        console.log('second')
        return [...prevMessages.slice(0, -1), newMsg]
    } else {
        console.log('third')
        return [...prevMessages, newMsg]
    }
}

// export const processJson = (msg) => {
//     return {
//         type: 'json',
//         cmd: msg.cmd,
//         output: msg.output
//     }
// }
