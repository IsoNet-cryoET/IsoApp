import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import { run_python } from './python'
const { spawn } = require('child_process')
const fs = require('fs')

let pythonProcess = null // To hold the reference of the running Python process

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
        show: false,
        autoHideMenuBar: true,
        frame: false, // Ensures no native frame, enabling the custom title bar
        titleBarStyle: 'hidden', // Required for custom overlays
        titleBarOverlay: {
            color: '#eaf1fb', // Title bar background color
            symbolColor: '#74b1be', // Minimize, Maximize, Close button colors
            height: 38 // Height of the title bar
        },
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
    // mainWindow.webContents.openDevTools()
}

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
                key == 'split_top_bottom_halves' ||
                key == 'only_print'
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

ipcMain.handle('select-file', async (_, property) => {
    const result = await dialog.showOpenDialog({
        properties: [property]
    })

    if (!result.canceled) {
        return result.filePaths[0]
    }
    return null
})

ipcMain.on('update_star', (event, data) => {
    const filePath = '.to_star.json'

    fs.writeFile(filePath, JSON.stringify(data.convertedJson, null, 2), (err) => {
        if (err) {
            console.error('Error saving file:', err)
            event.reply('save-json-response', { success: false, error: err.message })
        } else {
            console.log('File saved successfully:', filePath)
            event.reply('save-json-response', { success: true, filePath })
        }
    })

    pythonProcess = spawn(
        'isonet.py',
        ['json2star', '--json_file', filePath, '--star_name', data.star_name],
        {
            detached: true, // Create a new process group
            stdio: ['ignore', 'pipe', 'pipe'] // Ignore stdin, keep stdout/stderr
        }
    ) // Corrected the split
    let cmd = 'prepare_star'
    // Capture and print stdout in real time
    pythonProcess.stdout.on('data', (data) => {
        event.sender.send('python-stdout', { cmd: cmd, output: data.toString() })
    })

    pythonProcess.stderr.on('data', (data) => {
        event.sender.send('python-stderr', { cmd: cmd, output: data.toString() })
    })

    // Handle process close event
    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`)
        pythonProcess = null // Reset the reference when the process ends
    })
})

ipcMain.on('run', (event, data) => {
    const { cmd, result } = toCommand(data)
    if (data.hasOwnProperty('only_print') && data['only_print'] === true) {
        event.sender.send('python-stdout', { cmd: cmd, output: result })
    } else {
        console.log(`isonet.py ${result}`)

        // Spawn the Python process
        pythonProcess = spawn('isonet.py', [...result.split(' ')], {
            detached: true, // Create a new process group
            stdio: ['ignore', 'pipe', 'pipe'] // Ignore stdin, keep stdout/stderr
        }) // Corrected the split

        event.sender.send('python-running', { cmd: cmd, output: 'running' })

        // Capture and print stdout in real time
        pythonProcess.stdout.on('data', (data) => {
            event.sender.send('python-stdout', { cmd: cmd, output: data.toString() })
        })

        pythonProcess.stderr.on('data', (data) => {
            event.sender.send('python-stderr', { cmd: cmd, output: data.toString() })
        })

        // Handle process close event
        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`)
            if (code === 0 && (cmd === 'prepare_star' || cmd === 'star2json')) {
                fs.readFile('.to_node.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading JSON:', err)
                        return
                    }
                    const jsonData = data.split('\n').map((line) => JSON.parse(line)) // Parsing each line as an individual object
                    event.sender.send('json-star', { cmd: 'prepare_star', output: jsonData })
                    //console.log(jsonData) // Logs an array of objects
                })
            }
            pythonProcess = null // Reset the reference when the process ends
            event.sender.send('python-closed', { cmd: cmd, output: 'closed' })
        })
    }
})
ipcMain.on('kill-python', (event) => {
    if (pythonProcess) {
        console.log(`Attempting to kill Python process group with PID: ${pythonProcess.pid}`)
        try {
            process.kill(-pythonProcess.pid, 'SIGINT') // Kill entire process group
            console.log('Python process group killed')
        } catch (err) {
            console.error('Failed to kill Python process group:', err)
        }
        pythonProcess = null
    } else {
        console.log('No Python process is running')
    }
})
// window adaptation
app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
