'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

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

                case POST:
                    if (opts) {
                        query = _extends({}, query, opts);
                    }
                    body = new _formData2.default();
                    Object.entries(query).forEach(function (entry) {
                        body.append(entry[0], entry[1]);
                    });
                    uri = resourceUri;
                    break;
                default:
                    break;
            }
            return (0, _isomorphicFetch2.default)(uri, {
                method: method,
                body: body
            }).then(function (res) {
                return res.json();
            });
        }
    }, {
        key: 'getMyBoards',
        value: function getMyBoards() {
            return this.makeRequest(GET, this.uri + '/1/member/me/boards', {});
        }
    }, {
        key: 'addBoard',
        value: function addBoard(name, description, organizationId) {
            var query = {};
            query.name = name;

            if (description !== null) query.desc = description;
            if (organizationId !== null) query.idOrganization = organizationId;

            return this.makeRequest(POST, this.uri + '/1/boards', query);
        }
    }, {
        key: 'addCard',
        value: function addCard(name, description, listId) {
            var query = {};
            query.name = name;
            query.idList = listId;

            if (description !== null) query.desc = description;

            return this.makeRequest(POST, this.uri + '/1/cards', query);
        }
    }, {
        key: 'getCard',
        value: function getCard(boardId, cardId) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/cards/' + cardId, {});
        }
    }, {
        key: 'getCardsForList',
        value: function getCardsForList(listId, actions) {
            var query = {};
            if (actions) query.actions = actions;
            return this.makeRequest(GET, this.uri + '/1/lists/' + listId + '/cards', query);
        }
    }, {
        key: 'renameList',
        value: function renameList(listId, name) {
            return this.makeRequest(PUT, this.uri + '/1/lists/' + listId + '/name', { name: name });
        }
    }, {
        key: 'addListToBoard',
        value: function addListToBoard(boardId, name) {
            var query = {};
            query.name = name;

            return this.makeRequest(POST, this.uri + '/1/boards/' + boardId + '/lists', { query: query });
        }
    }, {
        key: 'addCommentToCard',
        value: function addCommentToCard(cardId, comment) {
            var query = {};
            query.text = comment;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/actions/comments', { query: query });
        }
    }, {
        key: 'addAttachmentToCard',
        value: function addAttachmentToCard(cardId, url) {
            var query = {};
            query.url = url;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/attachments', { query: query });
        }
    }, {
        key: 'addMemberToCard',
        value: function addMemberToCard(cardId, memberId) {
            var query = {};
            query.value = memberId;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/members', { query: query });
        }
    }, {
        key: 'getBoards',
        value: function getBoards(memberId) {
            return this.makeRequest(GET, this.uri + '/1/members/' + memberId + '/boards', { query: this.createQuery() });
        }
    }, {
        key: 'addChecklistToCard',
        value: function addChecklistToCard(cardId, name) {
            var query = {};
            query.name = name;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/checklists', { query: query });
        }
    }, {
        key: 'addExistingChecklistToCard',
        value: function addExistingChecklistToCard(cardId, checklistId) {
            var query = {};
            query.idChecklistSource = checklistId;

            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/checklists', { query: query });
        }
    }, {
        key: 'getChecklistsOnCard',
        value: function getChecklistsOnCard(cardId) {
            return this.makeRequest(GET, this.uri + '/1/cards/' + cardId + '/checklists', { query: this.createQuery() });
        }
    }, {
        key: 'addItemToChecklist',
        value: function addItemToChecklist(checkListId, name, pos) {
            var query = {};
            query.name = name;
            query.pos = pos;

            return this.makeRequest(POST, this.uri + '/1/checklists/' + checkListId + '/checkitems', { query: query });
        }
    }, {
        key: 'updateCard',
        value: function updateCard(cardId, field, value) {
            var query = {};
            query.value = value;

            return this.makeRequest(PUT, this.uri + '/1/cards/' + cardId + '/' + field, { query: query });
        }
    }, {
        key: 'updateChecklist',
        value: function updateChecklist(checklistId, field, value) {
            var query = {};
            query.value = value;

            return this.makeRequest(PUT, this.uri + '/1/checklists/' + checklistId + '/' + field, { query: query });
        }
    }, {
        key: 'updateCardName',
        value: function updateCardName(cardId, name) {
            return this.updateCard(cardId, 'name', name);
        }
    }, {
        key: 'updateCardDescription',
        value: function updateCardDescription(cardId, description) {
            return this.updateCard(cardId, 'desc', description);
        }
    }, {
        key: 'updateCardList',
        value: function updateCardList(cardId, listId) {
            return this.updateCard(cardId, 'idList', listId);
        }
    }, {
        key: 'getMember',
        value: function getMember(memberId) {
            return this.makeRequest(GET, this.uri + '/1/member/' + memberId, { query: this.createQuery() });
        }
    }, {
        key: 'getBoardMembers',
        value: function getBoardMembers(boardId) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/members', { query: this.createQuery() });
        }
    }, {
        key: 'getOrgMembers',
        value: function getOrgMembers(organizationId) {
            return this.makeRequest(GET, this.uri + '/1/organizations/' + organizationId + '/members', { query: this.createQuery() });
        }
    }, {
        key: 'getListsOnBoard',
        value: function getListsOnBoard(boardId) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/lists', {});
        }
    }, {
        key: 'getListsOnBoardByFilter',
        value: function getListsOnBoardByFilter(boardId, filter) {
            var query = {};
            query.filter = filter;
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/lists', { query: query });
        }
    }, {
        key: 'getCardsOnBoard',
        value: function getCardsOnBoard(boardId) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/cards', { query: this.createQuery() });
        }
    }, {
        key: 'getCardsOnList',
        value: function getCardsOnList(listId) {
            return this.makeRequest(GET, this.uri + '/1/lists/' + listId + '/cards', { query: this.createQuery() });
        }
    }, {
        key: 'deleteCard',
        value: function deleteCard(cardId) {
            return this.makeRequest(DELETE, this.uri + '/1/cards/' + cardId, { query: this.createQuery() });
        }
    }, {
        key: 'addWebhook',
        value: function addWebhook(description, callbackUrl, idModel) {
            var query = {};
            var data = {};

            data.description = description;
            data.callbackURL = callbackUrl;
            data.idModel = idModel;

            return this.makeRequest(POST, this.uri + '/1/tokens/' + this.token + '/webhooks/', { data: data, query: query });
        }
    }, {
        key: 'deleteWebhook',
        value: function deleteWebhook(webHookId) {
            var query = {};

            return this.makeRequest(DELETE, this.uri + '/1/webhooks/' + webHookId, { query: query });
        }
    }, {
        key: 'getLabelsForBoard',
        value: function getLabelsForBoard(boardId) {
            return this.makeRequest(GET, this.uri + '/1/boards/' + boardId + '/labels', { query: this.createQuery() });
        }
    }, {
        key: 'addLabelOnBoard',
        value: function addLabelOnBoard(boardId, name, color) {
            var query = {};
            var data = {
                idBoard: boardId,
                color: color,
                name: name
            };

            return this.makeRequest(POST, this.uri + '/1/labels', { data: data, query: query });
        }
    }, {
        key: 'deleteLabel',
        value: function deleteLabel(labelId) {
            return this.makeRequest(DELETE, this.uri + '/1/labels/' + labelId, { query: this.createQuery() });
        }
    }, {
        key: 'addLabelToCard',
        value: function addLabelToCard(cardId, labelId) {
            var query = {};
            var data = { value: labelId };
            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/idLabels', { query: query, data: data });
        }
    }, {
        key: 'deleteLabelFromCard',
        value: function deleteLabelFromCard(cardId, labelId) {
            return this.makeRequest(DELETE, this.uri + '/1/cards/' + cardId + '/idLabels/' + labelId, { query: this.createQuery() });
        }
    }, {
        key: 'updateLabel',
        value: function updateLabel(labelId, field, value) {
            var query = {};
            query.value = value;

            return this.makeRequest(PUT, this.uri + '/1/labels/' + labelId + '/' + field, { query: query });
        }
    }, {
        key: 'updateLabelName',
        value: function updateLabelName(labelId, name) {
            return this.updateLabel(labelId, 'name', name);
        }
    }, {
        key: 'updateLabelColor',
        value: function updateLabelColor(labelId, color) {
            return this.upadateLabel(labelId, 'color', color);
        }
    }, {
        key: 'getCardStickers',
        value: function getCardStickers(cardId) {
            return this.makeRequest(GET, this.uri + '/1/cards/' + cardId + '/stickers', { query: this.createQuery() });
        }
    }, {
        key: 'addStickerToCard',
        value: function addStickerToCard(cardId, image, left, top, zIndex, rotate) {
            var query = {};
            var data = {
                image: image,
                top: top,
                left: left,
                zIndex: zIndex,
                rotate: rotate
            };
            return this.makeRequest(POST, this.uri + '/1/cards/' + cardId + '/stickers', { query: query, data: data });
        }
    }]);

    return Trello;
}();

module.exports = Trello;