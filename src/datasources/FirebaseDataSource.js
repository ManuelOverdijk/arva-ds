/**
 This Source Code is licensed under the MIT license. If a copy of the
 MIT-license was not distributed with this file, You can obtain one at:
 http://opensource.org/licenses/mit-license.html.

 @author: Tom Clement (tjclement)
 @license MIT
 @copyright Bizboard, 2015

 */
import {ObjectHelper}               from 'arva-utils/ObjectHelper';
import {DataSource}                 from '../core/DataSource';
import Firebase                     from 'firebase';
import {Provide, annotate}          from 'di';

export class FirebaseDataSource extends DataSource {

    get dataReference() {
        return this._dataReference;
    }

    set dataReference(value) {
        this._dataReference = value
    }

    /** @param {String} path **/
    constructor(path, options = { orderBy: '.priority'}) {
        super(path);
        this._onValueCallback = null;
        this._onAddCallback = null;
        this._onChangeCallback = null;
        this._onMoveCallback = null;
        this._onRemoveCallback = null;
        this._dataReference = new Firebase(path);
        this.options = options;

        /* Bind all local methods to the current object instance, so we can refer to "this"
         * in the methods as expected, even when they're called from event handlers.        */
        ObjectHelper.bindAllMethods(this, this);
    }


    /**
     * Returns a datasource reference to the given child branch of the current datasource.
     * @param {String} childName
     */
    child(childName, options = null) {
        if (options)
            return new FirebaseDataSource(this._dataReference.child(childName).toString(), options);
        else return new FirebaseDataSource(this._dataReference.child(childName).toString());
    }

    /**
     * Returns the full URL to the path on the datasource.
     */
    path() {
        return this._dataReference.toString();
    }

    /**
     * Returns the name of the current branch in the path on the datasource.
     */
    key() {
        return this._dataReference.key();
    }

    /**
     * Writes newData to the path this dataSource was constructed with.
     * @param {Object} newData
     */
    set(newData) {
        return this._dataReference.set(newData);
    }

    /**
     * Removes the object and all underlying children that this dataSource points to.
     */
    remove() {
        return this._dataReference.remove();
    }

    /**
     * Writes newData to the path this dataSource was constructed with, appended by a random UID generated by
     * the dataSource.
     * @param {Object} newData
     */
    push(newData) {
        return new FirebaseDataSource(this._dataReference.push(newData).toString());
    }

    /**
    * Writes newData with given priority (ordering) to the path this dataSource was constructed with.
    * @param {Object} newData
    * @param {String|Number} priority
    */
    setWithPriority(newData, priority) {
        return this._dataReference.setWithPriority(newData, priority);
    }

    /**
     * Sets the priority (ordering) of an object on a given dataSource.
     * @param {String|Number} newPriority
     */
    setPriority(newPriority) {
        return this._dataReference.setPriority(newPriority);
    }

    /**
     * Returns a new dataSource reference that will limit the subscription to only the first given amount items.
     * @param {Number} amount Amount of items to limit the dataSource to.
     */
    limitToFirst(amount) {
        return this._dataReference.limitToFirst(amount);
    }

    /**
     * Returns a new dataSource reference that will limit the subscription to only the last given amount items.
     * @param {Number} amount Amount of items to limit the dataSource to.
     */
    limitToLast(amount) {
        return this._dataReference.limitToLast(amount);
    }

    /**
     * Authenticates all instances of this DataSource with the given OAuth provider and credentials.
     * @param {String} provider google, facebook, github, or twitter
     * @param {String|Object} credentials Access token string, or object with key/value pairs with e.g. OAuth 1.1 credentials.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     */
    authWithOAuthToken(provider, credentials, onComplete, options) {
        return this._dataReference.authWithOAuthToken(provider, credentials, onComplete, options);
    }

    /**
     * Authenticates all instances of this DataSource with a custom Firebase auth token or secret.
     * @param {String} authToken Firebase authentication token or secret.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     */
    authWithCustomToken(authToken, onComplete, options) {
        return this._dataReference.authWithCustomToken(authToken, onComplete, options);
    }

    /**
     * Authenticates all instances of this DataSource with the given email/password credentials.
     * @param {String|Object} credentials Object with key/value pairs {email: "value", password:"value"}.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     */
    authWithPassword(credentials, onComplete, options) {
        return this._dataReference.authWithPassword(credentials, onComplete, options);
    }

