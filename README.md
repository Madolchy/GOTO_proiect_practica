<div align="center"> <h1> GOTO </h1> </div>

# Introduction
This project is made for me to learn the basics of communication between microservices. Arhitectually it's going to be composed of a frontend and [x] services:
- (Frontend)[services/frontend]: Svelte
- Trip management service
- Dispatch service
-
-

# Flow & Graphs
## Frontend
The frontend is going to show a map of the user's current location estimasted based on the ip, and it will ask for geological position.  
After that, the user gets the possibility to select exactly 2 points on the map: the pickoff location and the destination.  
When both points have been selected, the frontend will send a get request to the trip management service, which will calculate the exact price for the drive.

If the user agrees to the price, dispatch service will find a suitable driver and if the driver confirms, then the payment will go through.
