(function(){

// I wanted to use jQuery, but I didn't want to use jQuery, so I wrote my own. Terrible, neh?
var s = function (id) {
  var e = document.getElementById(id);
  return {
    show: function () {
      e.style.display = 'block';
    },
    hide: function () {
      e.style.display = 'none';
    },
    add: function (val) {
      e.innerHTML = e.innerHTML + val;
    },
    set: function (val) {
      e.innerHTML = val;
    },
    get: function () {
      return e.innerHTML;
    },
    on: function (action, on) {
      e.addEventListener(on, function(e) {
        e.preventDefault();
        action();
      }, false);
    },
    val: function () {
      return e.value;
    },
    e: function () {
      return e;
    }
  }
};

// Okay, let the app begin!
// The app gets words from Wanikani using an API-wrapper and returns three random one's.
var app = {

  // Wanted to have some of those fancy varz.
  wk: {}, words: [],
  
  // What to do if the user wants to be forgotten
  forgetme: function () {
    localStorage.setItem("key", "");
    location.reload();
  },

  // Get those wordzzz~
  load: function (callback) {
    this.wk = new WkApi(localStorage.getItem('key'));
    this.wk.getVocabulary().then(function(words) {
      
      // Throw out all the words that are not unlocked and store the remaining words.
      app.words = _.reject(words, function (word) {
        return word.userSpecific == null
      });
      callback();
    }, function() {
      alert('Key could not be fetched. Is it really your key?');
      app.forgetme();
    });
  },

  // Get that API-key and render the page
  fetch: function () {
    var key = s('key').val();
    if (/[0-9a-f]{32}/g.test(key)) {
      localStorage.setItem('key', key);
      app.render();
    } else alert("Invalid key! Must be 32 characters.");
  },

  // Give us da random words. Note to self: returns object. Look for word.meaning and word.kanji and stuff
  randomWords: function () {
    return _.sample(this.words, s('amount').val());
  },

  // This is the main function.
  render: function () { 
    s('explanation').hide();

    app.load(function() {
      s('output').set('');

      _.each(app.randomWords(), function (word) {
        var template = _.template(s('word').get());
        s('output').add(template(word));
      });

      // Let's show that app.
      s('app').show();
    });
  },

  // What to do when we start the app?
  start: function () {
    
    // Let's check, do we have a key from next time?
    if (localStorage.getItem('key')) {
      this.render();
    } 
    // No? Then the form is shown by default.

    // Bind the buttons
    s('fetch').on(this.fetch, 'submit');
    s('forgetme').on(this.forgetme, 'click');
    s('startagain').on(this.render, 'click');
    s('amount').on(this.render, 'change');
  }
};

// Vroahr~
app.start();
})();