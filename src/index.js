import fetch from 'isomorphic-fetch';
const GET = 'GET',
      POST = 'POST',
      PUT = 'PUT',
      DELETE = 'DELETE';

class Trello{
  constructor(key,token){
    this.uri = "https://api.trello.com";
    this.key = key;
    this.token = token;
  }

  createQuery(){
    return {key: this.key, token: this.token};
  };
  makeRequest(method, resourceUri , opts) {
       let body, uri, query = this.createQuery() ,queryString = '';
       switch(method){
         case GET :
            if(opts){
              query = {
                ...query,
                ...opts
              };
            }
            Object.keys(query).forEach((key,index,arr)=>{
               queryString+=`${key}=${encodeURIComponent(query[key])}`;
               if(index<(arr.length - 1)){
                 queryString+='&';
               }
            });
            uri = `${resourceUri}?${queryString}`;

            break;
          default :
            break;
       }
       return fetch(uri,{
          method,
          body
       }).then(res=>res.json())
       .then(response=>console.log(response));
  }

  getMyBoards(){
    return this.makeRequest(GET,this.uri + '/1/member/me/boards',{});
  }
  addBoard(name, description, organizationId, callback) {
      var query = this.createQuery();
      query.name = name;

      if (description !== null)
          query.desc = description;
      if (organizationId !== null)
          query.idOrganization = organizationId;

      return this.makeRequest(POST, this.uri + '/1/boards', {query: query}, callback);
  };

addCard(name, description, listId, callback) {
    var query = this.createQuery();
    query.name = name;
    query.idList = listId;

    if (description !== null)
        query.desc = description;

    return this.makeRequest(POST, this.uri + '/1/cards', {query: query}, callback);
};

getCard(boardId, cardId, callback) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/cards/' + cardId, {}, callback);
};

getCardsForList(listId, actions, callback) {
    var query = {};
    if (actions)
        query.actions = actions;
    return this.makeRequest(GET, this.uri + '/1/lists/' + listId + '/cards', query, callback);
};

renameList(listId, name, callback) {
    return this.makeRequest(PUT, this.uri + '/1/lists/' + listId + '/name', {name}, callback);
};

addListToBoard (boardId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    return this.makeRequest(POST, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

addCommentToCard(cardId, comment, callback) {
    var query = this.createQuery();
    query.text = comment;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/actions/comments', {query: query}, callback);
};

addAttachmentToCard(cardId, url, callback) {
    var query = this.createQuery();
    query.url = url;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/attachments', {query: query}, callback);
};

addMemberToCard(cardId, memberId, callback) {
    var query = this.createQuery();
    query.value = memberId;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/members', {query: query}, callback);
};

getBoards(memberId, callback) {
    return this.makeRequest(GET, this.uri + '/1/members/' + memberId + '/boards', {query: this.createQuery()}, callback);
};

addChecklistToCard (cardId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
};

addExistingChecklistToCard (cardId, checklistId, callback) {
    var query = this.createQuery();
    query.idChecklistSource = checklistId;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
};

getChecklistsOnCard(cardId, callback) {
    return this.makeRequest(GET, this.uri + '/1/cards/' + cardId + '/checklists', {query: this.createQuery()}, callback);
};

addItemToChecklist (checkListId, name, pos, callback) {
    var query = this.createQuery();
    query.name = name;
    query.pos = pos;

    return this.makeRequest(POST, this.uri + '/1/checklists/' + checkListId + '/checkitems', {query: query}, callback);
};

updateCard (cardId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return this.makeRequest(PUT, this.uri + '/1/cards/' + cardId + '/' + field, {query: query}, callback);
};

updateChecklist(checklistId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return this.makeRequest(PUT, this.uri + '/1/checklists/' + checklistId + '/' + field, {query: query}, callback);
};

updateCardName(cardId, name, callback) {
    return this.updateCard(cardId, 'name', name, callback);
};

updateCardDescription(cardId, description, callback) {
    return this.updateCard(cardId, 'desc', description, callback);
};

updateCardList(cardId, listId, callback) {
    return this.updateCard(cardId, 'idList', listId, callback);
};

getMember(memberId, callback) {
    return this.makeRequest(GET, this.uri + '/1/member/' + memberId, {query: this.createQuery()}, callback);
}

getBoardMembers(boardId, callback) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/members', {query: this.createQuery()}, callback);
};

getOrgMembers(organizationId, callback) {
    return this.makeRequest(GET, this.uri + '/1/organizations/' + organizationId + '/members', {query: this.createQuery()}, callback);
};

getListsOnBoard(boardId) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/lists', {});
};

getListsOnBoardByFilter(boardId, filter, callback) {
    var query = this.createQuery();
    query.filter = filter;
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

getCardsOnBoard(boardId, callback) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/cards', {query: this.createQuery()}, callback);
};

getCardsOnList(listId, callback) {
    return this.makeRequest(GET, this.uri + '/1/lists/' + listId + '/cards', {query: this.createQuery()}, callback);
};

deleteCard(cardId, callback) {
    return this.makeRequest(DELETE, this.uri + '/1/cards/' + cardId, {query: this.createQuery()}, callback);
};

addWebhook(description, callbackUrl, idModel, callback) {
    var query = this.createQuery();
    var data = {};

    data.description = description;
    data.callbackURL = callbackUrl;
    data.idModel = idModel;

    return this.makeRequest(POST, this.uri + '/1/tokens/' + this.token + '/webhooks/', { data: data, query: query }, callback);
};

deleteWebhook(webHookId, callback) {
    var query = this.createQuery();

    return this.makeRequest(DELETE, this.uri + '/1/webhooks/' + webHookId, { query: query }, callback);
};

getLabelsForBoard(boardId, callback) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/labels', {query:this.createQuery()}, callback);
};

addLabelOnBoard(boardId, name, color, callback) {
    var query = this.createQuery();
    var data = {
        idBoard: boardId,
        color: color,
        name: name
    };

    return this.makeRequest(POST, this.uri + '/1/labels', {data: data, query:query}, callback);
};

deleteLabel(labelId, callback) {
    return this.makeRequest(DELETE, this.uri + '/1/labels/' + labelId, {query: this.createQuery()}, callback);
};

addLabelToCard(cardId, labelId, callback) {
    var query = this.createQuery();
    var data = { value: labelId };
    return this.makeRequest(POST, this.uri+'/1/cards/' + cardId + '/idLabels', {query:query, data:data}, callback);
};

deleteLabelFromCard(cardId, labelId, callback){
    return this.makeRequest(DELETE, this.uri + '/1/cards/' + cardId + '/idLabels/'+labelId, {query: this.createQuery()}, callback);
};

updateLabel(labelId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return this.makeRequest(PUT, this.uri + '/1/labels/' + labelId + '/' + field, {query: query}, callback);
};

updateLabelName(labelId, name, callback) {
    return this.updateLabel(labelId, 'name', name, callback);
};

updateLabelColor(labelId, color, callback) {
    return this.upadateLabel(labelId, 'color', color, callback);
};

getCardStickers (cardId, callback) {
    return this.makeRequest(GET, this.uri + '/1/cards/' + cardId + '/stickers', {query: this.createQuery()}, callback);
};

addStickerToCard(cardId, image, left, top, zIndex, rotate, callback) {
    var query = this.createQuery();
    var data = {
      image: image,
      top: top,
      left: left,
      zIndex: zIndex,
      rotate: rotate,
    };
    return this.makeRequest(POST, this.uri+'/1/cards/' + cardId + '/stickers', {query:query, data:data}, callback);
};
}

module.exports = Trello;
