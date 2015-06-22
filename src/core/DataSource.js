/**
 This Source Code is licensed under the MIT license. If a copy of the
 MIT-license was not distributed with this file, You can obtain one at:
 http://opensource.org/licenses/mit-license.html.

 @author: Tom Clement (tjclement)
 @license MIT
 @copyright Bizboard, 2015

 */

'use strict';

export class DataSource {

    /** @param {String} path **/
    constructor(path) {
        this._dataReference = null;
    }

    /**
     * Indicate that the DataSource can be inherited when instantiating a list of models. By
     * default we indicate false, which should trigger data model instantiation to create unique
     * DataSource references to each model either in array or direct.
     * @returns {boolean}
     */
    get inheritable() { return false; }

    /**
     * Returns a datasource reference to the given child branch of the current datasouce.
     * @param {String} childName
     */
    child(childName) { }

    /**
     * Returns the full URL to the path on the datasource.
     */
    path() { }

    /**
     * Returns the name of the current branch in the path on the datasource.
     */
    key() { }

    /**
     * Writes newData to the path this dataSource was constructed with.
     * @param {Object} newData
     */
    set(newData) { }

    /**
     * Removes the object and all underlying children that this dataSource points to.
     */
    remove() { }

    /**
     * Writes newData to the path this dataSource was constructed with, appended by a random UID generated by
     * the dataSource.
     * @param {Object} newData
     */
    push(newData) { }

    /**
     * Writes newData with given priority (ordering) to the path this dataSource was constructed with.
     * @param {Object} newData
     * @param {String|Number} priority
     */
    setWithPriority(newData, priority) { }

    /**
     * Sets the priority (ordering) of an object on a given dataSource.
     * @param {String|Number} newPriority
     */
    setPriority(newPriority) { }

    /**
     * Returns a new dataSource reference that will limit the subscription to only the first given amount items.
     * @param {Number} amount Amount of items to limit the dataSource to.
     */
    limitToFirst(amount) { }

    /**
     * Returns a new dataSource reference that will limit the subscription to only the last given amount items.
     * @param {Number} amount Amount of items to limit the dataSource to.
     */
    limitToLast(amount) { }

    /**
     * Authenticates all instances of this DataSource with the given OAuth provider and credentials.
     * @param {String} provider google, facebook, github, or twitter
     * @param {String|Object} credentials Access token string, or object with key/value pairs with e.g. OAuth 1.1 credentials.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     */
    authWithOAuthToken(provider, credentials, onComplete, options) { }

    /**
     * Authenticates all instances of this DataSource with a custom auth token or secret.
     * @param {String} authToken Authentication token or secret.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     */
    authWithCustomToken(authToken, onComplete, options) { }

    /**
     * Authenticates all instances of this DataSource with the given email/password credentials.
     * @param {String|Object} credentials Object with key/value pairs {email: "value", password:"value"}.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     */
    authWithPassword(credentials, onComplete, options) { }

    /**
     * Fetches the current user's authentication state.
     * If the user is authenticated, returns an object containing at least the fields uid, provider, auth, and expires.
     * If the user is not authenticated, returns null.
     */
    getAuth() { }

    /**
     * Logs out from the datasource, allowing to re-authenticate at a later time.
     */
    unauth() { }

    /** Sets the callback triggered when dataSource updates the data.
     *  @param {Function} callback **/
    setValueChangedCallback(callback){ }

    /** Removes the callback set to trigger when dataSource updates the data. **/
    removeValueChangedCallback() { }

    /** Set the callback triggered when dataSource adds a data element.
     * @param {Function} callback **/
    setChildAddedCallback(callback) { }

    /** Removes the callback set to trigger when dataSource adds a data element. **/
    removeChildAddedCallback() { }

    /** Set the callback triggered when dataSource changes a data element.
     * @param {Function} callback **/
    setChildChangedCallback(callback) { }

    /** Removes the callback set to trigger when dataSource changes a data element. **/
    removeChildChangedCallback() { }

    /** Set the callback triggered when dataSource moves a data element.
     * @param {Function} callback **/
    setChildMovedCallback(callback) { }

    /** Removes the callback set to trigger when dataSource moves a data element. **/
    removeChildMovedCallback() { }

    /** Set the callback triggered when dataSource adds a data element.
     * @param {Function} callback **/
    setChildRemovedCallback(callback) { }

    /** Removes the callback set to trigger when dataSource adds a data element. **/
    removeChildRemovedCallback() { }

}