    /**
     * Fetches the current user's authentication state.
     * If the user is authenticated, returns an object containing at least the fields uid, provider, auth, and expires.
     * If the user is not authenticated, returns null.
     */
    getAuth() {
        return this._dataReference.getAuth();
    }

    /**
     * Logs out from the datasource, allowing to re-authenticate at a later time.
     */
    unauth() {
        return this._dataReference.unauth();
    }

    /** Set the callback triggered when dataSource updates the data.
     * @param {Function} callback **/
    setValueChangedCallback(callback) {
        this._onValueCallback = callback;
        this._dataReference.on('value', this._onValueCallback);
    }

    /** Removes the callback set to trigger when dataSource updates the data. **/
    removeValueChangedCallback() {
        if(this._onValueCallback) {
            this._dataReference.off('value', this._onValueCallback);
            this._onValueCallback = null;
        }
    }

    /** Set the callback triggered when dataSource adds a data element.
     * @param {Function} callback **/
    setChildAddedCallback(callback) {
        this._onAddCallback = callback;
        let wrapper = (newChildSnapshot, prevChildName) => {
            this._onAddCallback(newChildSnapshot, prevChildName);
        };

        if (this.options.orderBy && this.options.orderBy == '.priority') {
            this._dataReference.orderByPriority().on('child_added', wrapper.bind(this));
        }
        else if (this.options.orderBy && this.options.orderBy == '.value') {
            this._dataReference.orderByValue().on('child_added', wrapper.bind(this));
        }
        else if (this.options.orderBy && this.options.orderBy != '') {
            this._dataReference.orderByChild(this.options.orderBy).on('child_added', wrapper.bind(this));
        }
        else {
            this._dataReference.on('child_added', wrapper.bind(this));
        }
    }

    /** Removes the callback set to trigger when dataSource adds a data element. **/
    removeChildAddedCallback() {
        if(this._onAddCallback) {
            this._dataReference.off('child_added', this._onAddCallback);
            this._onAddCallback = null;
        }
    }

    /** Set the callback triggered when dataSource changes a data element.
     * @param {Function} callback **/
    setChildChangedCallback(callback) {
        this._onChangeCallback = callback;
        let wrapper = (newChildSnapshot, prevChildName) => {
            this._onChangeCallback(newChildSnapshot, prevChildName);
        };

        if (this.options.orderBy && this.options.orderBy == '.priority') {
            this._dataReference.orderByPriority().on('child_changed', wrapper.bind(this));
        }
        else if (this.options.orderBy && this.options.orderBy == '.value') {
            this._dataReference.orderByValue().on('child_changed', wrapper.bind(this));
        }
        else if (this.options.orderBy && this.options.orderBy != '') {
            this._dataReference.orderByChild(this.options.orderBy).on('child_changed', wrapper.bind(this));
        }
        else {
            this._dataReference.on('child_changed', wrapper.bind(this));
        }
    }

    /** Removes the callback set to trigger when dataSource changes a data element. **/
    removeChildChangedCallback() {
        if(this._onChangeCallback) {
            this._dataReference.off('child_changed', this._onChangeCallback);
            this._onChangeCallback = null;
        }
    }

    /** Set the callback triggered when dataSource moves a data element.
     * @param {Function} callback **/
    setChildMovedCallback(callback) {
        this._onMoveCallback = callback;
        this._dataReference.on('child_moved', (newChildSnapshot, prevChildName) => {
            this._onMoveCallback(newChildSnapshot, prevChildName);
        });
    }

    /** Removes the callback set to trigger when dataSource moves a data element. **/
    removeChildMovedCallback() {
        if(this._onMoveCallback) {
            this._dataReference.off('child_moved', this._onMoveCallback);
            this._onMoveCallback = null;
        }
    }

    /** Set the callback triggered when dataSource removes a data element.
     * @param {Function} callback **/
    setChildRemovedCallback(callback) {
        this._onRemoveCallback = callback;
        this._dataReference.on('child_removed', this._onRemoveCallback);
    }

    /** Removes the callback set to trigger when dataSource removes a data element. **/
    removeChildRemovedCallback() {
        if(this._onRemoveCallback) {
            this._dataReference.off('child_removed', this._onRemoveCallback);
            this._onRemoveCallback = null;
        }
    }
}

annotate(FirebaseDataSource, new Provide(DataSource));