Countries web app.

The project utilizes the following tech stack: Node.js for the server-side, a cloud-based SQL database, an API, and React with CSS for the frontend display.

Upon site load, there's a check for any changes in the information from the API. If updates are found or if data is missing, these are loaded into the database, from which the data is then displayed using React components.

A particular feature of the project is that some countries are searched by their full name while others by a common name, due to the API's response structure not always providing the needed country first.

The project includes search functionality by region and name, mobile and desktop views, as well as dark and light themes.
