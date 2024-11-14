import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
	ClassicEditor,
	Plugin,
	AccessibilityHelp,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BalloonToolbar,
	Base64UploadAdapter,
	BlockQuote,
	Bold,
	Code,
	CodeBlock,
	Essentials,
	FindAndReplace,
	Heading,
	Highlight,
	HorizontalLine,
	HtmlEmbed,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	Markdown,
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	SelectAll,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Table,
	TableCellProperties,
	TableProperties,
	TableToolbar,
	TextTransformation,
	TodoList,
	Underline,
	Undo
} from 'ckeditor5';
import { Comments, RevisionHistory, TrackChanges, TrackChangesData } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import './App.css';

/**
 * Please update the following values with your actual tokens.
 * Instructions on how to obtain them: https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html
 */
const LICENSE_KEY = 'NlJqV3B3ZjNNa3pyNXZCS0pjWVBCNkFNUm95aHE2bkpDYkE0amw1eUtRMi9QOVhZcXZicFdjNGpvQmVBVFE9PS1NakF5TkRFeU1EUT0=';

/**
 * The `UsersIntegration` lets you manage user data and permissions.
 *
 * This is an essential feature when many users work on the same document.
 *
 * To read more about it, visit the CKEditor 5 documentation: https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/users.html.
 */
class UsersIntegration extends Plugin {
	static get requires() {
		return ['Users'];
	}

	static get pluginName() {
		return 'UsersIntegration';
	}

	init() {
        const usersPlugin = this.editor.plugins.get( 'Users' );

        // Load the users data.
        for ( const user of appData.users ) {
            usersPlugin.addUser( user );
        }

        // Set the current user.
        usersPlugin.defineMe( appData.userId );
    }
}

/**
 * The `CommentsIntegration` lets you synchronize comments in the document with your data source (e.g. a database).
 *
 * To read more about it, visit the CKEditor 5 documentation: https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-integration.html.
 */
class CommentsIntegration extends Plugin {
    static get requires() {
        return [ 'CommentsRepository', 'UsersIntegration' ];
    }

    static get pluginName() {
        return 'CommentsIntegration';
    }

    init() {
        const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' );

        // Set the adapter on the `CommentsRepository#adapter` property.
        commentsRepositoryPlugin.adapter = {
            addComment( data ) {
                console.log( 'Comment added', data );

                // Write a request to your database here. The returned `Promise`
                // should be resolved when the request has finished.
                // When the promise resolves with the comment data object, it
                // will update the editor comment using the provided data.
                return Promise.resolve( {
                    createdAt: new Date()       // Should be set on the server side.
                } );
            },

            updateComment( data ) {
                console.log( 'Comment updated', data );

                // Write a request to your database here. The returned `Promise`
                // should be resolved when the request has finished.
                return Promise.resolve();
            },

            removeComment( data ) {
                console.log( 'Comment removed', data );

                // Write a request to your database here. The returned `Promise`
                // should be resolved when the request has finished.
                return Promise.resolve();
            },

            addCommentThread( data ) {
                console.log( 'Comment thread added', data );

                // Write a request to your database here. The returned `Promise`
                // should be resolved when the request has finished.
                return Promise.resolve( {
                    threadId: data.threadId,
                    comments: data.comments.map( ( comment ) => ( { commentId: comment.commentId, createdAt: new Date() } ) ) // Should be set on the server side.
                } );
            },

            getCommentThread( data ) {
                console.log( 'Getting comment thread', data );

                // Write a request to your database here. The returned `Promise`
                // should resolve with the comment thread data.
                return Promise.resolve( {
                    threadId: data.threadId,
                    comments: [
                        {
                            commentId: 'comment-1',
                            authorId: 'user-2',
                            content: '<p>Are we sure we want to use a made-up disorder name?</p>',
                            createdAt: new Date(),
                            attributes: {}
                        }
                    ],
                    // It defines the value on which the comment has been created initially.
                    // If it is empty it will be set based on the comment marker.
                    context: {
                        type: 'text',
                        value: 'Bilingual Personality Disorder'
                    },
                    unlinkedAt: null,
                    resolvedAt: null,
                    resolvedBy: null,
                    attributes: {},
                    isFromAdapter: true
                } );
            },

            updateCommentThread( data ) {
                console.log( 'Comment thread updated', data );

                // Write a request to your database here. The returned `Promise`
                // should be resolved when the request has finished.
                return Promise.resolve();
            },

            resolveCommentThread( data ) {
                console.log( 'Comment thread resolved', data );

                // Write a request to your database here. The returned `Promise`
                // should be resolved when the request has finished.
                return Promise.resolve( {
                    resolvedAt: new Date(), // Should be set on the server side.
                    resolvedBy: usersPlugin.me.id // Should be set on the server side.
                } );
            },

            reopenCommentThread( data ) {
                console.log( 'Comment thread reopened', data );

                // Write a request to your database here. The returned `Promise`
                // should be resolved when the request has finished.
                return Promise.resolve();
            },

            removeCommentThread( data ) {
                console.log( 'Comment thread removed', data );

                // Write a request to your database here. The returned `Promise`
                // should be resolved when the request has finished.
                return Promise.resolve();
            }

        };
    }
}
/**
 * The `TrackChangesIntegration` lets you synchronize suggestions added to the document with your data source (e.g. a database).
 *
 * To read more about it, visit the CKEditor 5 documentation: https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html.
 */
