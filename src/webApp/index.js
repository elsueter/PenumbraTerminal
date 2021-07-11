const term = new Terminal({
    cursorBlink: true,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    });
    
term.resize(80, 50);
term.open(document.getElementById('terminal'));

var currLine = "";
var entries = [];

term.writeSlow = (line, index) => {
    term.write(line.charAt(index));
    if(index < line.length-1){
        setTimeout(function(){term.writeSlow(line, index+1)}, 0);
    }else{
        term.write("\r\n");
        term.writeSlowNR("\x1b[1;34mPENUMBRA OS \x1b[1;32m$ ", 0)
    }
}

term.writeSlowNR = (line, index) => {
    term.write(line.charAt(index));
    if(index < line.length-1){
        setTimeout(function(){term.writeSlowNR(line, index+1)}, 0);
    }
}

term.writeSlowNR("\x1b[1;32m================================================================================\r\n\x1b[1;34mPENUMBRA OS V 1.0.1.6\r\n\x1b[1;32m================================================================================\r\n\x1b[1;34minitialise . . . . : true\r\n\x1b[1;34mup to date . . . . : true\r\n\r\n\x1b[1;34mPENUMBRA OS \x1b[1;32m$ ", 0)

term.onKey((key, ev) => {
    if(key.key == "\r"){
        if(currLine){
            entries.push(currLine);
            fetchData(currLine);
            currLine = "";
            }else{
            term.write("\r\n");
            term.writeSlowNR("\x1b[1;34mPENUMBRA OS \x1b[1;32m$ ", 0)
        }
    }else if(key.domEvent.code == "Backspace"){
        if(currLine){
            currLine = currLine.substring(0, currLine.length - 1);
            term.write("\b \b")
        }
    }else{
        currLine += key.key;
        term.write(key.key);
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
                term.writeSlow(myJson.data, 0);
            } )
            .catch( err =>
            {
                console.log( 'Fetch Error :-S', err );
            } );
}