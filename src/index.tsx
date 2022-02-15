import * as esbuild from "esbuild-wasm";
import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import CodeEditor from "./components/code-editor";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App = () => {
    const [input, setInput] = useState("");
    const ref = useRef<any>();
    const iframe = useRef<any>();

    useEffect(() => {
        startService();
    }, []);

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
        });
    };

    const onClick = async () => {
        if (!ref.current) {
            return;
        }

        iframe.current.srcdoc = html;

        const result = await ref.current.build({
            entryPoints: ["index.js"],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(input)],
            define: {
                "process.env.NODE_ENV": "'production'",
                global: "window",
            },
        });

        // setCode(result.outputFiles[0].text);
        iframe.current.contentWindow.postMessage(
            result.outputFiles[0].text,
            "*",
        );
    };
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
    return (
        <div>
            <CodeEditor
                onChnage={(value) => setInput(value)}
                initialValue="const a = 2"
            />
            <textarea
                rows={10}
                cols={100}
                placeholder="Write some js code..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <iframe
                ref={iframe}
                sandbox="allow-scripts"
                title="code-preview"
                srcDoc={html}
            />
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector("#root"));