class TrackChangesIntegration extends Plugin {
    static get requires() {
        return [ 'TrackChanges', 'UsersIntegration' ];
    }

    static get pluginName() {
        return 'TrackChangesIntegration';
    }

    init() {
        const trackChangesPlugin = this.editor.plugins.get( 'TrackChanges' );

        // Set the adapter to the `TrackChanges#adapter` property.
        trackChangesPlugin.adapter = {
            getSuggestion: suggestionId => {
                console.log( 'Getting suggestion', suggestionId );

                // Write a request to your database here.
                // The returned `Promise` should be resolved with the suggestion
                // data object when the request has finished.
                switch ( suggestionId ) {
                    case 'suggestion-1':
                        return Promise.resolve( {
                            id: suggestionId,
                            type: 'insertion',
                            authorId: 'user-2',
                            createdAt: new Date(),
                            data: null,
                            attributes: {}
                        } );
                    case 'suggestion-2':
                        return Promise.resolve( {
                            id: suggestionId,
                            type: 'deletion',
                            authorId: 'user-1',
                            createdAt: new Date(),
                            data: null,
                            attributes: {}
                        } );
                    case 'suggestion-3':
                        return Promise.resolve( {
                            id: 'suggestion-3',
                            type: 'attribute:bold|ci1tcnk0lkep',
                            authorId: 'user-1',
                            createdAt: new Date( 2019, 2, 8, 10, 2, 7 ),
                            data: {
                                key: 'bold',
                                oldValue: null,
                                newValue: true
                            },
                            attributes: {
                                groupId: 'e29adbb2f3963e522da4d2be03bc5345f'
                            }
                        } );
                }
            },

            addSuggestion: suggestionData => {
                console.log( 'Suggestion added', suggestionData );

                // Write a request to your database here.
                // The returned `Promise` should be resolved when the request
                // has finished. When the promise resolves with the suggestion data
                // object, it will update the editor suggestion using the provided data.
                return Promise.resolve( {
                    createdAt: new Date()       // Should be set on the server side.
                } );
            },

            updateSuggestion: ( id, suggestionData ) => {
                console.log( 'Suggestion updated', id, suggestionData );

                // Write a request to your database here.
                // The returned `Promise` should be resolved when the request
                // has finished.
                return Promise.resolve();
            }
        };

        // In order to load comments added to suggestions, you
        // should also integrate the comments adapter.
    }
}

/**
 * The `RevisionHistoryIntegration` lets you synchronize named revisions in the document with your data source (e.g. a database).
 *
 * To read more about it, visit the CKEditor 5 documentation: https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/revision-history/revision-history-integration.html.
 */
// A plugin that introduces the adapter.
class RevisionHistoryIntegration extends Plugin {
    static get pluginName() {
        return 'RevisionHistoryIntegration';
    }

    static get requires() {
        return [ 'RevisionHistory' ];
    }

    async init() {
        const revisionHistory = this.editor.plugins.get( 'RevisionHistory' );

        revisionHistory.adapter = {
            getRevision: ( { revisionId } ) => {
                return this._findRevision( revisionId );
            },
            updateRevisions: revisionsData => {
                const documentData = this.editor.getData();

                // This should be an asynchronous request to your database
                // that saves `revisionsData` and `documentData`.
                //
                // The document data should be saved each time a revision is saved.
                //
                // `revisionsData` is an array with objects,
                // where each object contains updated and new revisions.
                //
                // See the API reference for `RevisionHistoryAdapter` to learn
                // how to correctly integrate the feature with your application.
                //
                return Promise.resolve();
            }
        };

        // Add the revisions data for existing revisions.
        const revisionsData = await this._fetchRevisionsData();

        for ( const revisionData of revisionsData ) {
            revisionHistory.addRevisionData( revisionData );
        }
    }

