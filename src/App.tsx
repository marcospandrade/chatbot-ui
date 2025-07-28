// App.tsx
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import Plot from "react-plotly.js";

export default function App() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState("");
  const [toolUsage, setToolUsage] = useState<Record<string, number>>({});
  console.log({ toolUsage });
  async function sendMessage() {
    if (!input.trim()) return;

    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    const newMessage = { user: input, bot: data.output };

    setMessages([...messages, newMessage]);
    setInput("");

    // Optional: extract and track tool usage
    const tool = extractToolFromResponse(data.output);
    if (tool) {
      setToolUsage((prev: Record<string, number>) => ({
        ...prev,
        [tool]: (prev[tool] || 0) + 1,
      }));
    }
  }

  function extractToolFromResponse(response: string) {
    if (response.includes("result") || response.includes("Result"))
      return "calculator";
    if (response.includes("rephrase") || response.includes("would say"))
      return "rephrase";
    return null;
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <Card>
        <div className="space-y-2">
          <CardContent>
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div className="font-semibold">You:</div>
                <div>{msg.user}</div>
                <div className="font-semibold mt-2">Agent:</div>
                <div>{msg.bot}</div>
                <hr className="my-2" />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardContent>
        </div>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Tool Usage</h2>
          <Plot
            data={[
              {
                type: "bar",
                x: Object.keys(toolUsage),
                y: Object.values(toolUsage),
                marker: { color: "rgba(100, 149, 237, 0.6)" },
              },
            ]}
            layout={{
              width: 400,
              height: 300,
              title: { text: "Tool Calls" },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
