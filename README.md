# trello-promise

## Inspired from [norberteder/trello](https://github.com/norberteder/trello)
   Trello client with isomorphic-fetch and promises.


```javascript
   var Trello = require("trello");
  var trello = new Trello("MY APPLICATION KEY", "MY USER TOKEN");

  trello.addCard('Clean car', 'Wax on, wax off', myListId}).then(res=>console.log('Yay!'));
      
 ```