    async _findRevision( revisionId ) {
        // Get the revision data based on its ID.
        // This should be an asynchronous request to your database.
        return Promise.resolve( revisions.find( revision => revision.id === revisionId ) );
    }

    async _fetchRevisionsData() {
        // Get a list of all revisions.
        // This should be an asynchronous call to your database.
        //
        // Note that the revision list should not contain the `diffData` property.
        // The `diffData` property may be big and will be fetched on demand by `adapter.getRevision()`.
        return Promise.resolve(revisions.map(revision => ({ ...revision, diffData: undefined })));
    }
}

// Create a new plugin that will handle the autosave logic.
class RevisionHistoryAutosaveIntegration extends Plugin {
    init() {
        this._saveAfter = 10; // Create a new revision after 100 saves.
        this._autosaveCount = 1; // Current autosave counter.
        this._lastCreatedAt = null; // Revision `createdAt` value, when the revision was last autosaved.
    }

    async autosave() {
        const revisionTracker = this.editor.plugins.get( 'RevisionTracker' );
        const currentRevision = revisionTracker.currentRevision;

        if ( currentRevision.createdAt > this._lastCreatedAt ) {
            // Revision was saved or updated in the meantime by a different source (not autosave).
            // Reset the counter.
            this._autosaveCount = 1;
        }

        if ( this._autosaveCount === this._saveAfter ) {
            // We reached the count. Save all changes as a new revision. Reset the counter.
            await revisionTracker.saveRevision();

            this._autosaveCount = 1;
            this._lastCreatedAt = currentRevision.createdAt;
        } else {
            // Try updating the "current revision" with the new document changes.
            // If there are any new changes, the `createdAt` property will change its value.
            // Do not raise the counter, if the revision has not been updated!
            await revisionTracker.update();

            if ( currentRevision.createdAt > this._lastCreatedAt ) {
                this._autosaveCount++;
                this._lastCreatedAt = currentRevision.createdAt;
            }
        }

        return true;
    }
}

// Revisions data will be available under a global variable `revisions`.
const revisions = [
    {
        "id": "initial",
        "name": "Initial revision",
        "creatorId": "user-1",
        "authorsIds": [ "user-1" ],
        "diffData": {
            "main": {
                "insertions": '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ………… by and between The Lower Shelf, the “Publisher”, and …………, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him/herself and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A."]}]',
                "deletions": '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ………… by and between The Lower Shelf, the “Publisher”, and …………, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him/herself and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A."]}]'
            }
        },
        "createdAt": "2024-05-27T13:22:59.077Z",
        "attributes": {},
        "fromVersion": 1,
        "toVersion": 1
    },
    {
        "id": "e6f80e6be6ee6057fd5a449ab13fba25d",
        "name": "Updated with the actual data",
        "creatorId": "user-1",
        "authorsIds": [ "user-1" ],
        "diffData": {
            "main": {
                "insertions": '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ",{"name":"revision-start","attributes":[["name","insertion:user-1:0"]],"children":[]},"1st",{"name":"revision-end","attributes":[["name","insertion:user-1:0"]],"children":[]}," ",{"name":"revision-start","attributes":[["name","insertion:user-1:1"]],"children":[]},"June 2020 ",{"name":"revision-end","attributes":[["name","insertion:user-1:1"]],"children":[]},"by and between The Lower Shelf, the “Publisher”, and ",{"name":"revision-start","attributes":[["name","insertion:user-1:2"]],"children":[]},"John Smith",{"name":"revision-end","attributes":[["name","insertion:user-1:2"]],"children":[]},", the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
                "deletions": '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ",{"name":"revision-start","attributes":[["name","deletion:user-1:0"]],"children":[]},"…………",{"name":"revision-end","attributes":[["name","deletion:user-1:0"]],"children":[]}," by and between The Lower Shelf, the “Publisher”, and ",{"name":"revision-start","attributes":[["name","deletion:user-1:1"]],"children":[]},"…………",{"name":"revision-end","attributes":[["name","deletion:user-1:1"]],"children":[]},", the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him",{"name":"revision-start","attributes":[["name","deletion:user-1:2"]],"children":[]},"/herself",{"name":"revision-end","attributes":[["name","deletion:user-1:2"]],"children":[]}," and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature.",{"name":"revision-start","attributes":[["name","deletion:user-1:3"]],"children":[]}]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A.",{"name":"revision-end","attributes":[["name","deletion:user-1:3"]],"children":[]}]}]'
            }
        },
        "createdAt": "2024-05-27T13:23:52.553Z",
        "attributes": {},
        "fromVersion": 1,
        "toVersion": 20
    },
    {
        "id": "e6590c50ccbc86acacb7d27231ad32064",
        "name": "Inserted logo",
        "creatorId": "user-1",
        "authorsIds": [ "user-1" ],
        "diffData": {
            "main": {
                "insertions": '[{"name":"figure","attributes":[["data-revision-start-before","insertion:user-1:0"],["class","image"]],"children":[{"name":"img","attributes":[["src","https://ckeditor.com/docs/ckeditor5/latest/assets/img/revision-history-demo.png"]],"children":[]}]},{"name":"h1","attributes":[],"children":[{"name":"revision-end","attributes":[["name","insertion:user-1:0"]],"children":[]},"PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1st June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
                "deletions": '[{"name":"h1","attributes":[["data-revision-start-before","deletion:user-1:0"]],"children":[{"name":"revision-end","attributes":[["name","deletion:user-1:0"]],"children":[]},"PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1st June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]'
            }
        },
        "createdAt": "2024-05-27T13:26:39.252Z",
        "attributes": {},
        "fromVersion": 20,
        "toVersion": 24
    },
    // An empty current revision.
    {
        "id": "egh91t5jccbi894cacxx7dz7t36aj3k021",
        "name": null,
        "creatorId": null,
        "authorsIds": [],
        "diffData": {
            "main": {
                "insertions": '[{"name":"figure","attributes":[["class","image"]],"children":[{"name":"img","attributes":[["src","https://ckeditor.com/docs/ckeditor5/latest/assets/img/revision-history-demo.png"]],"children":[]}]},{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1st June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
                "deletions": '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1st June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]'
            }
        },
        "createdAt": "2024-05-27T13:26:39.252Z",
        "attributes": {},
        "fromVersion": 24,
        "toVersion": 24
    }
];


