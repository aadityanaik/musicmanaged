$(window).on('pageshow', function () {
    $.ajax({
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/musicmanaged-development-blogs', success: function (response) {
            if (response.status == 'ok') {
                var itemArray = response.items
                console.log(itemArray)

                var htmlToAppend = ""

                for (var i = itemArray.length-1; i >=0 ; i--) {
                    htmlToAppend += "<a href='#' class='post-title' id='article-" + i + "'><div class='row'><div class='col-sm-12'><h2>" + itemArray[i].title
                        + "</h2><h4 style='font-style:italic;'>" + itemArray[i].author + "</h4></div></div></a><br>"
                        + "<div class='row post-content' style='display:none;' id='content-" + i + "'><div class='col-sm-12'>" + itemArray[i].content + "</div></div><hr style='border-color:red;'>"
                }

                $(htmlToAppend).appendTo('#content-container')

                $(".post-title").click(function () {
                    pos = this.id.slice(8)
                    $("#content-" + pos).slideToggle()
                })
            }
        }, cache: false, async: true
    })
})