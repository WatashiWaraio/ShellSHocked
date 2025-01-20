
const terminal = document.getElementById('terminal');
const commandInput = document.getElementById('commandInput');

let currentDir = '/home/user';
const fileSystem = {
    '/home/user': {
        'documents': {},
        'downloads': {},
        'pictures': {},
        'README.txt': 'Welcome to your home directory!'
    }
};

function getCurrentDirObj() {
    return currentDir.split('/').reduce((acc, curr) => acc[curr], fileSystem);
}

function appendToTerminal(text, className = '') {
    const output = document.createElement('div');
    output.textContent = text;
    if (className) output.className = className;
    terminal.appendChild(output);
    terminal.scrollTop = terminal.scrollHeight;
}

function setCommand(cmd) {
    commandInput.value = cmd;
    commandInput.focus();
}

const commands = {
    help: () => {
        appendToTerminal('\nAvailable commands:');
        appendToTerminal('  pwd - Print Working Directory');
        appendToTerminal('  ls - List Directory Contents');
        appendToTerminal('  cd <dir> - Change Directory');
        appendToTerminal('  mkdir <name> - Create Directory');
        appendToTerminal('  touch <name> - Create File');
        appendToTerminal('  clear - Clear Terminal');
        appendToTerminal('  help - Show This Help\n');
    },
    pwd: () => {
        appendToTerminal(currentDir);
    },
    ls: () => {
        const currentDirContents = getCurrentDirObj();
        const contents = Object.keys(currentDirContents).join('  ');
        appendToTerminal(contents || '(empty directory)');
    },
    cd: (args) => {
        if (!args[0] || args[0] === '~') {
            currentDir = '/home/user';
            return;
        }
        
        const newPath = args[0].startsWith('/')
            ? args[0]
            : `${currentDir}/${args[0]}`;

        try {
            const dirObj = newPath.split('/').reduce((acc, curr) => {
                if (!curr) return acc;
                if (!acc[curr] || typeof acc[curr] !== 'object') {
                    throw new Error();
                }
                return acc[curr];
            }, fileSystem);
            
            currentDir = newPath;
        } catch {
            appendToTerminal(`cd: no such directory: ${args[0]}`, 'error');
        }
    },
    mkdir: (args) => {
        if (!args[0]) {
            appendToTerminal('mkdir: missing operand', 'error');
            return;
        }
        
        const currentDirObj = getCurrentDirObj();
        if (currentDirObj[args[0]]) {
            appendToTerminal(`mkdir: cannot create directory '${args[0]}': File exists`, 'error');
            return;
        }
        
        currentDirObj[args[0]] = {};
        appendToTerminal(`Created directory: ${args[0]}`, 'success');
    },
    touch: (args) => {
        if (!args[0]) {
            appendToTerminal('touch: missing operand', 'error');
            return;
        }
        
        const currentDirObj = getCurrentDirObj();
        if (currentDirObj[args[0]]) {
            appendToTerminal(`touch: file '${args[0]}' already exists`, 'error');
            return;
        }
        
        currentDirObj[args[0]] = '';
        appendToTerminal(`Created file: ${args[0]}`, 'success');
    },
    clear: () => {
        terminal.innerHTML = '';
    }
};

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const commandLine = commandInput.value.trim();
        const [command, ...args] = commandLine.split(' ');
        
        appendToTerminal(`$ ${commandLine}`);
        
        if (commands[command]) {
            commands[command](args);
        } else if (command) {
            appendToTerminal(`Command not found: ${command}`, 'error');
        }
        
        commandInput.value = '';
        terminal.scrollTop = terminal.scrollHeight;
    }
});

// Initial help message
commands.help();
