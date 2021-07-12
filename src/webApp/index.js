const term = new Terminal({
    cursorBlink: true,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    });
    
term.resize(80, 40);
term.open(document.getElementById('terminal'));

let currLine = "";
let entries = [];
let entriesIndex = 0;

let printing = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function prompt(){
    entriesIndex = 0;
    term.write("\r\n");
    line = "\x1b[1;34mPENUMBRA OS \x1b[1;32m$ ";
    writeSlow(line, false);
}

async function writeSlow (line, nl){
    printing = true;
    for(index = 0; index < line.length; index++){
        term.write(line.charAt(index));
        await sleep(0);
    }
    if(nl){
        prompt();
    }
    printing = false;
}

writeSlow("\x1b[1;32m================================================================================\r\n\x1b[1;34mPENUMBRA OS V 1.0.1.6\r\n\x1b[1;32m================================================================================\r\n\x1b[1;34minitialise . . . . : true\r\n\x1b[1;34mup to date . . . . : true\r\n", true)

term.onKey((key, ev) => {
    if(!printing){
        if(key.domEvent.code == "Backspace"){
            if(currLine){
                currLine = currLine.substring(0, currLine.length - 1);
                term.write("\b \b")
            }
        }else{
            switch(key.key){
                case "\r":
                    if(currLine){
                        entries.push(currLine);
                        fetchData(currLine);
                        currLine = "";
                    }else{
                        prompt();
                    }
                    break;
                case "\u001b[A":
                    if(entriesIndex != entries.length){
                        entriesIndex += 1;
                    }
                    for(let i = 0; i < currLine.length; i++){
                        term.write("\b \b")
                    }
                    writeSlow(entries[entries.length-entriesIndex], false);
                    currLine = entries[entries.length-entriesIndex];
                    break;
                case "\u001b[B":
                    for(let i = 0; i < currLine.length; i++){
                        term.write("\b \b")
                    }
                    if(entriesIndex != 1){
                        entriesIndex -= 1;
                        writeSlow(entries[entries.length-entriesIndex], false);
                        currLine = entries[entries.length-entriesIndex];
                    }else{
                        if(entriesIndex != 0){
                            entriesIndex -= 1;
                        }
                        currLine = "";
                    }
                    break;
                case "\u001b[C":
                    break;
                case "\u001b[D":
                    break;
                default:
                    currLine += key.key;
                    term.write(key.key);
                    break;
            }
        }
    }
});

function fetchData(line) {
    data = JSON.stringify(line);
    console.log(data);

    fetch('fetch', {
                method: 'POST',
                body: data,
            })
            .then( response =>
            {
                if ( response.status !== 200 )
                {
                    console.log( 'Looks like there was a problem. Status Code: ' +
                        response.status );
                    return;
                }

                console.log( response.headers.get( "Content-Type" ) );
                return response.json();
            }
            )
            .then( myJson =>
            {
                console.log(myJson);
                writeSlow(myJson.data, true);
            } )
            .catch( err =>
            {
                console.log( 'Fetch Error :-S', err );
            } );
}