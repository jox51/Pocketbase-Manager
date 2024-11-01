import { useState, useEffect, useRef } from "react";
import TerminalAsciiArt from "./TerminalAsciiArt";

export default function Terminal({ instance, fullScreen = false }) {
    const [history, setHistory] = useState([]);
    const [currentCommand, setCurrentCommand] = useState("");
    const [currentDirectory, setCurrentDirectory] =
        useState("pb-manager-scripts");
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [terminalPrompt, setTerminalPrompt] = useState(
        `${instance.name}:${currentDirectory}$`
    );

    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        // Add ASCII art when component mounts
        setHistory(TerminalAsciiArt());
    }, []); // Empty dependency array means this runs once on mount

    const handleCommand = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const trimmedCommand = currentCommand.trim();

            // Save command to history
            if (trimmedCommand) {
                setCommandHistory((prev) => [...prev, trimmedCommand]);
                setHistoryIndex(-1);
            }

            setHistory((prev) => [
                ...prev,
                {
                    type: "input",
                    prompt: terminalPrompt,
                    content: currentCommand,
                },
            ]);

            try {
                const response = await fetch("/execute-command", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify({
                        instance: instance.name,
                        command: trimmedCommand,
                        currentDirectory,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to execute command");
                }

                const responseData = await response.json();

                if (responseData.status === "success") {
                    // Update current directory from backend response
                    if (responseData.currentDirectory) {
                        setCurrentDirectory(responseData.currentDirectory);
                    }

                    // Handle command output
                    if (trimmedCommand === "ls") {
                        // Your existing ls handling code...
                        const lsOutput = responseData.output
                            .map((item) => item.content)
                            .join(" ")
                            .split(" ")
                            .map((item) => {
                                if (item.endsWith(".sh"))
                                    return `<span class="text-yellow-500">${item}</span>`;
                                if (item.endsWith(".yml"))
                                    return `<span class="text-blue-400">${item}</span>`;
                                if (item.endsWith(".md"))
                                    return `<span class="text-purple-400">${item}</span>`;
                                if (!item.includes("."))
                                    return `<span class="text-green-400">${item}</span>`;
                                return item;
                            })
                            .join(" ");

                        setHistory((prev) => [
                            ...prev,
                            { type: "output", content: lsOutput, isHtml: true },
                        ]);
                    } else {
                        responseData.output.forEach((item) => {
                            setHistory((prev) => [
                                ...prev,
                                { type: item.type, content: item.content },
                            ]);
                            if (item.currentDir) {
                                setCurrentDirectory(item.currentDir);
                                setTerminalPrompt(
                                    `timmy:${item.currentDir
                                        .split("/")
                                        .pop()}$ `
                                );
                            }
                        });
                    }
                }
            } catch (error) {
                setHistory((prev) => [
                    ...prev,
                    { type: "error", content: `Error: ${error.message}` },
                ]);
            }

            setCurrentCommand("");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCurrentCommand(
                    commandHistory[commandHistory.length - 1 - newIndex]
                );
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCurrentCommand(
                    commandHistory[commandHistory.length - 1 - newIndex]
                );
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCurrentCommand("");
            }
        }
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            className={`bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-auto border border-gray-700
                ${fullScreen ? "h-[calc(100vh-12rem)]" : "h-96"}`}
            onClick={handleTerminalClick}
            ref={terminalRef}
        >
            <div className="space-y-1">
                {history.map((entry, index) => (
                    <div
                        key={index}
                        className={`font-mono ${entry.className || ""} ${
                            entry.type === "error"
                                ? "text-red-400"
                                : entry.type === "input"
                                ? "text-gray-100"
                                : "text-gray-300"
                        }`}
                    >
                        {entry.type === "input" && (
                            <span className="text-blue-400">
                                {entry.prompt}{" "}
                            </span>
                        )}
                        {entry.isHtml ? (
                            <pre
                                className="whitespace-pre"
                                dangerouslySetInnerHTML={{
                                    __html: entry.content,
                                }}
                            />
                        ) : (
                            entry.content
                        )}
                    </div>
                ))}
                <div className="flex items-center">
                    <div className="flex-none">
                        <span className="text-blue-400">{terminalPrompt} </span>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentCommand}
                        onChange={(e) => setCurrentCommand(e.target.value)}
                        onKeyDown={handleCommand}
                        className="bg-transparent focus:outline-none flex-1 ml-2 text-gray-100 min-w-0"
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
}
