function showFile(name, type){
    if(type == 'image/png' || type == 'image/jpeg')
        var file = $('<img src="/fileStore/' + name + '" width="400px"/>')
    else
        var file = $('<p>' + name + ', ' + type + '</p>')

    var download = $('<div><a href="/download/' + name + '">Download</a></div>')

    $("#display").empty() // para limpar o estado do modal
    $("#display").append(file, download)
    $("#display").modal({showClose: true, keyboard: true})
}