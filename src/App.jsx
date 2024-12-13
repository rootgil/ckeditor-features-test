import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	ClassicEditor,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	CKBox,
	CKBoxImageEdit,
	CloudServices,
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
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	PictureEditing,
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
} from 'ckeditor5';
import {
	CaseChange,
	Comments,
	DocumentOutline,
	ExportPdf,
	ExportWord,
	ImportWord,
	PasteFromOfficeEnhanced,
	PresenceList,
	RealTimeCollaborativeComments,
	RealTimeCollaborativeEditing,
	RealTimeCollaborativeRevisionHistory,
	RealTimeCollaborativeTrackChanges,
	RevisionHistory,
	SlashCommand,
	TableOfContents,
	Template,
	TrackChanges,
	TrackChangesData
} from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import './App.css';

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzQ5OTgzOTksImp0aSI6ImUyOGRjYzg3LTA4MDItNGRkZC1iYzk2LWY3OGE1N2I5ZjQ4NyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjU4MThlOGQ2In0.y6HvUyN1r6nlMwtDwRT-mW65ii7KCLtULXK2t70WohnI7ESB7ns08iqt1LP1FdciNBgm_LMu1l7c0lVhB_bD9Q';

/**
 * Unique ID that will be used to identify this document. E.g. you may use ID taken from your database.
 * Read more: https://ckeditor.com/docs/ckeditor5/latest/api/module_collaboration-core_config-RealTimeCollaborationConfig.html
 */
const DOCUMENT_ID = '3';

const CLOUD_SERVICES_TOKEN_URL =
	'https://lux4wwpdwr7o.cke-cs.com/token/dev/6b095f72194ef900ee5210b2553c36deff1baf0e6720d7fb790d20fd2469?limit=10';
const CLOUD_SERVICES_WEBSOCKET_URL = 'wss://lux4wwpdwr7o.cke-cs.com/ws';

