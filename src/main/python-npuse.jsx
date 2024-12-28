const { spawn } = require('child_process')

export function run_python(p1) {
    let result = ''

    for (const key in p1) {
        if (p1.hasOwnProperty(key)) {
            let value = p1[key]
            if (value === true) {
                value = 'True'
            } else if (value === false) {
                value = 'False'
            }

            if (key === 'command') {
                // Prepend the command value
                result = `${value}${result}`
            } else if (key === 'even_odd_input') {
                // Do nothing for 'even_odd_input'
            } else {
                // Append key-value pair in the format "--key value"
                result += ` --${key} ${value}`
            }
        }
    }

    console.log(`isonet.py ${result}`)

    // Spawn the Python process
    const pythonProcess = spawn('isonet.py', [...result.split(' ')]) // Corrected the split

    // Capture and print stdout in real time
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data.toString()}`)
    })

    pythonProcess.stderr.on('data', (data) => {
        event.sender.send('python-stderr', data.toString())
    })

    // Handle process close event
    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`)
    })
}
