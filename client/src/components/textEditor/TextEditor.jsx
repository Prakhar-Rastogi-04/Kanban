import { useEffect, useRef, useState } from 'react';
import './textEditor.css';
import JoditEditor from 'jodit-react';

export default function TextEditor ({setDescription, description}) {
    const editor = useRef('');
    const [content, setContent] = useState('');
    const handleEditorBlur = (newContent) => {
        setContent(newContent);
        setDescription(content);
        console.log('content  ',content)
    }
    useEffect(() => {
        setContent(description) 
    },[])
return (
    <JoditEditor
            className='display-block'
			ref={editor}
			value={content}
			tabIndex={1} // tabIndex of textarea
			onBlur={newContent => handleEditorBlur(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={newContent => {}}
		/>
)
}