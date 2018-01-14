//assignments-- Global
var map;
var client_ID;
var client_Secret;

function AppViewModel() {
    var self = this;

    this.option = ko.observable("");
    this.scores = [];


/*
    # GET /venues/49d51ce3f964a520675c1fe3

curl -X GET -G "https://api.foursquare.com/v2/venues/49d51ce3f964a520675c1fe3" \
-d v=20170101 \
-d client_id=$CLIENT_ID \
-d client_secret=$CLIENT_SECRET


# GET /checkins/recent

curl -X GET -G "https://api.foursquare.com/v2/checkins/recent" \
-d v=20170101 \
-d oauth_token=ACCESS_TOKEN

*/

// Foursquare

    this.populateInfoWindow = function(score, infowindow) {
        if (infowindow.score != score) {
            infowindow.setContent('');
            infowindow.score = score;
         
            client_ID = "VJEKPUNX1QPT52IY5GTOXV5LTUZVZCDHUAUJPB0PGVYW4TPI";
            client_Secret =  "ECAAA5GBWTVZAOJCFAUDGN2SLZG2LFRHR11XOWNJCUQWJ3JT";
          
            var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' 
            +score.lat
            +',' 
            + score.lng 
            + '&client_id=' 
            + client_ID 
            +'&client_secret=' 
            + client_Secret 
            + '&query=' 
            + score.title 
            +'&v=20170101' 
            + '&m=foursquare';
          
            $.getJSON(apiUrl).done(function(score) {
                var response = score.response.venues[0];
                self.street = response.location.formattedAddress[0];
                self.city = response.location.formattedAddress[1];
                self.zip = response.location.formattedAddress[3];
                self.country = response.location.formattedAddress[4];
                self.category = response.categories[0].shortName;

                self.htmlContentFoursquare =
                     '<h5 class="data_title_sub">(' + self.category 
                     +')</h5>'
                     +'<div>' 
                     +'<h6 class="data_title_address"> Address: </h6>' 
                     + '<p class="data_info">'
                     + self.street 
                     + '</p>' 
                     +'<p class="data_info">' 
                     + self.city 
                     + '</p>' 
                     + '<p class="data_info">' 
                     + self.zip 
                     + '</p>' 
                     +'<p class="data_info">'
                     + self.country 
                     + '</p>' 
                     + '</div>' 
                     + '</div>';

                infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                
                alert(
                    "Please refresh your page again."
                );
            });

            this.htmlContent = '<div>' + '<h4 class="data_info_title">' + score.title +
                '</h4>';

            infowindow.open(map, score);

            infowindow.addListener('closeclick', function() {
                infowindow.score = null;
            });
        }
    };

    this.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

//Ramallah latitude longitude

    this.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(31.898043, 35.204269),
            zoom: 18,
            styles: styles
        };
     
        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < locations.length; i++) {
            this.score_title = locations[i].title;
            this.score_lat = locations[i].lat;
            this.score_lng = locations[i].lng;
            //score setup
            this.score = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.score_lat,
                    lng: this.score_lng
                },
                title: this.score_title,
                lat: this.score_lat,
                lng: this.score_lng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.score.setMap(map);
            this.scores.push(this.score);
            this.score.addListener('click', self.populateAndBounceMarker);
        }
    };

    this.initMap();

    //apply filtration
    this.locationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.scores.length; i++) {
            var score_location = this.scores[i];
            if (score_location.title.toLowerCase().includes(this.option()
                    .toLowerCase())) {
                result.push(score_location);
                this.scores[i].setVisible(true);
            } else {
                this.scores[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

googleError = function googleError() {
    alert(
        ' try again!'
    );
};

function startApp() {
    ko.applyBindings(new AppViewModel());
}