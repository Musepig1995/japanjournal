var imagesLoaded = false,
    fakeImages = ["http://i.imgur.com/doIG5D2.jpg", "http://i.imgur.com/doIG5D2.jpg"];
function setupHandlers() {
    $("#Name").on("input", function(e) {
        var name = $(this).val();
        $("#preview-name").text(name);
        checkAddButton();
    });
    $("#Description").on("input", function(e) {
        var desc = $(this).val();
        $("#preview-description").text(desc);
        checkAddButton();
    });
    $("#upload-file").on("click", function(e) {
        e.preventDefault();
        $("#file").trigger("click");
    });
    $("#save-images").on("click", function (e) {
        var form = $("#picture-form");
        form[0].submit();
    });
    $("#picture-form").submit(function (e) {
    });
}
function checkAddButton() {
    var name = $("#Name").val(),
        desc = $("#Description").val();

    if (name && desc) {
        if (!imagesLoaded) {
            $("#save-images").html("Loading...");
            $("#save-images").prop("disabled", true);
            $("#save-images").show();
        } else {
            $("#save-images").html("Save");
            $("#save-images").prop("disabled", false);
            $("#save-images").show();
        }
    } else {
        $("#save-images").hide();
    }
}
function createPreview() {
    $(".image-preview").slideDown();
}
function readURL(input) {
    if (input.files && input.files[0]) {
        $("#img-grid-label").show();
        $("#img-grid").show();
        $.each(input.files, function() {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#img-grid').prepend("<img src='" + e.target.result + "' class='preview-image' />");
                checkAddButton();
            };

            reader.readAsDataURL(this);
        });
    }
}
function loadForm() {
    var partialView = $("#temp").html();
    $(partialView).appendTo($(".image-form")).hide().slideDown();
    $("#temp").remove();
    $("#add-photos").hide();
    createPreview();
    setupHandlers();
}
function readImage(input) {
    if (input.files) {
        var images = [];
        $.each(input.files, function (index, object) {
            var FR = new FileReader();
            FR.onload = function (e) {
                images.push(sendToImgur(e.target.result));
                if (images.length === input.files.length) {
                    // All images have been parsed 
                    buildImagesIntoForm(images);
                }
            };
            FR.readAsDataURL(object);
        });
    }
}

function buildImagesIntoForm(images) {
    $("#img-grid-label").show();
    $("#img-grid").show();
    $.each(images, function (i, element) {
        $("#hidden-pictures").val(function (i, val) {
            return val + (!val ? "" : ", ") + element;
        });
        $('#img-grid').prepend("<img src='" + element + "' class='preview-image' />");
    });
    // Tell the user that images can now be saved.
    imagesLoaded = true;
    checkAddButton();
}



function imgurTest(input) {
    var base64 = convertImgToBase64URL(input.files[0], sendToImgur);

}

function sendToImgur(img) {
    var imageUrl;
    $.ajax({
        url: "https://api.imgur.com/3/image",
        type: "POST",
        headers: {
            Authorization: "Client-ID 0aa4f7a77734f59",
            Accept: "application/json"
        },
        async: false,
        data: {
            image: img.split("base64,")[1],
            type: "base64"
        },
        success: function (result) {
            imageUrl = result.data.link;
        }

    });
    return imageUrl;
}