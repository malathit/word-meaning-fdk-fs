var client = null;

$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          console.log("app initialized");
          client = _client;
          client.events.on('app.activated',
            function() {
                console.log("app activated");
                client.data.get('requester')
                    .then(function(data) {
                        $('#apptext').text("Ticket created by " + data.requester.name);
                    })
                    .catch(function(e) {
                        console.log('Exception - ', e);
                    });
        });
    });
});

function get_meaning(word) {
    console.log("retrieving meaning for word : ", word);
    const app_id = "50ec4f8b"; // insert your APP Id
    const app_key = "3881c2e3e2d64637eabe17d929e6c4d5"; // insert your APP Key
    const wordId = "ace";
    const fields = "definitions,examples";
    const strictMatch = "false";
    const options = {
        headers: {
            'app_id': app_id,
            'app_key': app_key
        }
    };
    client.request.get("https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/" + word + '?fields=' + fields + '&strictMatch=' + strictMatch, options)
        .then(
            function(data) {
                console.log("data from api:", JSON.parse(data.response).results);
                var user_response = "";
                var api_results = JSON.parse(data.response).results;
                for (var i = api_results.length - 1; i >= 0; i--) {
                    for (var j = api_results[i].lexicalEntries.length - 1; j >= 0; j--) {
                        user_response += "<p>definition:<br/>" + api_results[i].lexicalEntries[j].entries[0].senses[0].definitions[0] + "</p>";
                        if (api_results[i].lexicalEntries[j].entries[0].senses[0].examples) {
                            user_response += "<p>example:<br/>" + api_results[i].lexicalEntries[j].entries[0].senses[0].examples[0].text + "</p>";
                            console.log("user_response=", user_response);
                        }
                    }
                }
                document.getElementById("word_meaning_div").innerHTML = user_response;
            },
            function(error) {
                console.log("error from api:", error);
            }
    );
}