// Application data will be available under a global variable `appData`.
const appData = {
    // Users data.
    users: [
        {
            id: 'user-1',
            name: 'Mex Haddox'
        },
        {
            id: 'user-2',
            name: 'Zee Croce'
        }
    ],

    // The ID of the current user.
    userId: 'user-1',

    // Comment threads data.
    commentThreads: [
        {
            threadId: 'thread-1',
            comments: [
                {
                    commentId: 'comment-1',
                    authorId: 'user-1',
                    content: '<p>Are we sure we want to use a made-up disorder name?</p>',
                    createdAt: new Date( '09/20/2018 14:21:53' ),
                    attributes: {}
                },
                {
                    commentId: 'comment-2',
                    authorId: 'user-2',
                    content: '<p>Why not?</p>',
                    createdAt: new Date( '09/21/2018 08:17:01' ),
                    attributes: {}
                }
            ],
            context: {
                type: 'text',
                value: 'Bilingual Personality Disorder'
            },
            unlinkedAt: null,
            resolvedAt: null,
            resolvedBy: null,
            attributes: {}
        }
    ],

    // Editor initial data.
    initialData:
        `<h2>
            <comment-start name="thread-1"></comment-start>
            Bilingual Personality Disorder
            <comment-end name="thread-1"></comment-end>
        </h2>
        <p>
            This may be the first time you hear about this
            <suggestion-start name="insertion:suggestion-1:user-2"></suggestion-start>
            made-up<suggestion-end name="insertion:suggestion-1:user-2"></suggestion-end>
            disorder but it actually is not that far from the truth.
            As recent studies show, the language you speak has more effects on you than you realize.
            According to the studies, the language a person speaks affects their cognition,
            <suggestion-start name="deletion:suggestion-2:user-1"></suggestion-start>
            feelings, <suggestion-end name="deletion:suggestion-2:user-1"></suggestion-end>
            behavior, emotions and hence <strong>their personality</strong>.
        </p>
        <p>
            This shouldn’t come as a surprise
            <a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already know</a>
            that different regions of the brain become more active depending on the activity.
            The structure, information and especially
            <suggestion-start name="attribute:bold|ci1tcnk0lkep:suggestion-3:user-1"></suggestion-start><strong>the
            culture of languages<suggestion-end name="attribute:bold|ci1tcnk0lkep:suggestion-3:user-1"></strong></suggestion-end>
            varies substantially
            and the language a person speaks is an essential element of daily life.
        </p>`
};


