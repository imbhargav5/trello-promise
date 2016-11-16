import fetch from 'isomorphic-fetch';
import FormData from 'form-data';

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
  makeRequest(method, resourceUri , opts={}) {
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

          case POST:
            if(opts){
              query = {
                ...query,
                ...opts
              };
            }
            body = new FormData();
            Object.entries(query).forEach(entry=>{
              body.append(entry[0],entry[1]);
            });
            uri = resourceUri;
            break;
          default :
            break;
       }
       return fetch(uri,{
          method,
          body
       }).then(res=>res.json());
  }

  getMyBoards(){
    return this.makeRequest(GET,this.uri + '/1/member/me/boards',{});
  }
  addBoard(name, description, organizationId) {
      var query = {};
      query.name = name;

      if (description !== null)
          query.desc = description;
      if (organizationId !== null)
          query.idOrganization = organizationId;

      return this.makeRequest(POST, this.uri + '/1/boards', query);
  };

addCard(name, description, listId) {
    const query = {};
    query.name = name;
    query.idList = listId;

    if (description !== null)
        query.desc = description;

    return this.makeRequest(POST, this.uri + '/1/cards', query);
};

getCard(boardId, cardId) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/cards/' + cardId, {});
}

getCardsForList(listId, actions) {
    var query = {};
    if (actions)
        query.actions = actions;
    return this.makeRequest(GET, this.uri + '/1/lists/' + listId + '/cards', query);
};

renameList(listId, name) {
    return this.makeRequest(PUT, this.uri + '/1/lists/' + listId + '/name', {name});
};

addListToBoard (boardId, name) {
    const query = {};
    query.name = name;

    return this.makeRequest(POST, this.uri + '/1/boards/' + boardId + '/lists', query);
};

addCommentToCard(cardId, comment) {
  const query = {};
    query.text = comment;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/actions/comments', query);
};

addAttachmentToCard(cardId, url) {
    const query = {};
    query.url = url;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/attachments', query);
};

addMemberToCard(cardId, memberId) {
    const query = {};
    query.value = memberId;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/members', query);
};

getBoards(memberId) {
    return this.makeRequest(GET, this.uri + '/1/members/' + memberId + '/boards');
};

addChecklistToCard (cardId, name) {
    const query = {};
    query.name = name;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/checklists', query);
};

addExistingChecklistToCard (cardId, checklistId) {
    const query = {};
    query.idChecklistSource = checklistId;

    return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/checklists', query);
};

getChecklistsOnCard(cardId) {
    return this.makeRequest(GET, this.uri + '/1/cards/' + cardId + '/checklists');
};

addItemToChecklist (checkListId, name, pos) {
    const query = {};
    query.name = name;
    query.pos = pos;

    return this.makeRequest(POST, this.uri + '/1/checklists/' + checkListId + '/checkitems', query);
};

updateCard (cardId, field, value) {
    const query = {};
    query.value = value;

    return this.makeRequest(PUT, this.uri + '/1/cards/' + cardId + '/' + field, query);
};

updateChecklist(checklistId, field, value) {
    const query = {};
    query.value = value;

    return this.makeRequest(PUT, this.uri + '/1/checklists/' + checklistId + '/' + field, query);
};

updateCardName(cardId, name) {
    return this.updateCard(cardId, 'name', name);
};

updateCardDescription(cardId, description) {
    return this.updateCard(cardId, 'desc', description);
};

updateCardList(cardId, listId) {
    return this.updateCard(cardId, 'idList', listId);
};

getMember(memberId) {
    return this.makeRequest(GET, this.uri + '/1/member/' + memberId);
}

getBoardMembers(boardId) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/members');
};

getOrgMembers(organizationId) {
    return this.makeRequest(GET, this.uri + '/1/organizations/' + organizationId + '/members');
};

getListsOnBoard(boardId) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/lists');
};

getListsOnBoardByFilter(boardId, filter) {
    const query = {};
    query.filter = filter;
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/lists', query);
};

getCardsOnBoard(boardId) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/cards');
};

getCardsOnList(listId) {
    return this.makeRequest(GET, this.uri + '/1/lists/' + listId + '/cards');
};

deleteCard(cardId) {
    return this.makeRequest(DELETE, this.uri + '/1/cards/' + cardId);
};

addWebhook(description, callbackUrl, idModel) {
    var data = {};

    data.description = description;
    data.callbackURL = callbackUrl;
    data.idModel = idModel;

    return this.makeRequest(POST, this.uri + '/1/tokens/' + this.token + '/webhooks/',data);
};

deleteWebhook(webHookId) {
    return this.makeRequest(DELETE, this.uri + '/1/webhooks/' + webHookId);
};

getLabelsForBoard(boardId) {
    return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/labels');
};

addLabelOnBoard(boardId, name, color) {
    var data = {
        idBoard: boardId,
        color: color,
        name: name
    };

    return this.makeRequest(POST, this.uri + '/1/labels', data);
};

deleteLabel(labelId) {
    return this.makeRequest(DELETE, this.uri + '/1/labels/' + labelId);
};

addLabelToCard(cardId, labelId) {
    var data = { value: labelId };
    return this.makeRequest(POST, this.uri+'/1/cards/' + cardId + '/idLabels', data);
};

deleteLabelFromCard(cardId, labelId){
    return this.makeRequest(DELETE, this.uri + '/1/cards/' + cardId + '/idLabels/'+labelId);
};

updateLabel(labelId, field, value) {
    const query = {};
    query.value = value;

    return this.makeRequest(PUT, this.uri + '/1/labels/' + labelId + '/' + field, query);
};

updateLabelName(labelId, name) {
    return this.updateLabel(labelId, 'name', name);
};

updateLabelColor(labelId, color) {
    return this.upadateLabel(labelId, 'color', color);
};

getCardStickers (cardId) {
    return this.makeRequest(GET, this.uri + '/1/cards/' + cardId + '/stickers');
};

addStickerToCard(cardId, image, left, top, zIndex, rotate) {
    var data = {
      image: image,
      top: top,
      left: left,
      zIndex: zIndex,
      rotate: rotate,
    };
    return this.makeRequest(POST, this.uri+'/1/cards/' + cardId + '/stickers', data);
};
}

module.exports = Trello;
