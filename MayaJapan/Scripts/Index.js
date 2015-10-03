var imagesLoaded = false,
    formLoaded = false;
function setupHandlers() {
    $("#Name").on("input", function (e) {
        var name = $(this).val();
        $("#preview-name").text(name);
        checkAddButton();
    });
    $("#Description").on("change", function (e) {
        var desc = $(this).val();
        $("#preview-description").html(desc);
        checkAddButton();
    });
    $("#Description").on("keyup", function (e) {
        // If they press the enter key
        if (e.which === 13) {
            $("#Description").val($("#Description").val() + "<br />\n");
        }
    });
    $("#upload-file").on("click", function (e) {
        e.preventDefault();
        $("#file").trigger("click");
    });
    $("#save-images").on("click", function (e) {
        var form = $("#picture-form"),
            imageInput = document.getElementById("file");

        $("#save-images").html("Uploading...");
        $("#save-images").prop("disabled", true);
        readImages(imageInput, form);
    });
    $("#picture-form").submit(function (e) {
    });
    $("#back").click(function (e) {
        $("#main-image").slideDown();
        $("#header-content").slideDown();
        $("#add-photos").show();
        if (formLoaded) {
            $("#picture-form").slideUp();
            $("#image-preview").slideUp();
        }
    });
}
function checkAddButton() {
    var name = $("#Name").val(),
        desc = $("#Description").val();

    if (name && desc) {
        if (!imagesLoaded) {
            $("#save-images").html("Save");
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
        $.each(input.files, function (index, element) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#img-grid').prepend("<img src='" + e.target.result + "' class='preview-image' />");

                if (index === input.files.length - 1) {
                    // Tell the user that the images can now be saved.
                    imagesLoaded = true;
                }
                checkAddButton();
            };

            reader.readAsDataURL(this);
        });
    }
}
function implementCkeditor() {
    CKEDITOR.replace("Description", {
        toolbarGroups: [
				{ "name": "basicstyles", "groups": ["basicstyles"] },
				{ "name": "links", "groups": ["links"] },
				{ "name": "paragraph", "groups": ["list", "blocks"] },
				{ "name": "styles", "groups": ["styles"] },
				{ "name": "about", "groups": ["about"] }
        ],
        // Remove the redundant buttons from toolbar groups defined above.
        removeButtons: 'Anchor'
    });
    CKEDITOR.instances["Description"].on("change", function () {
        CKEDITOR.instances["Description"].updateElement();
        $("#Description").val(CKEDITOR.instances["Description"].getData());
        var desc = CKEDITOR.instances["Description"].getData();
        $("#preview-description").html(desc);
        checkAddButton();
    })
}
function loadForm() {
    var partialView = $("#temp").html();
    $(partialView).appendTo($(".image-form")).hide().slideDown();
    $("#temp").remove();
    $("#add-photos").hide();
    createPreview();
    setupHandlers();
    formLoaded = true;
    implementCkeditor();
}
function readImages(input, form) {
    if (input.files) {
        var images = [];
        $.each(input.files, function (index, object) {
            var FR = new FileReader();
            FR.onload = function (e) {
                images.push(sendToImgur(e.target.result));
                if (images.length === input.files.length) {
                    // All images have been parsed 
                    buildImagesIntoForm(images, form);
                }
            };
            FR.readAsDataURL(object);
        });
    }
}

function buildImagesIntoForm(images, form) {
    $.each(images, function (i, element) {
        $("#hidden-pictures").val(function (i, val) {
            return val + (!val ? "" : ", ") + element;
        });
    });
    form[0].submit();
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
        data: {
            image: img.split("base64,")[1],
            type: "base64"
        },
        async: false,
        success: function (result) {
            imageUrl = result.data.link;
        }

    });
    return imageUrl;
}