export default function App() {
	const editorPresenceRef = useRef(null);
	const editorContainerRef = useRef(null);
	const editorOutlineRef = useRef(null);
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


	const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: [
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
					Autoformat,
					AutoImage,
					AutoLink,
					Autosave,
					BlockQuote,
					Bold,
					// CaseChange,
					CKBox,
					CKBoxImageEdit,
					CloudServices,
					Code,
					CodeBlock,
					Comments,
					// DocumentOutline,
					Essentials,
					ExportPdf,
					ExportWord,
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
					ImportWord,
					Indent,
					IndentBlock,
					Italic,
					Link,
					LinkImage,
					List,
					ListProperties,
					MediaEmbed,
					Mention,
					Paragraph,
					// PasteFromOffice,
					// PasteFromOfficeEnhanced,
					PictureEditing,
					PresenceList,
					RealTimeCollaborativeComments,
					RealTimeCollaborativeEditing,
					RealTimeCollaborativeRevisionHistory,
					RealTimeCollaborativeTrackChanges,
					RevisionHistory,
					// SlashCommand,
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
					// TableOfContents,
					TableProperties,
					TableToolbar,
					// Template,
					TextTransformation,
					TodoList,
					TrackChanges,
					TrackChangesData,
					Underline
				],
				cloudServices: {
					tokenUrl: () => {
                      return  Promise.resolve("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJGdng4NEpnZTlyZ0FBVFh5aG4zOSIsInN1YiI6InVzZXItMDEiLCJ1c2VyIjp7ImVtYWlsIjoiZ2lsbGVzQGdtYWlsLmNvbSIsIm5hbWUiOiJHaWxsZXMgQUgifSwiYXV0aCI6eyJjb2xsYWJvcmF0aW9uIjp7IioiOnsicm9sZSI6IndyaXRlciJ9fSwiY2tib3giOnsicm9sZSI6InVzZXIifX0sImlhdCI6MTczMzk5MTQ3MCwiZXhwIjoxNzY1NTQ5MDcwfQ.XwuaOXZDHub4lBw4HksbmDVByA-V8FpTB52oU0_Vae8")
                    },
					webSocketUrl: CLOUD_SERVICES_WEBSOCKET_URL
				},
				collaboration: {
					channelId: DOCUMENT_ID
				},
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
				documentOutline: {
					container: editorOutlineRef.current
				},
				exportPdf: {
					stylesheets: [
						/* This path should point to application stylesheets. */
						/* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-pdf.html */
						'./App.css',
						/* Export PDF needs access to stylesheets that style the content. */
						'https://cdn.ckeditor.com/ckeditor5/44.0.0/ckeditor5.css',
						'https://cdn.ckeditor.com/ckeditor5-premium-features/44.0.0/ckeditor5-premium-features.css'
					],
					fileName: 'export-pdf-demo.pdf',
					converterOptions: {
						format: 'Tabloid',
						margin_top: '20mm',
						margin_bottom: '20mm',
						margin_right: '24mm',
						margin_left: '24mm',
						page_orientation: 'portrait'
					}
				},
				exportWord: {
					stylesheets: [
						/* This path should point to application stylesheets. */
						/* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-word.html */
						'./App.css',
						/* Export Word needs access to stylesheets that style the content. */
						'https://cdn.ckeditor.com/ckeditor5/44.0.0/ckeditor5.css',
						'https://cdn.ckeditor.com/ckeditor5-premium-features/44.0.0/ckeditor5-premium-features.css'
					],
					fileName: 'export-word-demo.docx',
					converterOptions: {
						document: {
							orientation: 'portrait',
							size: 'Tabloid',
							margins: {
								top: '20mm',
								bottom: '20mm',
								right: '24mm',
								left: '24mm'
							}
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
						'resizeImage',
						'|',
						'ckboxImageEdit'
					]
				},
				initialData:
					"",
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
				presenceList: {
					container: editorPresenceRef.current
				},
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
				},
				template: {
					definitions: [
						{
							title: 'Introduction',
							description: 'Simple introduction to an article',
							icon: '<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <g id="icons/article-image-right">\n        <rect id="icon-bg" width="45" height="45" rx="2" fill="#A5E7EB"/>\n        <g id="page" filter="url(#filter0_d_1_507)">\n            <path d="M9 41H36V12L28 5H9V41Z" fill="white"/>\n            <path d="M35.25 12.3403V40.25H9.75V5.75H27.7182L35.25 12.3403Z" stroke="#333333" stroke-width="1.5"/>\n        </g>\n        <g id="image">\n            <path id="Rectangle 22" d="M21.5 23C21.5 22.1716 22.1716 21.5 23 21.5H31C31.8284 21.5 32.5 22.1716 32.5 23V29C32.5 29.8284 31.8284 30.5 31 30.5H23C22.1716 30.5 21.5 29.8284 21.5 29V23Z" fill="#B6E3FC" stroke="#333333"/>\n            <path id="Vector 1" d="M24.1184 27.8255C23.9404 27.7499 23.7347 27.7838 23.5904 27.9125L21.6673 29.6268C21.5124 29.7648 21.4589 29.9842 21.5328 30.178C21.6066 30.3719 21.7925 30.5 22 30.5H32C32.2761 30.5 32.5 30.2761 32.5 30V27.7143C32.5 27.5717 32.4391 27.4359 32.3327 27.3411L30.4096 25.6268C30.2125 25.451 29.9127 25.4589 29.7251 25.6448L26.5019 28.8372L24.1184 27.8255Z" fill="#44D500" stroke="#333333" stroke-linejoin="round"/>\n            <circle id="Ellipse 1" cx="26" cy="25" r="1.5" fill="#FFD12D" stroke="#333333"/>\n        </g>\n        <rect id="Rectangle 23" x="13" y="13" width="12" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 24" x="13" y="17" width="19" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 25" x="13" y="21" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 26" x="13" y="25" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 27" x="13" y="29" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 28" x="13" y="33" width="16" height="2" rx="1" fill="#B4B4B4"/>\n    </g>\n    <defs>\n        <filter id="filter0_d_1_507" x="9" y="5" width="28" height="37" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n            <feFlood flood-opacity="0" result="BackgroundImageFix"/>\n            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>\n            <feOffset dx="1" dy="1"/>\n            <feComposite in2="hardAlpha" operator="out"/>\n            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.29 0"/>\n            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_507"/>\n            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_507" result="shape"/>\n        </filter>\n    </defs>\n</svg>\n',
							data: "<h2>Introduction</h2><p>In today's fast-paced world, keeping up with the latest trends and insights is essential for both personal growth and professional development. This article aims to shed light on a topic that resonates with many, providing valuable information and actionable advice. Whether you're seeking to enhance your knowledge, improve your skills, or simply stay informed, our comprehensive analysis offers a deep dive into the subject matter, designed to empower and inspire our readers.</p>"
						}
					]
				}
			}
		};
	}, [isLayoutReady]);

	useEffect(() => {
		if (editorConfig) {
			configUpdateAlert(editorConfig);
		}
	}, [editorConfig]);

	return (
		<div className="main-container">
			<div className="presence" ref={editorPresenceRef}></div>
			<div
				className="editor-container editor-container_classic-editor editor-container_include-outline editor-container_include-annotations"
				ref={editorContainerRef}
			>
				<div className="editor-container__editor-wrapper">
					<div className="editor-container__sidebar">
						<div ref={editorOutlineRef}></div>
					</div>
					<div className="editor-container__editor">
						<div ref={editorRef}>{editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
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

	if (!isModifiedByUser(config.cloudServices?.tokenUrl, '<YOUR_CLOUD_SERVICES_TOKEN_URL>')) {
		valuesToUpdate.push('CLOUD_SERVICES_TOKEN_URL');
	}

	if (!isModifiedByUser(config.cloudServices?.webSocketUrl, '<YOUR_CLOUD_SERVICES_WEBSOCKET_URL>')) {
		valuesToUpdate.push('CLOUD_SERVICES_WEBSOCKET_URL');
	}

	if (valuesToUpdate.length) {
		window.alert(
			[
				'Please update the following values in your editor config',
				'to receive full access to Premium Features:',
				'',
				...valuesToUpdate.map(value => ` - ${value}`)
			].join('\n')
		);
	}
}
