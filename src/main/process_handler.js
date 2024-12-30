const { spawn } = require('child_process')

function toCommand(data) {
    let result = ''
    let cmd = ''
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let value = data[key]
            if (value === true) {
                value = 'True'
            } else if (value === false) {
                value = 'False'
            }

            if (key === 'command') {
                // Prepend the command value
                result = `${value}${result}`
                cmd = `${value}`
            } else if (
                key === 'even_odd_input' ||
                key === 'split_top_bottom_halves' ||
                key === 'only_print' ||
                key === 'inqueue'
            ) {
                // Do nothing for 'even_odd_input'
            } else {
                // Append key-value pair in the format "--key value"
                result += ` --${key} ${value}`
            }
        }
    }
    return { cmd, result }
}

const inQueueList = [] // List for queued processes
const notInQueueList = [] // List for non-queued processes
let currentInQueueProcess = null // Track the current inQueue process being executed

// Function to process the inQueue list
export function handleProcess(event, data) {
    const { cmd, result } = toCommand(data)
    if (data.hasOwnProperty('only_print') && data['only_print'] === true) {
        event.sender.send('python-stdout', { cmd: cmd, output: result })
    } else {
        if (data.inqueue) {
            inQueueList.push({ cmd, result, event })
            processInQueue()
        } else {
            notInQueueList.push({ cmd, result, event })
            processNotInQueue()
        }
    }
}

function processInQueue() {
    if (currentInQueueProcess) {
        inQueueList[0].event.sender.send('python-stdout', {
            cmd: inQueueList[0].cmd,
            output: 'Queued: ' + inQueueList[0].result
        })
        return
    }

    const nextProcess = inQueueList.shift()
    if (nextProcess) {
        currentInQueueProcess = nextProcess
        runProcess(nextProcess.cmd, nextProcess.result, nextProcess.event, () => {
            currentInQueueProcess = null // Clear when finished
            processInQueue() // Process the next inQueue job
        })
    }
}

// Function to process the notInQueue list
function processNotInQueue() {
    while (notInQueueList.length > 0) {
        const nextProcess = notInQueueList.shift()
        runProcess(nextProcess.cmd, nextProcess.result, nextProcess.event)
    }
}

// Function to spawn and handle a Python process
function runProcess(cmd, result, event, callback) {
    console.log(`Running command: isonet.py ${result}`)

    // Spawn the Python process
    const pythonProcess = spawn('isonet.py', [...result.split(' ')], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
    })

    event.sender.send('python-running', { cmd, output: 'running' })

    // Capture stdout
    pythonProcess.stdout.on('data', (data) => {
        event.sender.send('python-stdout', { cmd, output: data.toString() })
    })

    // Capture stderr
    pythonProcess.stderr.on('data', (data) => {
        event.sender.send('python-stderr', { cmd, output: data.toString() })
    })

    // Handle process close
    pythonProcess.on('close', (code) => {
        console.log(`Python process for ${cmd} exited with code ${code}`)

        if (code === 0 && (cmd === 'prepare_star' || cmd === 'star2json')) {
            fs.readFile('.to_node.json', 'utf8', (err, data) => {
                if (!err) {
                    const jsonData = data.split('\n').map((line) => JSON.parse(line))
                    event.sender.send('json-star', { cmd: 'prepare_star', output: jsonData })
                }
            })
        }

        event.sender.send('python-closed', { cmd, output: 'closed' })
        if (callback) callback() // Notify that the process has finished
    })
}

// ipcMain.on('run', (event, data) => {
//     const { cmd, result } = toCommand(data)
//     if (data.hasOwnProperty('only_print') && data['only_print'] === true) {
//         event.sender.send('python-stdout', { cmd: cmd, output: result })
//     } else {
//         console.log(`isonet.py ${result}`)

//         // Spawn the Python process
//         pythonProcess = spawn('isonet.py', [...result.split(' ')], {
//             detached: true, // Create a new process group
//             stdio: ['ignore', 'pipe', 'pipe'] // Ignore stdin, keep stdout/stderr
//         }) // Corrected the split

//         event.sender.send('python-running', { cmd: cmd, output: 'running' })

//         // Capture and print stdout in real time
//         pythonProcess.stdout.on('data', (data) => {
//             event.sender.send('python-stdout', { cmd: cmd, output: data.toString() })
//         })

//         pythonProcess.stderr.on('data', (data) => {
//             event.sender.send('python-stderr', { cmd: cmd, output: data.toString() })
//         })

//         // Handle process close event
//         pythonProcess.on('close', (code) => {
//             console.log(`Python process exited with code ${code}`)
//             if (code === 0 && (cmd === 'prepare_star' || cmd === 'star2json')) {
//                 fs.readFile('.to_node.json', 'utf8', (err, data) => {
//                     if (err) {
//                         console.error('Error reading JSON:', err)
//                         return
//                     }
//                     const jsonData = data.split('\n').map((line) => JSON.parse(line)) // Parsing each line as an individual object
//                     event.sender.send('json-star', { cmd: 'prepare_star', output: jsonData })
//                     //console.log(jsonData) // Logs an array of objects
//                 })
//             }
//             pythonProcess = null // Reset the reference when the process ends
//             event.sender.send('python-closed', { cmd: cmd, output: 'closed' })
//         })
//     }
// })