export default function App() {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const editorAnnotationsRef = useRef(null);
	const editorRevisionHistoryRef = useRef(null);
	const editorRevisionHistoryEditorRef = useRef(null);
	const editorRevisionHistorySidebarRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const editorConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'revisionHistory',
				'trackChanges',
				'comment',
				'|',
				'heading',
				'|',
				'bold',
				'italic',
				'underline',
				'|',
				'link',
				'insertImage',
				'insertTable',
				'highlight',
				'blockQuote',
				'codeBlock',
				'|',
				'bulletedList',
				'numberedList',
				'todoList',
				'outdent',
				'indent'
			],
			shouldNotGroupWhenFull: false
		},
		plugins: [
			AccessibilityHelp,
			Autoformat,
			AutoImage,
			AutoLink,
			Autosave,
			BalloonToolbar,
			Base64UploadAdapter,
			BlockQuote,
			Bold,
			Code,
			CodeBlock,
			Comments,
			Essentials,
			FindAndReplace,
			Heading,
			Highlight,
			HorizontalLine,
			HtmlEmbed,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsert,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			ImageUpload,
			Indent,
			IndentBlock,
			Italic,
			Link,
			LinkImage,
			List,
			ListProperties,
			Markdown,
			MediaEmbed,
			Mention,
			Paragraph,
			PasteFromOffice,
			RevisionHistory,
			SelectAll,
			SpecialCharacters,
			SpecialCharactersArrows,
			SpecialCharactersCurrency,
			SpecialCharactersEssentials,
			SpecialCharactersLatin,
			SpecialCharactersMathematical,
			SpecialCharactersText,
			Strikethrough,
			Table,
			TableCellProperties,
			TableProperties,
			TableToolbar,
			TextTransformation,
			TodoList,
			TrackChanges,
			TrackChangesData,
			Underline,
			Undo
		],
		extraPlugins: [UsersIntegration, CommentsIntegration, TrackChangesIntegration, RevisionHistoryIntegration, RevisionHistoryAutosaveIntegration],
		autosave: {
            save: editor => {
                return editor.plugins.get( RevisionHistoryAutosaveIntegration ).autosave();
            }
        },
		balloonToolbar: ['comment', '|', 'bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
		comments: {
			editorConfig: {
				extraPlugins: [Autoformat, Bold, Italic, List, Mention],
				mention: {
					feeds: [
						{
							marker: '@',
							feed: [
								/* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#comments-with-mentions */
							]
						}
					]
				}
			}
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		image: {
			toolbar: [
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'resizeImage'
			]
		},
		initialData: appData.initialData,
		licenseKey: LICENSE_KEY,
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		},
		mention: {
			feeds: [
				{
					marker: '@',
					feed: [
						/* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
					]
				}
			]
		},
		menuBar: {
			isVisible: true
		},
		placeholder: 'Type or paste your content here!',
		revisionHistory: {
			editorContainer: editorContainerRef.current,
			viewerContainer: editorRevisionHistoryRef.current,
			viewerEditorElement: editorRevisionHistoryEditorRef.current,
			viewerSidebarContainer: editorRevisionHistorySidebarRef.current,
			resumeUnsavedRevision: true
		},
		sidebar: {
			container: editorAnnotationsRef.current
		},
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		}
	};

	configUpdateAlert(editorConfig);

	return (
		<div>
			<div className="main-container">
				<div className="editor-container editor-container_classic-editor editor-container_include-annotations" ref={editorContainerRef}>
					<div className="editor-container__editor-wrapper">
						<div className="editor-container__editor">
							<div ref={editorRef}>{isLayoutReady && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
						</div>
						<div className="editor-container__sidebar">
							<div ref={editorAnnotationsRef}></div>
						</div>
					</div>
				</div>
				<div className="revision-history" ref={editorRevisionHistoryRef}>
					<div className="revision-history__wrapper">
						<div className="revision-history__editor" ref={editorRevisionHistoryEditorRef}></div>
						<div className="revision-history__sidebar" ref={editorRevisionHistorySidebarRef}></div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert(config) {
	if (configUpdateAlert.configUpdateAlertShown) {
		return;
	}

	const isModifiedByUser = (currentValue, forbiddenValue) => {
		if (currentValue === forbiddenValue) {
			return false;
		}

		if (currentValue === undefined) {
			return false;
		}

		return true;
	};

	const valuesToUpdate = [];

	configUpdateAlert.configUpdateAlertShown = true;

	if (!isModifiedByUser(config.licenseKey, '<YOUR_LICENSE_KEY>')) {
		valuesToUpdate.push('LICENSE_KEY');
	}

	if (valuesToUpdate.length) {
		window.alert(
			[
				'Please update the following values in your editor config',
				'in order to receive full access to the Premium Features:',
				'',
				...valuesToUpdate.map(value => ` - ${value}`)
			].join('\n')
		);
	}
}
