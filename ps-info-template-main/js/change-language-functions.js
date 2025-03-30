var languageContent = {
    greek: {
      languageBtn: "EL",
      mainTitle: "Άδεια Εξάσκησης Επαγγέλματος Διπλωματούχου Ηλεκτρονικού Μηχανικού και Μηχανικού Υπολογιστών",
      pageTitle: "Άδεια Εξάσκησης Επαγγέλματος Διπλωματούχου Ηλεκτρονικού Μηχανικού και Μηχανικού Υπολογιστών",
      infoTitle: "Πληροφορίες για την χορήγηση Άδεια Εξάσκησης Επαγγέλματος Διπλωματούχου Ηλεκτρονικού Μηχανικού και Μηχανικού Υπολογιστών",
      subTitle1: "Αυτό το ερωτηματολόγιο μπορεί να σας βοηθήσει να βρείτε αν μπορείτε κι πως να εκδώσετε Άδεια Εξάσκησης Επαγγέλματος Διπλωματούχου Ηλεκτρονικού Μηχανικού και Μηχανικού Υπολογιστών.",
      subTitle2: "H συμπλήρωση του ερωτηματολογίου δεν απαιτεί παραπάνω από 10 λεπτά.",
      subTitle3: "Δεν θα αποθηκεύσουμε ούτε θα μοιραστούμε τις απαντήσεις σας.",
      backButton: "Πίσω",
      nextQuestion: "Επόμενη ερώτηση",
      biggerCursor: "Μεγαλύτερος Δρομέας",
      bigFontSize: "Μεγάλο Κείμενο",
      readAloud: "Ανάγνωση",
      changeContrast: "Αντίθεση",
      readingMask: "Μάσκα Ανάγνωσης",
      footerText: "Αυτό το έργο δημιουργήθηκε για τις ανάγκες της εργασίας μου στο μάθημα Ηλεκτρονική Διακυβέρνσησ κατά τη διάρκεια των μεταπτυχικό μου σπουδών στο Πανεπιστήμιο Μακεδονίας στο τμήμα της Εφαρμοσμένης Πληροφορικής:",
      student1: "Κυριζάκη Αλεξάνδρα",
      startBtn:"Ας ξεκινήσουμε",
      chooseAnswer: "Επιλέξτε την απάντησή σας",
      oneAnswer: "Μπορείτε να επιλέξετε μόνο μία επιλογή.",
      errorAn: "Λάθος:",
      choose: "Πρέπει να επιλέξετε μια απάντηση",
    },
    english: {
      languageBtn: "EN",
      mainTitle: "Licence to pursue the profession of qualified electronic and computer engineer",
      pageTitle: "Licence to pursue the profession of qualified electronic and computer engineer",
      infoTitle: "Information on the granting of the Licence to Practice as a Certified Electronics and Computer Engineer",
      subTitle1: "This questionnaire can help you to find out if and how to obtain a Licence to practise as a qualified electronic and computer engineer.",
      subTitle2: "The questionnaire takes no more than 10 minutes to complete.",
      subTitle3: "We will not store or share your answers.",
      backButton: "Βack",
      nextQuestion: "Next Question",
      biggerCursor: "Bigger Cursor",
      bigFontSize:" Big Font Size",
      readAloud: "Read Aloud",
      changeContrast:" Change Contrast",
      readingMask:" Reading Mask",
      footerText: "This project was created for the needs of my coursework in the Electronic Governance course during my postgraduate studies at the University of Macedonia in the Department of Applied Informatics:",
      student1: "Kyrizaki Alexandra",
      startBtn:"Let's start",
      chooseAnswer: "Choose your answer",
      oneAnswer: "You can choose only one option.",
      errorAn: "Error:",
      choose: "You must choose an answer",
    }
};
  
// Retrieve the selected language from localStorage or set default to "greek"
var currentLanguage = localStorage.getItem("preferredLanguage") || "greek";

function toggleLanguage() {
    currentLanguage = currentLanguage === "greek" ? "english" : "greek";
    localStorage.setItem("preferredLanguage", currentLanguage);
    updateContent();
}

function updateContent() {
    var components = document.querySelectorAll(".language-component");
     
    components.forEach(function (component) {
        var componentName = component.dataset.component;
        component.textContent = languageContent[currentLanguage][componentName];
    });
}

// Initialize the content based on the selected language
updateContent();