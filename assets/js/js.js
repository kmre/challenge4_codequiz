//Add timer to display if selection is in/correct and delay the deletion/appearance of next set of question/answers
/*
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/

async function sleep(timer) {
  myPromise = new Promise(function(myResolve, myReject) {
    setTimeout(function() { myResolve(timer); }, timer);
  });

  timerComplete = await myPromise;
  //console.log(timerComplete);
}

//Add timer for total game (with deduction for incorrect answers)
var gameTimer = function() {
  //debugger;
  timeleft = 10;
  document.getElementById("timer").innerHTML = "";
  var mainTimer = setInterval(async function() {
    //debugger;
    if((timeleft > 0) && (index !== myQuestions.length)) {
      //timer keeps going until it reaches 0 or all questions are answered
      document.getElementById("timer").innerHTML = timeleft + " seconds remaining";
      timeleft -= 1;
      //console.log("1: " + timeleft);

    } else if ((index === myQuestions.length)) {
      //All questions answered before timer runs out
      clearInterval(mainTimer);
      document.getElementById("timer").innerHTML = "";
      document.getElementById("timer").innerHTML = "All Done!";
      await sleep(4000);
      document.getElementById("timer").innerHTML = "";
          
    } else if (timeleft === 0) {
      //timer ran out
      clearInterval(mainTimer);
      document.getElementById("timer").innerHTML = "No more time left!";
      stopQuiz(index);

      await sleep(4000);
      document.getElementById("timer").innerHTML = "";
      //return timeleft;
    }
}, 1000);
}


var resetStart = function() {

  //if they click on the start button again it will re-start the quiz
  var startContainer = document.getElementById("welcome");
  var addStartBttn = document.createElement("BUTTON");
  addStartBttn.setAttribute("type", "button");
  addStartBttn.setAttribute("id", "start");
  addStartBttn.setAttribute("onclick", "startQuiz(), gameTimer()");
  var startBttnTxt = document.createTextNode("Start");
  textAppend = addStartBttn.appendChild(startBttnTxt);
  startContainer.appendChild(addStartBttn);
  
  //resets footer
  document.getElementById("progress").innerHTML = "";
  document.getElementById("progress").innerHTML = "Let's get Started!";

}

//Display if selected answer is correct or incorrect and display progress
//Also count the # of in/correct questions
var displaySelectionResult = async function(display) {
  //debugger;
  if (index < myQuestions.length) {
    document.getElementById("results").innerHTML = "";
    if (display == 1) {
      document.getElementById("results").innerHTML = "Correct!";
      totalCorrect++;
    }
    else if (display == 2) {
      document.getElementById("results").innerHTML = "Nope!";
      totalIncorrect++;
    }
  }
else {
  //fn to ask for user initials and save score
  totalScore = Math.round((totalCorrect/myQuestions.length) * 100);
  document.getElementById("results").innerHTML = "Result: " + totalCorrect + "/" + myQuestions.length + "<br><br>" + totalScore + " %";
  //Add fn for player input

  totalCorrect = 0;
  totalIncorrect = 0;
}
}


//selected button passes the information to the fn and it checks if it's correct or not
//also deleted the previous questions so the next set can be displayed
var selectedButton = async function(clicked_id, clicked_txt) { 
  //debugger;
  if (index < myQuestions.length) {
      
      //console.log("index for selected button main if: " + index);

      if (clicked_id === myQuestions[index].correctAnswer) {
          //correct answer
          display = 1;
          displaySelectionResult(display);
          deleteContainers(index);
          //wait two seconds to show the next set of questions
          await sleep(timer);
          document.getElementById("results").innerHTML = "";
          index++;
          
      }
      else if (clicked_id !== myQuestions[index].correctAnswer) {
          //incorrect answer
          display = 2;
          displaySelectionResult(display);
          deleteContainers(index);
          //wait two seconds to show the next set of questions
          await sleep(timer);
          document.getElementById("results").innerHTML = "";
          index++;
      } 
  }
  makeQuiz(index);
}


 var stopQuiz = function(i) {
   debugger;
    stop = true;
    deleteContainers(i);
    makeQuiz("null", stop);
 }


//makes the quiz adds containers for questions/answers depending on the index
//function makeQuiz (i) {
  var makeQuiz = async function(i, stop) {
  if (i < myQuestions.length) {
    
    makeContainers(i);
      
  }
  else if ((i === myQuestions.length) || (stop)) {
    //after last question is answered go through this and re-create the start button
    document.getElementById("progress").innerHTML = "";
    display = 0;
    displaySelectionResult(display);
    //wait two seconds to add the start button
    await sleep(mainTime);
    document.getElementById("results").innerHTML = "";

    //enter your initials for High Score
    
    //adds the start button
    resetStart();
  }
}

var makeContainers = function(i) {
//Question container
      //debugger;
      var container = document.getElementById("question");

      var questionContainerCreate = document.createElement("div");
      questionContainerCreate.setAttribute("id", "div-question" + i);
      container.appendChild(questionContainerCreate);
      var currentQuestion = myQuestions[i].question;
      questionContainerCreate.innerHTML = currentQuestion; 

      //Choices container
      //var container2 = document.getElementById("div-question" + i); 
      //append container to id = question instead
      var choicesContainerCreate = document.createElement("div");
      choicesContainer = choicesContainerCreate.setAttribute("id", "div-choices" + i);
      container.appendChild(choicesContainerCreate);

      var container3 = document.getElementById("div-choices" + i); 
      
      //create the buttons for the answers
      for (letter in myQuestions[i].answers) {
      var btnCreate = document.createElement("BUTTON");
      btnCreate.setAttribute("id", letter);
      btnCreate.setAttribute("class", i);
      btnCreate.setAttribute("onClick", "selectedButton(this.id, this.innerHTML)");
      var btnText = document.createTextNode(myQuestions[i].answers[letter]);
      textAppend = btnCreate.appendChild(btnText);
      container3.appendChild(btnCreate);  
      }
      var x = i + 1;
      document.getElementById("progress").innerHTML = "";
      document.getElementById("progress").innerHTML = "Question " + x + " of " + myQuestions.length;
      //console.log("index for makeQuiz: " + index);

}

var deleteContainers = function(index) {
  var deleteContainerQ = document.getElementById("div-question" + index);
  deleteContainerQ.remove();
  var deleteContainerC = document.getElementById("div-choices" + index);
  deleteContainerC.remove();
}

//object for questions and answers
var myQuestions = [
  {
    question: "What does HTML stand for?",
    answers: {
      a: "Hyper Text Markup Language",
      b: "Hyperlinks and Text Markup Language",
      c: "Hyper Tool Markup Language"
    },
    correctAnswer: "a"
  },
  {
    question: "Who is making the Web standards?",
    answers: {
      a: "Google",
      b: "Mozilla",
      c: "The World Wide Web Consortium"
    },
    correctAnswer: "c"
  },
  {
    question: "What is the correct HTML for adding a background color?",
    answers: {
      a: "<body class='background-color:yellow;'>",
      b: "<body bg='yellow'>",
      c: "<background>yellow</background>",
      d: "<body style='background-color:yellow;'>"
    },
    correctAnswer: "d"
  },
  {
      question: "What HTML element is used to define important text",
      answers: {
        a: "<important>",
        b: "<b>",
        c: "<strong>"
      },
      correctAnswer: "c"
  },
  {
      question: "What is the correct HTML for creating a hyperlink?",
      answers: {
        a: "<a href='http://www.w3schools.com'>W3Schools</a>",
        b: "<a url='http://www.w3schools.com'>W3Schools.com</a>",
        c: "<a name='http://www.w3schools.com'>W3Schools.com</a>"
      },
      correctAnswer: "a"
  },
  {
      question: "How can you open a link in a new tab/browser window?",
      answers: {
        a: "<a href='url' new>",
        b: "<a href='url' target='_blank'>",
        c: "<a href='url' target='new'>"
      },
      correctAnswer: "b"
  },
  {
      question: "Inline elements are normally displayed without starting a new line.",
      answers: {
        a: "True",
        b: "False",
      },
      correctAnswer: "a"
  }
];

//variables
  var index;
  var display;
  var totalCorrect;
  var totalIncorrect;
  var timer = 500;
  var totalScore;
  var timerComplete;
  var mainTime = 1000;
  var time = 500;
  var myPromise;
  var timeleft;
  var stop;



//function to generate the first set of questions with answers on buttons
//also deletes the start button so it can't be used throughout the quiz
var startQuiz = function() {
 // debugger;
//set all variables to 0 before starting
  index = 0;
  display = 0;
  totalCorrect = 0;
  totalIncorrect = 0;
  totalScore = 0;

  //delete start button
  var deleteStartBttn = document.getElementById("start");
  deleteStartBttn.remove();
  //start timer

  //go to make quiz with index
  makeQuiz(index);

}

