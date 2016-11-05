'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE';

var Trello = function () {
    function Trello(key, token) {
        _classCallCheck(this, Trello);

        this.uri = "https://api.trello.com";
        this.key = key;
        this.token = token;
    }

    _createClass(Trello, [{
        key: 'createQuery',
        value: function createQuery() {
            return { key: this.key, token: this.token };
        }
    }, {
        key: 'makeRequest',
        value: function makeRequest(method, resourceUri, opts) {
            var body = void 0,
                uri = void 0,
                query = this.createQuery(),
                queryString = '';
            switch (method) {
                case GET:
                    if (opts) {
                        query = _extends({}, query, opts);
                    }
                    Object.keys(query).forEach(function (key, index, arr) {
                        queryString += key + '=' + encodeURIComponent(query[key]);
                        if (index < arr.length - 1) {
                            queryString += '&';
                        }
                    });
                    uri = resourceUri + '?' + queryString;

                    break;
                default:
                    break;
            }
            return (0, _isomorphicFetch2.default)(uri, {
                method: method,
                body: body
            }).then(function (res) {
                return res.json();
            }).then(function (response) {
                return console.log(response);
            });
        }
    }, {
        key: 'getMyBoards',
        value: function getMyBoards() {
            return this.makeRequest(GET, this.uri + '/1/member/me/boards', {});
        }
    }, {
        key: 'addBoard',
        value: function addBoard(name, description, organizationId, callback) {
            var query = this.createQuery();
            query.name = name;

            if (description !== null) query.desc = description;
            if (organizationId !== null) query.idOrganization = organizationId;

            return this.makeRequest(POST, this.uri + '/1/boards', { query: query }, callback);
        }
    }, {
        key: 'addCard',
        value: function addCard(name, description, listId, callback) {
            var query = this.createQuery();
            query.name = name;
            query.idList = listId;

            if (description !== null) query.desc = description;

            return this.makeRequest(POST, this.uri + '/1/cards', { query: query }, callback);
        }
    }, {
        key: 'getCard',
        value: function getCard(boardId, cardId, callback) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/cards/' + cardId, { query: this.createQuery() }, callback);
        }
    }, {
        key: 'getCardsForList',
        value: function getCardsForList(listId, actions, callback) {
            var query = this.createQuery();
            if (actions) query.actions = actions;
            return this.makeRequest(GET, this.uri + '/1/lists/' + listId + '/cards', { query: query }, callback);
        }
    }, {
        key: 'renameList',
        value: function renameList(listId, name, callback) {
            var query = this.createQuery();
            query.name = name;

            return this.makeRequest(PUT, this.uri + '/1/lists/' + listId + '/name', { query: query }, callback);
        }
    }, {
        key: 'addListToBoard',
        value: function addListToBoard(boardId, name, callback) {
            var query = this.createQuery();
            query.name = name;

            return this.makeRequest(POST, this.uri + '/1/boards/' + boardId + '/lists', { query: query }, callback);
        }
    }, {
        key: 'addCommentToCard',
        value: function addCommentToCard(cardId, comment, callback) {
            var query = this.createQuery();
            query.text = comment;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/actions/comments', { query: query }, callback);
        }
    }, {
        key: 'addAttachmentToCard',
        value: function addAttachmentToCard(cardId, url, callback) {
            var query = this.createQuery();
            query.url = url;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/attachments', { query: query }, callback);
        }
    }, {
        key: 'addMemberToCard',
        value: function addMemberToCard(cardId, memberId, callback) {
            var query = this.createQuery();
            query.value = memberId;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/members', { query: query }, callback);
        }
    }, {
        key: 'getBoards',
        value: function getBoards(memberId, callback) {
            return this.makeRequest(GET, this.uri + '/1/members/' + memberId + '/boards', { query: this.createQuery() }, callback);
        }
    }, {
        key: 'addChecklistToCard',
        value: function addChecklistToCard(cardId, name, callback) {
            var query = this.createQuery();
            query.name = name;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
        }
    }, {
        key: 'addExistingChecklistToCard',
        value: function addExistingChecklistToCard(cardId, checklistId, callback) {
            var query = this.createQuery();
            query.idChecklistSource = checklistId;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
        }
    }, {
        key: 'getChecklistsOnCard',
        value: function getChecklistsOnCard(cardId, callback) {
            return this.makeRequest(GET, this.uri + '/1/cards/' + cardId + '/checklists', { query: this.createQuery() }, callback);
        }
    }, {
        key: 'addItemToChecklist',
        value: function addItemToChecklist(checkListId, name, pos, callback) {
            var query = this.createQuery();
            query.name = name;
            query.pos = pos;

            return this.makeRequest(POST, this.uri + '/1/checklists/' + checkListId + '/checkitems', { query: query }, callback);
        }
    }, {
        key: 'updateCard',
        value: function updateCard(cardId, field, value, callback) {
            var query = this.createQuery();
            query.value = value;

            return this.makeRequest(PUT, this.uri + '/1/cards/' + cardId + '/' + field, { query: query }, callback);
        }
    }, {
        key: 'updateChecklist',
        value: function updateChecklist(checklistId, field, value, callback) {
            var query = this.createQuery();
            query.value = value;

            return this.makeRequest(PUT, this.uri + '/1/checklists/' + checklistId + '/' + field, { query: query }, callback);
        }
    }, {
        key: 'updateCardName',
        value: function updateCardName(cardId, name, callback) {
            return this.updateCard(cardId, 'name', name, callback);
        }
    }, {
        key: 'updateCardDescription',
        value: function updateCardDescription(cardId, description, callback) {
            return this.updateCard(cardId, 'desc', description, callback);
        }
    }, {
        key: 'updateCardList',
        value: function updateCardList(cardId, listId, callback) {
            return this.updateCard(cardId, 'idList', listId, callback);
        }
    }, {
        key: 'getMember',
        value: function getMember(memberId, callback) {
            return this.makeRequest(GET, this.uri + '/1/member/' + memberId, { query: this.createQuery() }, callback);
        }
    }, {
        key: 'getBoardMembers',
        value: function getBoardMembers(boardId, callback) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/members', { query: this.createQuery() }, callback);
        }
    }, {
        key: 'getOrgMembers',
        value: function getOrgMembers(organizationId, callback) {
            return this.makeRequest(GET, this.uri + '/1/organizations/' + organizationId + '/members', { query: this.createQuery() }, callback);
        }
    }, {
        key: 'getListsOnBoard',
        value: function getListsOnBoard(boardId) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/lists', {});
        }
    }, {
        key: 'getListsOnBoardByFilter',
        value: function getListsOnBoardByFilter(boardId, filter, callback) {
            var query = this.createQuery();
            query.filter = filter;
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/lists', { query: query }, callback);
        }
    }, {
        key: 'getCardsOnBoard',
        value: function getCardsOnBoard(boardId, callback) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/cards', { query: this.createQuery() }, callback);
        }
    }, {
        key: 'getCardsOnList',
        value: function getCardsOnList(listId, callback) {
            return this.makeRequest(GET, this.uri + '/1/lists/' + listId + '/cards', { query: this.createQuery() }, callback);
        }
    }, {
        key: 'deleteCard',
        value: function deleteCard(cardId, callback) {
            return this.makeRequest(DELETE, this.uri + '/1/cards/' + cardId, { query: this.createQuery() }, callback);
        }
    }, {
        key: 'addWebhook',
        value: function addWebhook(description, callbackUrl, idModel, callback) {
            var query = this.createQuery();
            var data = {};

            data.description = description;
            data.callbackURL = callbackUrl;
            data.idModel = idModel;

            return this.makeRequest(POST, this.uri + '/1/tokens/' + this.token + '/webhooks/', { data: data, query: query }, callback);
        }
    }, {
        key: 'deleteWebhook',
        value: function deleteWebhook(webHookId, callback) {
            var query = this.createQuery();

            return this.makeRequest(DELETE, this.uri + '/1/webhooks/' + webHookId, { query: query }, callback);
        }
    }, {
        key: 'getLabelsForBoard',
        value: function getLabelsForBoard(boardId, callback) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/labels', { query: this.createQuery() }, callback);
        }
    }, {
        key: 'addLabelOnBoard',
        value: function addLabelOnBoard(boardId, name, color, callback) {
            var query = this.createQuery();
            var data = {
                idBoard: boardId,
                color: color,
                name: name
            };

            return this.makeRequest(POST, this.uri + '/1/labels', { data: data, query: query }, callback);
        }
    }, {
        key: 'deleteLabel',
        value: function deleteLabel(labelId, callback) {
            return this.makeRequest(DELETE, this.uri + '/1/labels/' + labelId, { query: this.createQuery() }, callback);
        }
    }, {
        key: 'addLabelToCard',
        value: function addLabelToCard(cardId, labelId, callback) {
            var query = this.createQuery();
            var data = { value: labelId };
            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/idLabels', { query: query, data: data }, callback);
        }
    }, {
        key: 'deleteLabelFromCard',
        value: function deleteLabelFromCard(cardId, labelId, callback) {
            return this.makeRequest(DELETE, this.uri + '/1/cards/' + cardId + '/idLabels/' + labelId, { query: this.createQuery() }, callback);
        }
    }, {
        key: 'updateLabel',
        value: function updateLabel(labelId, field, value, callback) {
            var query = this.createQuery();
            query.value = value;

            return this.makeRequest(PUT, this.uri + '/1/labels/' + labelId + '/' + field, { query: query }, callback);
        }
    }, {
        key: 'updateLabelName',
        value: function updateLabelName(labelId, name, callback) {
            return this.updateLabel(labelId, 'name', name, callback);
        }
    }, {
        key: 'updateLabelColor',
        value: function updateLabelColor(labelId, color, callback) {
            return this.upadateLabel(labelId, 'color', color, callback);
        }
    }, {
        key: 'getCardStickers',
        value: function getCardStickers(cardId, callback) {
            return this.makeRequest(GET, this.uri + '/1/cards/' + cardId + '/stickers', { query: this.createQuery() }, callback);
        }
    }, {
        key: 'addStickerToCard',
        value: function addStickerToCard(cardId, image, left, top, zIndex, rotate, callback) {
            var query = this.createQuery();
            var data = {
                image: image,
                top: top,
                left: left,
                zIndex: zIndex,
                rotate: rotate
            };
            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/stickers', { query: query, data: data }, callback);
        }
    }]);

    return Trello;
}();

module.exports = Trello;