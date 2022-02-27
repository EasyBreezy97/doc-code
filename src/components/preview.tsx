import React, { useEffect, useRef } from "react";
import "./preview.css";
interface PreviewProps {
    code: string;
}

const html = `
<html>
    <body>
        <div id="root">
            <script>
                window.addEventListener('message', event => {
                    try{
                        eval(event.data)

                    }catch(err){
                        const root = document.querySelector("#root")
                        root.innerHTML = '<div style="color:red;"><h4>Runtime Error: </h4>'+ err +'</div>'
                        console.error(err);
                    }
                },false)
            </script>
        </div>
    </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code }) => {
    const iframe = useRef<any>();

    useEffect(() => {
        iframe.current.srcdoc = html;
        iframe.current.contentWindow.postMessage(code, "*");
    }, [code]);

    return (
        <div className="preview-wrapper">
            <iframe
                ref={iframe}
                sandbox="allow-scripts"
                title="code-preview"
                // srcDoc={html}
            />
        </div>
    );
};

export default Preview;
