$(function () {

});

function clickThumbnail(image) {

    var bigImage = image.parentElement.parentElement.childNodes[3].childNodes[1];

    if (bigImage) {

        $(bigImage).fadeOut("fast", function () {
            $(bigImage).attr("src", image.src);
            $(bigImage).fadeIn("fast");
        })
    }
}
