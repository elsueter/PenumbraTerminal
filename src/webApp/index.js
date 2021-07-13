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
    printing = true;
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

async function simulateDelay(max){
    for(let i = 0; i < Math.random()*max; i++){
        term.write(" .");
        await sleep(250);
    }
}

async function startup(){
    await writeSlow(
        "\x1b[1;32m================================================================================" +
        "\r\n\x1b[1;34mPENUMBRA OS V 1.0.1.6\r\n" +
        "\x1b[1;32m================================================================================" +
        "\x1b[1;34m" +
        "\r\nPenumbraNet Service Started - 'Your portal to the world of the Penumbra'" + 
        "\r\n"
        , false)

    await writeSlow("\r\n[ \x1b[1;32mok \x1b[1;34m] Started Authorisation Manager", false);
    await simulateDelay(2);

    await writeSlow("\r\n[ \x1b[1;32mok \x1b[1;34m] Started Network Manager", false);
    await simulateDelay(2);

    await writeSlow("\r\n[ \x1b[1;32mok \x1b[1;34m] Started Disk Manager", false);
    await simulateDelay(2);

    await writeSlow("\r\n[ \x1b[1;32mok \x1b[1;34m] Cleaning Cache", false);
    await simulateDelay(20);

    await writeSlow("\r\n[ \x1b[1;32mok \x1b[1;34m] Covering Tracks", false);
    await simulateDelay(10);

    await writeSlow("\r\n[ \x1b[1;32mok \x1b[1;34m] Loading Latest News", false);
    await simulateDelay(6);

    await writeSlow("\r\n[ \x1b[1;32mok \x1b[1;34m] Preparing CLI", false);
    await simulateDelay(20);

    writeSlow("\r\n\r\nInit finished!\r\n", true);
}

startup();


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
                    if(entries.length > 0){
                        if(entriesIndex != entries.length){
                            entriesIndex += 1;
                        }
                        for(let i = 0; i < currLine.length; i++){
                            term.write("\b \b")
                        }
                        writeSlow(entries[entries.length-entriesIndex], false);
                        currLine = entries[entries.length-entriesIndex];
                    }
                    break;
                case "\u001b[B":
                    for(let i = 0; i < currLine.length; i++){
                        term.write("\b \b")
                    }
                    if(entriesIndex > 1){
                        entriesIndex -= 1;
                        writeSlow(entries[entries.length-entriesIndex], false);
                        currLine = entries[entries.length-entriesIndex];
                    }else{
                        if(entriesIndex == 1){
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

    fetch('penumbraNetwork/fetch', {
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
                writeSlow("\n\rFetch Error: try again", true);
            } );
}