$("document").ready(function () {
  var currentQuestion = 0;
  var totalQuestions = 0;
  var userAnswers = {};
  var all_questions;
  var all_questions_en;
  var all_evidences;
  var all_evidences_en;
  var faq;
  var faq_en;

  //hide the form buttons when its necessary
  function hideFormBtns() {
    $("#nextQuestion").hide();
    $("#backButton").hide();
  }

  //Once the form begins, the questions' data and length are fetched.
  function getQuestions() {
    return fetch("question-utils/all-questions.json")
      .then((response) => response.json())
      .then((data) => {
        all_questions = data;
        totalQuestions = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/all-questions-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_questions_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch all-questions-en.json:", error);

            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent =
              "Error: Failed to fetch all-questions-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch all-questions:", error);

        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch all-questions.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  //Once the form begins, the evidences' data and length are fetched.
  function getEvidences() {
    return fetch("question-utils/cpsv.json")
      .then((response) => response.json())
      .then((data) => {
        all_evidences = data;
        totalEvidences = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/cpsv-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_evidences_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch cpsv-en:", error);

            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch cpsv-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch cpsv:", error);

        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch cpsv.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  //Once the form begins, the faqs' data is fetched.
  function getFaq() {
    return fetch("question-utils/faq.json")
      .then((response) => response.json())
      .then((data) => {
        faq = data;
        totalFaq = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/faq-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            faq_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch faq-en:", error);
            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch faq-en.json.";
            $(".question-container").html(errorMessage);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch faq:", error);
        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch faq.json.";
        $(".question-container").html(errorMessage);
      });
  }

  function getEvidencesById(id) {
    var selectedEvidence;
    currentLanguage === "greek"
      ? (selectedEvidence = all_evidences)
      : (selectedEvidence = all_evidences_en);
    selectedEvidence = selectedEvidence.PublicService.evidence.find(
      (evidence) => evidence.id === id
    );

    if (selectedEvidence) {
      const evidenceListElement = document.getElementById("evidences");
      selectedEvidence.evs.forEach((evsItem) => {
        const listItem = document.createElement("li");
        listItem.textContent = evsItem.name;
        evidenceListElement.appendChild(listItem);
      });
    } else {
      console.log(`Evidence with ID '${givenEvidenceID}' not found.`);
    }
  }

  //text added in the final result
  function setResult(text) {
    const resultWrapper = document.getElementById("resultWrapper");
    const result = document.createElement("h5");
    result.textContent = text;
    resultWrapper.appendChild(result);
  }

  function loadFaqs() {
    var faqData = currentLanguage === "greek" ? faq : faq_en;
    var faqTitle =
      currentLanguage === "greek"
        ? "Συχνές Ερωτήσεις"
        : "Frequently Asked Questions";

    var faqElement = document.createElement("div");

    faqElement.innerHTML = `
        <div class="govgr-heading-m language-component" data-component="faq" tabIndex="15">
          ${faqTitle}
        </div>
    `;

    var ft = 16;
    faqData.forEach((faqItem) => {
      var faqSection = document.createElement("details");
      faqSection.className = "govgr-accordion__section";
      faqSection.tabIndex = ft;

      faqSection.innerHTML = `
        <summary class="govgr-accordion__section-summary">
          <h2 class="govgr-accordion__section-heading">
            <span class="govgr-accordion__section-button">
              ${faqItem.question}
            </span>
          </h2>
        </summary>
        <div class="govgr-accordion__section-content">
          <p class="govgr-body">
          ${convertURLsToLinks(faqItem.answer)}
          </p>
        </div>
      `;

      faqElement.appendChild(faqSection);
      ft++;
    });

    $(".faqContainer").html(faqElement);
  }

  // get the url from faqs and link it
  function convertURLsToLinks(text) {
    return text.replace(
      /https:\/\/www\.gov\.gr\/[\S]+/g,
      '<a href="$&" target="_blank">' + "myKEPlive" + "</a>" + "."
    );
  }


  //Εachtime back/next buttons are pressed the form loads a question
  function loadQuestion(questionId, noError) {
    
    $("#nextQuestion").show();
    if (currentQuestion > 0) {
      $("#backButton").show();
    } 

    currentLanguage === "greek"
      ? (question = all_questions[questionId])
      : (question = all_questions_en[questionId]);
    var questionElement = document.createElement("div");

    //If the user has answered the question (checked a value), no error occurs. Otherwise you get an error (meaning that user needs to answer before he continues to the next question)!
    if (noError) {
      questionElement.innerHTML = `
                <div class='govgr-field'>
                    <fieldset class='govgr-fieldset' aria-describedby='radio-country'>
                        <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                            ${question.question}
                        </legend>
                        <div class='govgr-radios' id='radios-${questionId}'>
                            <ul>
                                ${question.options
                                  .map(
                                    (option, index) => `
                                    <div class='govgr-radios__item'>
                                        <label class='govgr-label govgr-radios__label'>
                                            ${option}
                                            <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                                        </label>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    </fieldset>
                </div>
            `;
    } else {
      questionElement.innerHTML = `
            <div class='govgr-field govgr-field__error' id='$id-error'>
            <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                        ${question.question}
                    </legend>
                <fieldset class='govgr-fieldset' aria-describedby='radio-error'>
                    <legend  class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
                        Επιλέξτε την απάντησή σας
                    </legend>
                    <p class='govgr-hint language-component' data-component='oneAnswer'>Μπορείτε να επιλέξετε μόνο μία επιλογή.</p>
                    <div class='govgr-radios id='radios-${questionId}'>
                        <p class='govgr-error-message'>
                            <span class='govgr-visually-hidden language-component' data-component='errorAn'>Λάθος:</span>
                            <span class='language-component' data-component='choose'>Πρέπει να επιλέξετε μια απάντηση</span>
                        </p>
                        
                            ${question.options
                              .map(
                                (option, index) => `
                                <div class='govgr-radios__item'>
                                    <label class='govgr-label govgr-radios__label'>
                                        ${option}
                                        <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                                    </label>
                                </div>
                            `
                              )
                              .join("")}
                    </div>
                </fieldset>
            </div>
        `;

      //The reason for manually updating the components of the <<error>> questionElement is because the
      //querySelectorAll method works on elements that are already in the DOM (Document Object Model)
      if (currentLanguage === "english") {
        // Manually update the english format of the last 4 text elements in change-language.js
        //chooseAnswer: "Choose your answer",
        //oneAnswer: "You can choose only one option.",
        //errorAn: "Error:",
        //choose: "You must choose one option"
        var components = Array.from(
          questionElement.querySelectorAll(".language-component")
        );
        components.slice(-4).forEach(function (component) {
          var componentName = component.dataset.component;
          component.textContent =
            languageContent[currentLanguage][componentName];
        });
      }
    }

    $(".question-container").html(questionElement);
  }

  function skipToEnd(message) {
    const errorEnd = document.createElement("h5");
    const error =
      currentLanguage === "greek"
        ? "Λυπούμαστε αλλά δεν μπορείτε να εκδώσετε Άδεια Εξάσκησης Επαγγέλματος Διπλωματούχου Ηλεκτρονικού Μηχανικού και Μηχανικού Υπολογιστών!"
        : "We are sorry but you cannot issue a Licence to Practice as a Certified Electronic and Computer Engineer!";
    errorEnd.className = "govgr-error-summary";
    errorEnd.textContent = error + " " + message;
    $(".question-container").html(errorEnd);
    hideFormBtns();
  }

  $("#startBtn").click(function () {
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  function retrieveAnswers() {
    var allAnswers = [];
    getEvidencesById(2);

    for (var i = 0; i < totalQuestions; i++) {
        allAnswers[i] = sessionStorage.getItem("answer_" + i);
    }
    if (allAnswers[0] === "1") {
        getEvidencesById(3);
        getEvidencesById(4);
        getEvidencesById(5);
        getEvidencesById(6);
        getEvidencesById(7);
        getEvidencesById(9);
    } else if (allAnswers[0] === "2") {
        getEvidencesById(3);
        getEvidencesById(4);
        getEvidencesById(5);
        getEvidencesById(7);
        getEvidencesById(9);
        currentLanguage === "greek"
        ? setResult("Μπορείς να εκδόσεις άδεια άσκησης επαγγέλματος παρόλο που έχετε υποβάλλει ήδη μια φορά αίτηση.")
        : setResult("You can issue a professional licence even though you have already applied once.");
    }
    if (allAnswers[2] === "1") {
        getEvidencesById(8);
        currentLanguage === "greek"
        ? setResult("Μπορείς να εκδόσεις άδεια άσκησης επαγγέλματος ως απόφοιτος ελληνικού πολυτεχνείου και όλα τα δικαιολογητικά είναι τα ακόλουθα.")
        : setResult("You can issue a professional license as a graduate of a Greek polytechnic university and all the supporting documents are as follows.");
    } else if (allAnswers[2] === "2") {
        getEvidencesById(1);
        currentLanguage === "greek"
        ? setResult("Μπορείς να εκδόσεις άδεια άσκησης επαγγέλματος ως απόφοιτος ισότιμου πανεπιστημίου της αλλοδαπής και όλα τα δικαιολογητικά είναι τα ακόλουθα.")
        : setResult("You can issue a professional license as a graduate of an equivalent foreign university and all the documents are as follows.");
    }
}

  function submitForm() {
    const resultWrapper = document.createElement("div");
    const titleText =
      currentLanguage === "greek"
        ? "Είστε δικαιούχος!"
        : "You are eligible!";
    resultWrapper.innerHTML = `<h1 class='answer'>${titleText}</h1>`;
    resultWrapper.setAttribute("id", "resultWrapper");
    $(".question-container").html(resultWrapper);
    
    const evidenceListElement = document.createElement("ol");
    evidenceListElement.setAttribute("id", "evidences");
    currentLanguage === "greek"
      ? $(".question-container").append(
          "<br /><br /><h5 class='answer'>Τα δικαιολογητικά που πρέπει να προσκομίσετε για την Άδεια Εξάσκησης Επαγγέλματος Διπλωματούχου Ηλεκτρολόγου Μηχανικού και Μηχανικού Υπολογιστών είναι τα εξής:</h5><br />"
        )
      : $(".question-container").append(
          "<br /><br /><h5 class='answer'>The documents you need to submit for the Licence to Practice as a Graduate in Electronic and Computer Engineering are the following:</h5><br />"
        );
    $(".question-container").append(evidenceListElement);
    $("#faqContainer").load("faq.html");
    retrieveAnswers();
    hideFormBtns();
  }

  $("#nextQuestion").click(function () {
    if ($(".govgr-radios__input").is(":checked")) {
      var selectedRadioButtonIndex =
        $('input[name="question-option"]').index(
          $('input[name="question-option"]:checked')
        ) + 1;
      console.log(selectedRadioButtonIndex);
      if (currentQuestion === 0 && selectedRadioButtonIndex === 3) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Μπορείτε να υποβάλεται ΜΟΝΟ μια φορά αιτηση για άδεια άσκησης επαγγέλματος.") : skipToEnd("You can apply for a professional licence ONLY once.");
      } else if (currentQuestion === 1 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Πρέπει να είστε κάτοχος πτυχίου ελληνικού πολυτεχνίου ή κάτοχος συναφούς πτυχίου της αλλοδαπής νομίμως επικυρωμένου με επίσημη μετάφραση.") : skipToEnd("You must hold a degree from a Greek polytechnic university or a relevant foreign degree legally certified with an official translation.");
      } else if (currentQuestion === 2 && selectedRadioButtonIndex === 3) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Πρέπει να είστε κάτοχος πτυχίου ελληνικού πολυτεχνίου ή κάτοχος συναφούς πτυχίου της αλλοδαπής νομίμως επικυρωμένου με επίσημη μετάφραση.") : skipToEnd("You must hold a degree from a Greek polytechnic university or a relevant foreign degree legally certified with an official translation.");     
      } else if (currentQuestion === 3 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Πρέπει να είναι ενεργή περίοδο δηλώσεων για να υποβάλεται αίτηση.") : skipToEnd("Must be active declaration period to apply.");
      } else if (currentQuestion === 5 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Πρέπει να  έχουν εκδοθεί οι κωδικοί σύνδεσης πρώτα για να υποβάλεται αίτηση.") : skipToEnd("Login codes must be issued first before a request can be submitted.");      
      } else {
        //save selectedRadioButtonIndex to the storage
        userAnswers[currentQuestion] = selectedRadioButtonIndex;
        sessionStorage.setItem(
          "answer_" + currentQuestion,
          selectedRadioButtonIndex
        ); // save answer to session storage

        //if the questions are finished then...
        if (currentQuestion + 1 == totalQuestions) {
          submitForm();
        }
        // otherwise...
        else {
          currentQuestion++;
          loadQuestion(currentQuestion, true);

          if (currentQuestion + 1 == totalQuestions) {
            currentLanguage === "greek"
              ? $(this).text("Υποβολή")
              : $(this).text("Submit");
          }
        }
      }
    } else {
      loadQuestion(currentQuestion, false);
    }
  });

  $("#backButton").click(function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion, true);

      // Retrieve the answer for the previous question from userAnswers
      var answer = userAnswers[currentQuestion];
      if (answer) {
        $('input[name="question-option"][value="' + answer + '"]').prop(
          "checked",
          true
        );
      }
    }
  });

  $("#languageBtn").click(function () {
    toggleLanguage();
    loadFaqs();
    // if is false only when the user is skipedToEnd and trying change the language
    if (currentQuestion >= 0 && currentQuestion < totalQuestions - 1)
      loadQuestion(currentQuestion, true);
  });

  $("#questions-btns").hide();

  // Get all questions
  getQuestions().then(() => {
    // Get all evidences
    getEvidences().then(() => {
      // Get all faqs 
      getFaq().then(() => {
        // Code inside this block executes only after all data is fetched
        // load  faqs and the first question on page load
        loadFaqs();
        $("#faqContainer").show();
        loadQuestion(currentQuestion, true);
      });
    });
  });
});
