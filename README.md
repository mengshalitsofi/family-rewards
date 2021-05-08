# family-rewards
This project consists of a Rails backend and a JavaScript Frontend. This is the forth project for Flatiron School, created by Mengsha Li.

The purpose of this application is to allow my daughter to "earn rewards" for good behavior and then spend them for things she likes to do.

## Getting Started
1. You might need to install the necessary gems first
  bundle install
2. Then, go to /family-rewards-backend and start the backend server
  rails s
3. Open /family-rewards-frontend/index.html in a browser to start the app

## Application flow
This application is a single-page application without any refreshes. It writes and reads all its data to the database. In this application, you can add more "behaviors" and assign a cost to them. Negative cost means it's for spending rewards and positive means it's for gaining rewards.
Once the behaviors are defined, you can press the + button next to each behavior to add a line for it. The balance will be recalculated automatically.

License
This project is licensed under MIT

Authors
Mengsha Li