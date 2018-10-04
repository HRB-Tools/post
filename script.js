function einlesen(){
    document.getElementById("fileinput").click();
}
var text;
var arr = [];
var arrayDatev = [];
var readr = new FileReader();
readr.addEventListener("loadend", function(){
    text = readr.result; var sets = text.split("y"); for ( var i = 0; i < sets.length; i++ ){
        arr[i+1] = sets[i].split(/[a-j]/g);
    }
    //console.log(sets);
    trimUmsatz();
    for ( var i = 3; i < arr.length-2; i++ ) {
        arr[i][0] = leadingNil(arr[i][0]);
        var contain = arr[i][0].slice(0, arr[i][0].length-2) + "," + arr[i][0].slice(arr[i][0].length-2,arr[i][0].length);
        arr[i][0] = contain;
        //console.log(arr[i][1]);
        let separator = String.fromCharCode(65533);
        let temp = arr[i][1].split(separator);
        temp[1] = leadingNil(temp[1]).slice(0,-1);
        console.log(temp[1])
        arr[i][7] = temp[1];
        arr[i][1] = leadingNil(arr[i][1]);
        arr[i][3] = leadingNil(arr[i][3]);
        for ( var j = 0; j < arr[i][1].length; j++ ) {
            if ( !isNumber( arr[i][1].charAt(j) ) ) {
                arr[i][1] = arr[i][1].slice(0,j);
            }
        }
        for ( var j = 0; j < arr[i][3].length; j++ ) {
            if ( !isNumber( arr[i][3].charAt(j) ) ) {
                arr[i][4] = arr[i][3].slice(j+11,arr[i][3].length-1);
                arr[i][6] = arr[i][3].slice(j,j+11);
                arr[i][3] = arr[i][3].slice(0,j);
            }
        }
        for ( var j = 0; j < arr[i][4].length; j++ ) {
            if ( !isCapitalLetter( arr[i][4].charAt(j) ) ) {
                arr[i][5] = arr[i][4].slice(j);
                arr[i][4] = arr[i][4].slice(0,j);
            }
        }
        for ( var j = 0; j < arr[i][5].length; j++ ) {
            if ( !isCapitalLetter(arr[i][5].charAt(j) ) ) {
                arr[i][5] = arr[i][5].slice(j+2);
            }
        }
        for ( var j = 0; j < arr[i][6].length; j++ ) {
            if (!isNumber(arr[i][6].charAt(0))) {
                arr[i][6] = arr[i][6].slice(1, arr[i][6].length-2);
            }
            arr[i][6] = leadingNil(arr[i][6]);
        }
    }
    console.log(arr)
    createArray(arr);
    exportToCsv(arrayDatev);
});
var io = document.getElementById("fileinput");
io.addEventListener("change", function(){ var content = this.files[0]; readr.readAsText(content);});
arr[0] = ["Umsatz", "Gegenkonto", "Datum", "Konto", "Buchungstext", "WKZ", "KOST1", "Belegfeld1"];
function trimUmsatz(){ for ( var i = 3; i < arr.length; i++ ){
    var temp = arr[i][0];
    arr[i][0] = temp.slice(temp.indexOf("+")+1);
}
}
function leadingNil(a){
    while ( a.charAt(0) == "0" ) {
        if ( a.charAt(0) == "0" ) {
            a = a.slice(1);
        }
    }
    return a;
}
function isNumber(a){
    return (/[0-9]/).test(a);
}
function isCapitalLetter(a){
    return (/[A-Z .&]/).test(a);
}
function createRow(array){
    var subArray = new Array(115);
    subArray.fill('""');
    subArray[0] = array[0]; //Umsatz
    subArray[7] = array[1]; //Gegenkonto
    subArray[9] = array[2]; //Datum
    subArray[6] = array[3]; //Konto
    subArray[13] = array[4]; //Buchungstext
    subArray[5] = array[5]; //WKZ
    subArray[36] = array[6]; //KOST1
    subArray[10] = array[7]; //Belegfeld1
    return subArray;
}
function createArray(a){
    for ( var i = 3; i < a.length - 2; i++ ) {
        arrayDatev[i-3] = createRow(a[i]);
    }
}
function exportToCsv(rows) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var ms = date.getMilliseconds();
    var currentDate = year + '' + month + '' + day;
    var currentTime = hour + '' + minute + '' + second;
    var filename = "EXTF_" + currentDate + "_" + currentTime + ".csv";
    var head = new Array(31);
    head = createHead(head, currentDate, ms, year);
    console.log(head);
    console.log(arrayDatev);
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            }
            var result = innerValue.replace(/"/g, '"');
            /*if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';*/  //keine unnÃ¶tigen AnfÃ¼hrungszeichen
            if (j > 0)
                finalVal += ';';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    csvFile += processRow(head) + '\n';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
function createHead(header, a, b, c){
    header.fill('');
    var wj = 2017;
    var ab = a + '' + b;
    var wjA = wj + '0101';
    var wjB = wj + '' + arrayDatev[0][9];
    var wjC = wj + '' + arrayDatev[arrayDatev.length-1][9];
    return ["EXTF", 510, 21, "Buchungsstapel", 7, ab, '', "NE", "Nils Eidmann", '', 76076, 11011, wjA, 4, wjB, wjC, "Postversand Export", "NE", 1, 0, 0, "EUR", '', '', '', '', 'SKR03', '', '', '', ''];
}
