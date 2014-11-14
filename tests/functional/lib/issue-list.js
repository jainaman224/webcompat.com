/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require'
], function (intern, registerSuite, assert, require) {
  'use strict';

  var url = intern.config.siteRoot + '/issues';

  registerSuite({
    name: 'issue-list',

    'FilterView renders': function () {
      return this.remote
        .setFindTimeout(intern.config.wc.pageLoadTimeout)
        .get(require.toUrl(url))
        .findByCssSelector('h2').getVisibleText()
        .then(function (text) {
          assert.include(text, 'Issues', 'Page header displayed');
        })
        .end()
        .findAllByCssSelector('button.wc-Filter')
        .then(function (elms) {
          assert.equal(elms.length, 5, 'All filter buttons are displayed');
        })
        .end();
    },

    'IssueListView renders': function() {
      return this.remote
        .setFindTimeout(intern.config.wc.pageLoadTimeout)
        .get(require.toUrl(url))
        .findByCssSelector('.js-issue-list').isDisplayed()
        .then(function (isDisplayed) {
          assert.equal(isDisplayed, true, 'IssueList container is visible.');
        })
        .sleep(1000)
        .end()
        .findByCssSelector('.js-issue-list .IssueItem').isDisplayed()
        .then(function (isDisplayed) {
          assert.equal(isDisplayed, true, 'IssueList item is visible.');
        })
        .end()
        .findByCssSelector('.IssueItem .IssueItem-header').getVisibleText()
        .then(function(text){
          assert.match(text, /^Issue\s\d+:\s.+$/, 'Issue should have a non-empty title');
        })
        .end()
        .findByCssSelector('.IssueItem:nth-child(1) > div:nth-child(1) > p:nth-child(2)').getVisibleText()
        .then(function (text) {
          assert.match(text, /comments:\s\d+$/i, 'Issue should display number of comments');
          assert.match(text, /^Opened:\s\d{4}\-\d{2}\-\d{2}.+/, 'Issue should display creation date');
        })
        .end()
    },

    'PaginationControlsView tests': function() {
      return this.remote
        .setFindTimeout(intern.config.wc.pageLoadTimeout)
        .get(require.toUrl(url))
        .findByCssSelector('.js-pagination-controls').isDisplayed()
        .then(function (isDisplayed) {
          assert.equal(isDisplayed, true, 'IssueList container is visible.');
        })
        .sleep(1000)
        .end()
        .findByCssSelector('.js-pagination-previous').getAttribute('class')
        .then(function (className) {
          assert.include(className, 'is-disabled', 'First page load should have disabled prev button');
        })
        .end()
        .findByCssSelector('.js-pagination-next').click()
        .sleep(500)
        .end()
        .findByCssSelector('.js-pagination-previous').getAttribute('class')
        .then(function (className) {
          assert.notInclude(className, 'is-disabled', 'Clicking next enables prev button');
        })
        .end()
        .findByCssSelector('.js-pagination-previous').click()
        .sleep(500)
        .end()
        .findByCssSelector('.js-pagination-previous').getAttribute('class')
        .then(function (className) {
          assert.include(className, 'is-disabled', 'Going back from first next click should have disabled prev button');
        })
        .end()
    }
  });
});
