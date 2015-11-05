var factsSelect = document.querySelector('#factsSelect'),
    factContainer = document.querySelector('#fact'),
    starter = document.querySelector('#starter'),
    correctElem = document.querySelector('.correct em'),
    wrongElem = document.querySelector('.wrong em'),
    countElem = document.querySelector('.count em'),
    randElem = document.querySelector('#first'),
    baseElem = document.querySelector('#second'),
    time = document.querySelector('#time'),
    clock = document.querySelector('#clock'),
    factsBase = 1,
    factsRand = 0,
    correct = 0,
    wrong = 0,
    count = 0,
    gameGoing = false,
    mousedown = false,
    init = function(){
        var factsHandler = function(){
            if(!gameGoing){
                factsBase = parseInt(this.innerHTML,10);
                second.innerHTML = factsBase;
                factsSelect.querySelector('.active').classList.remove('active');
                this.classList.add('active');
            }
        };
        for (var i = 0; i < 10; i++) {
            var elem = document.createElement('span');
            if(i===0){
                elem.classList.add('active');
            }
            elem.innerHTML = i+1;
            elem.addEventListener('click',factsHandler);
            factsSelect.appendChild(elem);
        }

        starter.addEventListener('click', startHandler);
        time.addEventListener('change', timeHandler);

        whileAnswers(function(index, elem){
            elem.addEventListener('click',answerHandler);
        });

    },
    startHandler = function(){
        if(gameGoing){
            gameGoing = false;
            starter.value = "start";
            clearAll();
            time.disabled = false;
        }
        else {
            starter.value = "stop";
            window.setTimeout(timer, 100);
            gameGoing = true;
            nextProblem();
            time.disabled = true;
            //disable the base changer
            //
        }
    },
    timeHandler = function(){
        clock.innerHTML = this.value + ':' + '00';
    },
    answerHandler = function(){
        count ++;
        countElem.innerHTML = count;

        if(parseInt(this.value,10) === factsBase + factsRand){
            correct ++;
            correctElem.innerHTML = correct;
        }
        else {
            wrong ++;
            wrongElem.innerHTML = wrong;
            console.log(wrong, wrong > 1);
            if(wrong > 1){
                wrongElem.classList.add('warning');
            }
        }
        // if it isn't the last one get new problem.
        if(gameGoing)
            nextProblem();
    },
    rand = function(s,e){
        return Math.floor(Math.random()*((e-s)+1)) + s;
    },
    nextProblem = function(){
        factsRand = rand(1,10);
        randElem.innerHTML = parseInt(factsRand, 10);
        //populate the answers.
        answerRand = rand(1,3);
        var firstrandomAnswer = 0;
        whileAnswers(function(index, elem){
            elem.disabled = false;
            if(index === answerRand-1){
                elem.value = factsRand + factsBase;
            }
            else{
                var randomAnswer = rand(factsBase+1,factsBase+10);
                while(randomAnswer === factsBase + factsRand || randomAnswer === firstrandomAnswer){
                    randomAnswer = rand(factsBase+1,factsBase+10);
                }
                firstrandomAnswer = randomAnswer;
                elem.value = randomAnswer;
            }
        });
    },
    pauseAll = function(){
        whileAnswers(function(index, elem){
            elem.value = '_';
            elem.disabled = true;
        });
        clock.innerHTML = time.value + ":00";
    },
    clearAll = function(){

        pauseAll();

        wrongElem.classList.remove('warning');

        randElem.innerHTML = '_';
        count = 0;
        countElem.innerHTML = count;

        correct = 0;
        correctElem.innerHTML = correct;

        wrong = 0;
        wrongElem.innerHTML = wrong;
    },
    timer = function(){
        //tic the timer by one second.
        countdown(time.value,0,function(val){
            if(val === 0){
                gameGoing = false;
                pauseAll();
            }
            else{
                clock.innerHTML = val;
            }
        });
    },
    whileAnswers = function(callback){
        var answers = document.querySelectorAll('.answer'),
            ai = answers.length;
        while(ai--){
            callback(ai, answers[ai]);
        }
    },
    countdown = function (minutes, seconds, callback ){
        var endTime, hours, mins, msLeft, time,
            twoDigits = function(n){
                return (n <= 9 ? "0" + n : n);
            },
            updateTimer = function(){
                msLeft = endTime - (+new Date);
                if ( msLeft < 1000 ) {
                    callback(0);
                } else {
                    if(gameGoing){
                        time = new Date( msLeft );
                        hours = time.getUTCHours();
                        mins = time.getUTCMinutes();
                        callback((hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds()));
                        setTimeout( updateTimer, time.getUTCMilliseconds() + 100 );
                    }
                }
            };

        endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
        updateTimer();
    };


init();
