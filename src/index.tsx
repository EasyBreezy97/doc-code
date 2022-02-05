import * as esbuild from "esbuild-wasm";
import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

const App = () => {
    const [input, setInput] = useState("");
    const [code, setCode] = useState("");
    const ref = useRef<any>();

    useEffect(() => {
        startService();
    }, []);

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: "/esbuild.wasm",
        });
    };

    const onClick = async () => {
        if (!ref.current) {
            return;
        }

        const result = await ref.current.transform(input, {
            loader: "jsx",
            target: "es2015",
        });

        setCode(result.code);
    };
    return (
        <div>
            <textarea
                rows={10}
                cols={100}
                placeholder="Write some js code..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <div>
                <button onClick={onClick}>Transpile</button>
            </div>
            {code && (
                <>
                    <h1>ES2015</h1>
                    <pre>{code}</pre>
                </>
            )}
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector("#root"));
