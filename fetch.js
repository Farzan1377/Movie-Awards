import {wordList} from './words.js'

var url = 'http://www.omdbapi.com/?i=tt3896198&apikey=76da287b'

// Initialize movie results randomly on load
window.onload = initialize_results

// Action to do when user nominates a movie
function nominate_movie(movie, check_box) {
    var container = document.getElementById('nominations_container')
    
    // If already nominated, remove from nomination list
    if (check_box.checked == true) {
        var child_to_remove = document.getElementById(movie.imdbID)
        container.removeChild(child_to_remove)
        check_box.checked = false
    }
    else {
        // User has less than 5 nominations 
        // 6 written in if condition below because <h2> tag is counted as a child
        if (container.children.length < 6) {

            // Initialize variables
            var nomination = document.createElement('div')
            var nomination_text = document.createElement('p')
            var nomination_text_year = document.createElement('p')
            var movie_info = document.createTextNode(movie.Title + ' ')
            var movie_year = document.createTextNode(movie.Year)
            var remove_button = document.createElement('div')
            
            nomination.id = movie.imdbID

            // Add deleting feature to trash icon
            remove_button.addEventListener('click', function(){
                container.removeChild(nomination)
                check_box.checked = false
            });
            
            remove_button.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>'
            
            remove_button.classList.add('remove_button')
            nomination.classList.add('nomination')
            nomination_text.classList.add('nomination_text')
            nomination_text_year.classList.add('nomination_text_year')
            
            nomination_text_year.appendChild(movie_year)
            nomination_text.appendChild(movie_info)
            nomination.appendChild(nomination_text)
            nomination.appendChild(nomination_text_year)
            nomination.appendChild(remove_button)
            container.appendChild(nomination)
            check_box.checked = true
        }
        // User has selected 5 nominations
        if (container.children.length == 6) {
            var nominations_banner = document.getElementById('nominations_banner')
            var close_button = document.getElementById('close_banner')
            
            nominations_banner.style.display = 'flex';
            
            close_button.addEventListener('click', function() {
                nominations_banner.style.display = 'none';
            });
        }
    }
}

// Functionality when user changes input in search bar
function input_changed(value) {
  
    // Initialize variables
    var container = document.getElementById('results_container')
    var too_many_error = document.getElementById('too_many_error')
    var not_found_error = document.getElementById('not_found_error')
    
    not_found_error.style.display = 'none'
    too_many_error.style.display = 'none'
    
    // Remove results already being shown since user has changed search bar value
    container.textContent = '';
    
    // Send GET request if search bar value is not empty
    if (value != '') {
        var request = new XMLHttpRequest();
        var name_url = url + '&s=' + value + '&type=movie'
        request.open( "GET", name_url, false );
        request.send( null );
    
        // Parse the response returned from server
        var obj = JSON.parse(request.responseText);
        
        // Response has movie objects
        if (obj.Response == 'True') { 
            for (var i = 0 ; i < obj.Search.length ; i++) {
                (function () {
                    
                    // Initialize variables
                    var img = document.createElement('img')
                    var movie_object = obj.Search[i]
                    var img_container = document.createElement('div')
                    var nominate_button = document.createElement('label')
                    var check_box = document.createElement('input')
                    var check_mark = document.createElement('span')
                    var title = document.createElement('p')
                    var year = document.createElement('p')
                    var title_value = ''

                    check_box.type = 'checkbox'
                    check_box.classList.add('check_box')
                    check_mark.classList.add('check_mark')
                    title.classList.add('movie_title')
                    year.classList.add('movie_year')
                    img.classList.add('movie_image')
                    nominate_button.classList.add('nominate_button')
                    img_container.classList.add('movie_image_container')

                    nominate_button.appendChild(check_box)
                    nominate_button.appendChild(check_mark)
              
                    // Listen to user click on both movie poster and heart button
                    nominate_button.addEventListener('click', function(evt) {
                        nominate_movie(movie_object, check_box)
                        
                        // Stop firing click event twice
                        evt.stopPropagation()
                        evt.preventDefault()
                    })

                    img.addEventListener('click', function(){
                        nominate_movie(movie_object, check_box)
                    });
                
                    // Show substring if title len bigger than 16 (for design purposes)
                    if (obj.Search[i].Title.length > 16) {
                        title_value = obj.Search[i].Title.substring(0, 13) + '...'
                    }
                    else title_value = obj.Search[i].Title

                    var title_text = document.createTextNode(title_value)
                    var year_text = document.createTextNode(obj.Search[i].Year)
                    
                    title.appendChild(title_text)
                    year.appendChild(year_text)
                    
                    // Show default image if movie object does not have image
                    if (obj.Search[i].Poster == 'N/A') {
                        img.src = 'noPoster.png'
                    }
                    else img.src = obj.Search[i].Poster

                    img_container.appendChild(img)
                    img_container.appendChild(nominate_button)
                    img_container.appendChild(title)
                    img_container.appendChild(year)
                    container.appendChild(img_container)
                }())
            }
           
        }
        else if (obj.Error == 'Movie not found!') {
            // Show not_found div
            not_found_error.style.display = 'flex'
        }
        else if (obj.Error == 'Too many results.') {
            // Show too_many div
            too_many_error.style.display = 'flex'
        }
    }
    container.appendChild(not_found_error)
    container.appendChild(too_many_error)
}

// Load random movie results on page load
function initialize_results() {
    var search_input = document.getElementById('search_bar')
    var word = wordList[Math.floor(Math.random() * wordList.length)];
    var too_many_error = document.getElementById('too_many_error')
    var not_found_error = document.getElementById('not_found_error')
    
    // Call input_changed when user types something in search bar
    search_input.addEventListener('input', function(){
        input_changed(search_input.value)
    });

    input_changed(word)

    // In the very odd case the word gives no movie results, run the function again
    while (too_many_error.style.display == "flex" || not_found_error.style.display == "flex") {
        input_changed(word)
    }
    
}