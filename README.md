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
