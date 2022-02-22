import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";

interface CodeEditorProps {
    initialValue: string;
    onChnage(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChnage, initialValue }) => {
    const editorRef = useRef<any>();

    const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
        editorRef.current = monacoEditor;
        monacoEditor.onDidChangeModelContent(() => {
            onChnage(getValue());
        });

        monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
    };

    const onFormatClick = () => {
        console.log(editorRef);

        const unformatted = editorRef.current.getModel().getValue();

        const formated = prettier.format(unformatted, {
            parser: "babel",
            plugins: [parser],
            useTabs: false,
            semi: true,
        });

        editorRef.current.setValue(formated);
    };

    return (
        <div>
            <button onClick={onFormatClick}>Format</button>
            <MonacoEditor
                editorDidMount={onEditorDidMount}
                // onChnage={onChnage}
                value={initialValue} //it's only a initial value
                theme="dark"
                language="javascript"
                height="500px"
                options={{
                    wordWrap: "on",
                    minimap: { enabled: false },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;