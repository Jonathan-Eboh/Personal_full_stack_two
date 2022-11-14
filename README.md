# Personal full stack two
![Nerdy_movie_night_planner](https://user-images.githubusercontent.com/23227549/201443065-cc6742ad-313a-4abf-a8fe-3bebca542976.png)


Tech used: 

Front end: HTML, CSS, JavaScript, Moive API, Cocktail API, Meal API 

Back end: Node js, mongo db

A full stack web application that allows the user to plan movie nights with their friends with a nerdy theme!

Optimizations:

This was a pleasant and rare instance where the pipe line from idea to fully built out piece of software was able to flow with relatively few hitches. That said, half way through development the API I was leveraging started to return bad data for some of its entries. This lead to me utilizing a conditional clause within my EJS to preclude bad data from being rendered to the front end.

C.R.U.D 

for this one the paradigm takes the structure of

Create: Allows the user to create and specify the details of their movie night. This is then saved to the data base as a document.

Read: Once the user has created their event they are allowed to go to a page to see all of their created events

Update: Once the user is browsing all the event they have created are then allowed th favorite an event via a familiar labeled and clickable heart icon
  this updates a boolean on the back end which keeps track of whether or not something has been favorited. This feature is also indefinitely toggleable 
  
Delete: The user has the option to delete a given event on the same page they are able to view all their events
