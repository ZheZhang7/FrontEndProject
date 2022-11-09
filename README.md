# FrontEndProject
## NewsSystem

**Knowledge Point**   
React, React Hooks, React Router6, React Redux, Antd

The project is a global news release management system for ordinary visitors, super administrators, area administrators, and area editors four roles to access, for different roles displayed on the page and have different permissions.     
    
**Visitors**: You can visit the news display page and news details page.    
**Super Administrator** : You can manage user lists, role lists, permissions for different roles, and write and review news.     
**Regional Administrator** : can manage the corresponding regional editing, publishing news, and the region 's news review and release.     
**Regional editing** : You can write news, review your own news, and publish it.    
    
Data in the project is simulated by json-server, and front-end development does not rely on back-end data    
Build a JSON service locally with the following commands :   

json-server --watch ./filename.json --port 8000   

## MobileTeaMall

**Knowledge Point**   
Vue, Vuex, Router, JavaScript, CSS, MySql, Node.js

The project fully presents the process of purchasing products in the online mall, including adding shopping cart, selecting address, order payment, etc.     
Vuex implements the management of status, including shopping cart management, order management, user management, address management, etc.     
Build a route using Vue-Router and add blocking to its route ;     
axios secondary packaging, adding JWT authentication mechanism ;     
connect the MySQL database through Node.js, and the front end completes the rendering of the data according to the interface data provided by the back end.     
At the same time, it realizes the functions of SMS verification code login, registration, and password recovery.
