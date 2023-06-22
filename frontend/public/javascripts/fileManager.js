function showFile(path, name, type) {
    var file;
    // cut ./public from path
    path = path.substring(8);
    console.log("PATH: ", path)
    console.log("NAME: ", name)
    // make type lowercase
    type = type.toLowerCase();
    console.log("TYPE: ", type)
    if (type === 'jpeg' || type === 'jpg' || type === 'png' || type === 'gif' || type === 'svg+xml') {
      file = '<img src="' + path + '" style="max-width: 100%; max-height: 100%;"/>';
    } else if (type === 'mp4' || type === 'webm') {
      file = '<video controls><source src="' + path + '"></video>';
    } else if (type === 'mp3' || type === 'wav' || type === 'ogg') {
      file = '<audio controls><source src="' + path + '"></audio>';
    } else if (type === 'html' || type === 'txt' || type === 'pdf' || type === 'xml') {
      file = '<iframe src="' + path + '" style="width: 100%; height: 500px;" frameborder="0"></iframe>';
    } else {
      file = '<p>' + name + ', ' + type + '</p>';
    }
  
    //var download = $('<div><a href="/download/' + name + '">Download</a></div>');
  
    //$("#display").empty(); // Clear the modal state
    //$("#display").append(file, download);
    //$("#display").modal({ showClose: true, keyboard: true });

    return file;
}
  