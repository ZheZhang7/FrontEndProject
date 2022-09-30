import React, { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

export default function NewsEditor(props) {

    useEffect(() => {
        const html = props.content
        // 如果html本文内容为空,则不渲染

        if (html === undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
        // 每次props.content改变的时候就会重新执行一遍
    }, [props.content]);

    // html ---> draft



    const [editorState, setEditorState] = useState("")

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                // 受控组件
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                    // draft ---> html
                    props.getContent(
                        draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    );
                }}
            />

        </div>
    )
}
