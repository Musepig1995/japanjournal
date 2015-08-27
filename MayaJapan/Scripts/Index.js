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