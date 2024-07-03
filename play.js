
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

p = new URLSearchParams(window.location.search)

if (p.has("words") && p.has("count")){
    count = p.get('count')
    count = parseInt(count)
    words = p.get('words').replace(/\+/g, '%20')
    if (words == "localStorage"){
        words = localStorage.getItem("words");
        if (words == null){
            alert("No words found in localStorage");
            window.location.href = "/";
        }
    }else{
        words = decodeURIComponent(words);
    }
    words = words.split(" ");
    if (typeof words != "object" || words.length < 2) {
        alert("Invalid GET parameter: ony one word provided");
        window.location.href = "/";
    }
    definite_words = [];
    if (words.length <= count){
        shuffleArray(words);
    }else{
        unique_words = new Set(words);
        if (count > unique_words.size){
            alert("Trop peu de mots fournis. Veuillez en donner plus.");
            window.location.href = "/";
        }
        for(let i = 0; i<count; i++){
            k = 0;
            w = words[Math.floor(Math.random() * (words.length-1))];
            while (definite_words.includes(w)){
                w = words[Math.floor(Math.random() * words.length)];
                k+=1;
                if (k > 500){
                    alert("Some words are duplicated. Please provide more words.");
                    window.location.href = "/";
                }
            }
            definite_words.push(w)
        }
        words = definite_words;
    }
} else {
    alert("Invalid GET parameter");
    stop();
}

results = {
    team_1: 0,
    team_2: 0
};

next_button = document.getElementById("next");
unkown_button = document.getElementById("unkown");
pass_button = document.getElementById("pass");
restart_button = document.getElementById("restart");
team_p = document.getElementById("team");
word_p = document.getElementById("word");
score_p = document.getElementById("score");
manche_p = document.getElementById("manche");
end_div = document.getElementById("end");
manche_number = 0;
downloadTimer = null;

function change_team(){
    if (team_p.innerHTML == "" || team_p.innerHTML == "team_2") {
        team_p.innerHTML = "team_1";
    } else {
        team_p.innerHTML = "team_2";
    }
}

function restart_manche(){
    manche_number+=1;
    if (manche_number == 4) {
        alert("Fin de la partie");
        next_button.disabled = true;
        unkown_button.disabled = true;
        pass_button.disabled = true;
        document.getElementById("progressBar").innerHTML = "NA";
        score_p.innerHTML = "Score final: " + results["team_1"] + " - " + results["team_2"];
        end_div.style.display = "flex";
        return;
    }
    manche_p.innerHTML = "Manche n°" + manche_number;
    change_team();
    undone_words = words.slice();
    shuffleArray(undone_words);
}

function start_timer(){
    var timeleft = 45;
    document.getElementById("progressBar").innerHTML = "45";
    downloadTimer = setInterval(function(){
        timeleft -= 1;
        document.getElementById("progressBar").innerHTML = timeleft;
        if(timeleft <= 0){
            clearInterval(downloadTimer);
            alert("Fin du temps. Cliquez sur OK pour passer à l'équipe suivante.");
            change_team();
            start_timer();
        }
    }, 1000);
}

restart_manche();


unkown_button.addEventListener("click", function () {
    current_word = word_p.innerHTML;
    if (current_word == "") {
        return;
    }
    if (undone_words.length == 0) {
        word_p.innerHTML = "";
        clearInterval(downloadTimer);
        alert("Manche terminée");
        next_button.innerHTML = "Afficher";
        restart_manche();
        return;
    }
    word_p.innerHTML = undone_words.pop()
    current_word_id = words.indexOf(current_word);
    words.splice(current_word_id, 1);
});


pass_button.addEventListener("click", function () {
    current_word = word_p.innerHTML;
    if (current_word == "" || undone_words.length == 0) {
        return;
    }
    word_p.innerHTML = undone_words.pop()
    undone_words.unshift(current_word);
});

next_button.addEventListener("click", function () {
    current_word = word_p.innerHTML;
    if (current_word != "") {
        results[team_p.innerHTML] += 1;
    }else{
        next_button.innerHTML = "Suivant";
        start_timer();
    }
    if (undone_words.length == 0) {
        word_p.innerHTML = "";
        clearInterval(downloadTimer);
        alert("Manche terminée");
        next_button.innerHTML = "Afficher";
        restart_manche();
        return;
    }
    word_p.innerHTML = undone_words.pop()
});


restart_button.addEventListener("click", function () {
    window.location.reload();
});
