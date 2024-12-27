const audioPlayer = document.getElementById('audioPlayer');
const selectedMusic = document.getElementById('selectedMusic');
let currentCordinate, currentTime = "";
$(document).on("click", "td", function () {
    const data = `x:${Number($(this).data("x"))} y:${Number($(this).data("y"))}`
    const time  = `${Math.floor(audioPlayer.currentTime / 60)}:${Math.floor(audioPlayer.currentTime % 60)}`;
    currentCordinate = data;
    currentTime = time;
    $(".cordinate-data").html(data);
    $(".time-data").html(time);
    $(".song-data").html($("#mediaPlayer .body .selected").text())
    console.log(data);
    $("#cordinateTable td").removeClass('selected');
    $(this).addClass('selected');
});

$(document).on("click", "#expandMediaBtn", function () {
    $("#mediaPlayer").slideToggle('fast', () => {
        if ($("#mediaPlayer").css('display') === 'block') {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
});

$(document).on("click", ".expandData", function () {
    $(".dataContainer").slideToggle('fast', () => {
        if ($(".dataContainer").css('display') === 'block') {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
});

$(document).on("click", ".media-track", function () {
    $("#selectedMusic").text($(this).attr('song-data'))
});

function selectSong(songFile, elem) {
    audioPlayer.src = `./Assets/Media/${songFile}`;
    selectedMusic.textContent = songFile.replace('_', ' ');
    audioPlayer.currentTime = 0;
    $(".media-track").removeClass('selected');
    $(elem).addClass('selected');
    playMusic();
}

function playMusic() {
    audioPlayer.play();
}

function pauseMusic() {
    audioPlayer.pause();
}

$(document).ready(function () {
    fetch('./Assets/Media/files.json')
        .then(response => response.json())
        .then(files => {
            files.forEach((file) => {
                $("#songs").append(`
                <button song-data="${file.title}" class="btn color-white media-track" onclick="selectSong('${file.url}', this)">${file.title}</button>
                `);
            });
        });

    $("#userName").on("change input", function () {
        const nameValue = $(this).val();
        if (nameValue.length > 0) {
            $("#confirmName").attr('disabled', false);
        } else {
            $("#confirmName").attr('disabled', true);
        }
    });
    
    $("#myModal").modal('show');
    $(".download-data").on("click", function () {
        let data = [{
            "Name": $("#userName").val(),
            "Song": $("#selectedMusic").text(),
            "Coordinate": currentCordinate,
            "Time": currentTime
        }];

        function convertToCSV(json) {
            const header = Object.keys(json[0]);
            const rows = json.map(obj => header.map(fieldName => JSON.stringify(obj[fieldName], null, 0)).join(','));
            return [header.join(','), ...rows].join('\r\n');
        }

        const csv = convertToCSV(data);
        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        const link = $("<a>")
            .attr("href", URL.createObjectURL(blob))
            .attr("download", "data.csv") // Using .xlsx extension
            .appendTo("body");

        link[0].click();
        link.remove();
    });
});